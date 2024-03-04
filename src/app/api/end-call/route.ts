import { NextRequest, NextResponse } from "next/server";

interface Meeting {
  meetingId: string;
  startTime: number; // Changed to number
  endTime: number; // Changed to number
}

interface Participant {
  displayName: string;
  joinedAt: string;
  exitedAt: string;
}

interface MeetingTimePerEOA {
  [key: string]: number;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { roomId }: { roomId: string } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: "roomId parameter is required" },
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
    const baseUrl = process.env.BASE_URL;
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

    // Concatenate participant lists into one array
    let allParticipants: Participant[] = combinedParticipantLists.reduce(
      (acc, participants) => acc.concat(participants),
      []
    );

    // Remove host from participants and add to hosts object
    const hosts: Participant[] = [];
    if (
      hostData &&
      allParticipants.some(
        (participant) => participant.displayName === hostData
      )
    ) {
      allParticipants = allParticipants.filter((participant) => {
        if (participant.displayName === hostData) {
          hosts.push(participant);
          return false;
        }
        return true;
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: allParticipants,
        meetingTimePerEOA,
        totalMeetingTimeInMinutes,
        hosts, // Adding hosts object to the response
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
