import { MongoClient, MongoClientOptions } from "mongodb";

import { NextResponse, NextRequest } from "next/server";

interface OfficeHours {
  _id: string;
  host_address: string;
  office_hours_slot: Date;
  title: string;
  description: string;
  meeting_status: string;
  dao_name: string;
  video_uri: string;
  meetingId: string;
}

interface Meeting {
  _id: string;
  host_address: string;
  user_address: string;
  slot_time: Date;
  meetingId: string;
  meeting_status: string;
  joined_status: string | null;
  booking_status: string;
  dao_name: string;
  title: string;
  description: string;
}

export async function POST(
  req: NextRequest,
  res: NextResponse<OfficeHours | Meeting | { error: string }>
) {
  try {
    const { meetingId } = await req.json();

    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    const db = client.db();

    const officeHoursCollection = db.collection<OfficeHours>("office_hours");
    const meetingsCollection = db.collection<Meeting>("meetings");

    const officeHours = await officeHoursCollection.findOne({ meetingId });
    const meeting = await meetingsCollection.findOne({ meetingId });

    client.close();

    if (officeHours) {
      return NextResponse.json(
        { address: officeHours.host_address },
        { status: 200 }
      );
    } else if (meeting) {
      return NextResponse.json(
        { address: meeting.host_address },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Office hours or meeting document not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error fetching data:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
