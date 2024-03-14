import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

interface Meeting {
  meetingId: string;
  startTime: number; // Changed to number
  endTime: number; // Changed to number
}

interface Participant {
  displayName: string;
  joinedAt: string;
  exitedAt: string;
  attestation: string; // Added attestation field
}

interface MeetingTimePerEOA {
  [key: string]: number;
}

async function updateVideoURI(meetingId: string, video_uri: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({ meetingId, video_uri });

  const baseUrl = process.env.NEXTAUTH_URL;

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      `${baseUrl}/api/update-video-uri`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Failed to update video URI");
    }
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error updating video URI:", error);
    // Handle error if required
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const {
      roomId,
      meetingType,
      video_uri,
    }: { roomId: string; meetingType: number; video_uri: string } =
      await req.json();

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

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      meetingId: roomId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    const baseUrl = process.env.NEXTAUTH_URL;
    const hostResponse = await fetch(`${baseUrl}/api/get-host`, requestOptions);
    const hostData = await hostResponse.json();
    console.log("Host Data:", hostData);

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
      ); // Convert to milliseconds
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

      if (!response.ok) {
        throw new Error("Failed to fetch participant list");
      }

      const participantList: { participants: Participant[] } =
        await response.json();
      combinedParticipantLists.push(participantList.participants);

      // Calculate meeting time per participant
      participantList.participants.forEach((participant) => {
        const eoaAddress: string = participant.displayName;
        const joinedAt: Date = new Date(participant.joinedAt);
        const exitedAt: Date = new Date(participant.exitedAt);
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
        if (participant.displayName !== "No name") {
          validParticipants.push(participant);
        }
      }
    }

    // Filter participants based on attendance
    let participantsWithSufficientAttendance: Participant[] = [];
    for (const participant of validParticipants) {
      const participantMeetingTime =
        meetingTimePerEOA[participant.displayName] || 0;
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
        (participant) => participant.displayName !== hostData?.address
      );

    // Add the "attestation" field with value "pending" to each host
    const hosts: Participant[] = [];
    if (
      hostData &&
      combinedParticipantLists
        .flat()
        .some((participant) => participant.displayName === hostData.address)
    ) {
      combinedParticipantLists.flat().forEach((participant) => {
        if (participant.displayName === hostData.address) {
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

    console.log("Earliest Start Time:", new Date(earliestStartTime));
    console.log("Latest End Time:", new Date(latestEndTime));

    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    // Access the collection
    const db = client.db();
    const collection = db.collection("attestation");

    // Check if data with same roomId exists
    const existingData = await collection.findOne({ roomId });

    const earliestStartTimeEpoch = Math.floor(earliestStartTime / 1000);
    const latestEndTimeEpoch = Math.floor(latestEndTime / 1000);

    await updateVideoURI(roomId, video_uri);

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
      video_uri,
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