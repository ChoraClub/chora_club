//older end-call

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { BASE_URL } from "@/config/constants";

interface Meeting {
  meetingId: string;
  startTime: number;
  endTime: number;
}

interface ParticipantMetadata {
  displayName: string;
  avatarUrl: string;
  isHandRaised: boolean;
  walletAddress: string;
}

interface Participant {
  peerId: string;
  joinTime: number;
  exitTime: number;
  metadata: ParticipantMetadata;
}

interface ParticipantWithAttestation extends Participant {
  attestation: string;
}

interface MeetingTimePerEOA {
  [key: string]: number;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const {
      roomId,
      meetingType,
      dao_name,
      hostAddress,
    }: {
      roomId: string;
      meetingType: number;
      dao_name: string;
      hostAddress: string;
    } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: "roomId parameter is required" },
        { status: 400 }
      );
    }

    let meetingTypeName: string;
    if (meetingType === 1) {
      meetingTypeName = "session";
    } else if (meetingType === 2) {
      meetingTypeName = "officehours";
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid meetingType" },
        { status: 400 }
      );
    }

    const myHeadersForMeeting = new Headers();
    myHeadersForMeeting.append(
      "x-api-key",
      process.env.NEXT_PUBLIC_API_KEY ?? ""
    );

    const requestOptionsForMeeting = {
      method: "GET",
      headers: myHeadersForMeeting,
    };

    const response = await fetch(
      `https://api.huddle01.com/api/v1/rooms/meetings?roomId=${roomId}`,
      requestOptionsForMeeting
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const meetingsData: { meetings: Meeting[] } = await response.json();
    console.log("meetingsData...", meetingsData);
    const meetings: Meeting[] = meetingsData.meetings;

    // Calculate total meeting time
    let totalMeetingTimeInMinutes = 0;

    for (const meeting of meetings) {
      const startTime = new Date(meeting.startTime);
      const endTime = new Date(meeting.endTime);
      const durationInMinutes = Math.floor(
        (endTime.valueOf() - startTime.valueOf()) / (1000 * 60)
      );
      totalMeetingTimeInMinutes += durationInMinutes;
    }

    console.log("Total meeting time:", totalMeetingTimeInMinutes, "minutes");

    const combinedParticipantLists: Participant[][] = [];
    const meetingTimePerEOA: MeetingTimePerEOA = {};

    for (const meeting of meetings) {
      const response = await fetch(
        `https://api.huddle01.com/api/v1/rooms/participant-list?meetingId=${meeting.meetingId}`,
        requestOptionsForMeeting
      );
      console.log("response", response);
      if (!response.ok) {
        throw new Error("Failed to fetch participant list");
      }

      const participantList: { participants: Participant[] } =
        await response.json();
      combinedParticipantLists.push(participantList.participants);

      // Calculate meeting time per participant
      participantList.participants.forEach((participant) => {
        const eoaAddress: string = participant?.metadata?.walletAddress;
        const joinedAt: Date = new Date(participant.joinTime);
        const exitedAt: Date = new Date(participant.exitTime);
        const durationInMinutes: number = Math.floor(
          (exitedAt.valueOf() - joinedAt.valueOf()) / (1000 * 60)
        );

        if (!meetingTimePerEOA[eoaAddress]) {
          meetingTimePerEOA[eoaAddress] = 0;
        }
        meetingTimePerEOA[eoaAddress] += durationInMinutes;
      });
    }

    // Log a brief summary of meeting time for each EOA
    console.log("Meeting time per EOA:");
    for (const eoaAddress in meetingTimePerEOA) {
      console.log(`${eoaAddress}: ${meetingTimePerEOA[eoaAddress]} minutes`);
    }

    // Calculate minimum attendance time required
    const minimumAttendanceTime = totalMeetingTimeInMinutes * 0.5;
    // Filter out participants with display name "No name"
    const validParticipants: Participant[] = [];
    for (const participantList of combinedParticipantLists) {
      for (const participant of participantList) {
        if (participant?.metadata?.displayName !== "No name") {
          validParticipants.push(participant);
        }
      }
    }

    // Filter participants based on attendance
    let participantsWithSufficientAttendance: ParticipantWithAttestation[] = [];
    for (const participant of validParticipants) {
      const participantMeetingTime =
        meetingTimePerEOA[participant?.metadata?.walletAddress] || 0;
      if (participantMeetingTime >= minimumAttendanceTime) {
        participantsWithSufficientAttendance.push({
          ...participant,
          attestation: "pending",
        });
      }
    }
    // Remove host from participants with sufficient attendance
    participantsWithSufficientAttendance =
      participantsWithSufficientAttendance.filter(
        (participant) =>
          participant?.metadata?.walletAddress &&
          participant?.metadata?.walletAddress.toLowerCase() !==
            hostAddress.toLowerCase()
      );

    // Add the "attestation" field with value "pending" to each host
    const hosts: ParticipantWithAttestation[] = [];
    if (
      hostAddress &&
      combinedParticipantLists
        .flat()
        .some(
          (participant) =>
            participant?.metadata?.walletAddress &&
            participant?.metadata?.walletAddress.toLowerCase() ===
              hostAddress.toLowerCase()
        )
    ) {
      combinedParticipantLists.flat().forEach((participant) => {
        if (
          participant?.metadata?.walletAddress &&
          participant?.metadata?.walletAddress.toLowerCase() ===
            hostAddress.toLowerCase()
        ) {
          hosts.push({ ...participant, attestation: "pending" });
        }
      });
    }

    let earliestStartTime = Infinity;
    let latestEndTime = -Infinity;

    // Find earliest startTime and latest endTime
    meetings.forEach((meeting) => {
      earliestStartTime = Math.min(earliestStartTime, meeting.startTime);
      latestEndTime = Math.max(latestEndTime, meeting.endTime);
    });

    console.log("Earliest Start Time:", earliestStartTime);
    console.log("Latest End Time:", latestEndTime);

    console.log("Earliest Start Time:", new Date(earliestStartTime));
    console.log("Latest End Time:", new Date(latestEndTime));

    const client = await connectDB();

    // Access the collection
    const db = client.db();
    const collection = db.collection("attestation");

    // Check if data with same roomId exists
    const existingData = await collection.findOne({ roomId });

    const earliestStartTimeEpoch = Math.floor(earliestStartTime / 1000);
    const latestEndTimeEpoch = Math.floor(latestEndTime / 1000);

    // Prepare the data to store
    const dataToStore = {
      roomId,
      participants: participantsWithSufficientAttendance,
      meetingTimePerEOA,
      totalMeetingTimeInMinutes,
      hosts,
      startTime: earliestStartTimeEpoch,
      endTime: latestEndTimeEpoch,
      meetingType: meetingTypeName,
      attestation: "pending",
      dao_name: dao_name,
    };

    if (existingData) {
      // If data exists, update it
      await collection.updateOne({ roomId }, { $set: dataToStore });
      console.log(`Data with roomId ${roomId} updated.`);
    } else {
      // If data doesn't exist, insert new data
      await collection.insertOne(dataToStore);
      console.log(`New data with roomId ${roomId} inserted.`);
    }

    // Close the MongoDB client connection
    await client.close();

    return NextResponse.json(
      {
        success: true,
        data: participantsWithSufficientAttendance,
        meetingTimePerEOA,
        totalMeetingTimeInMinutes,
        hosts,
        startTime: earliestStartTimeEpoch,
        endTime: latestEndTimeEpoch,
        meetingType: meetingTypeName,
        dao_name: dao_name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
