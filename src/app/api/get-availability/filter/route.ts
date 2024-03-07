import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

interface Type {
  ensName: string;
  dao_name: string;
  userAddress: string;
  timeSlotSizeMinutes: number;
  allowedDates: string[];
  dateAndRanges: {
    date: string;
    timeRanges: [string, string, string, string][];
    formattedUTCTime_startTime: string;
    utcTime_startTime: string;
    formattedUTCTime_endTime: string;
    utcTime_endTime: string;
  }[];
}

export async function POST(req: NextRequest, res: NextResponse<Type[]>) {
  try {
    const { dao_name, date, startTime, endTime } = await req.json();

    console.log("Initial Data start=========");
    console.log("dao_name", dao_name);
    console.log("date", date);
    console.log("startTime", startTime);
    console.log("endTime", endTime);
    console.log("Initial Data end=========");

    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    const db = client.db();
    const collection = db.collection("scheduling");

    const newDate = new Date().toISOString().split("T")[0];
    console.log("currentDate", newDate);

    const startDateTime = (await startTime)
      ? new Date(`${date ? date : newDate} ${startTime}:00`)
      : null;

    console.log(
      "startDateTime",
      startDateTime?.toISOString().split("T")[1].substring(0, 5)
    );
    const endDateTime = (await endTime)
      ? new Date(`${date ? date : newDate} ${endTime}:00`)
      : null;
    console.log(
      "endDateTime",
      endDateTime?.toISOString().split("T")[1].substring(0, 5)
    );

    const startTimeToSend = startDateTime
      ?.toISOString()
      .split("T")[1]
      .substring(0, 5);

    const endTimeToSend = endDateTime
      ?.toISOString()
      .split("T")[1]
      .substring(0, 5);

    // const currentTime = new Date().toISOString().split("T")[1].substring(0, 5);
    // console.log("currentTime", currentTime);

    let query: any = {
      allowedDates: { $gte: newDate },
    };

    if (dao_name !== null) query.dao_name = dao_name;
    if (date !== null) query.allowedDates = date;
    if (startTime !== null && endTime !== null) {
      console.log("inside start and end not null");
      query.$and = [
        { "dateAndRanges.utcTime_endTime": { $gte: startTimeToSend } },
        { "dateAndRanges.utcTime_startTime": { $lte: endTimeToSend } },
      ];
    }

    const SessionData = await collection.find(query).toArray();

    // console.log("SessionData", SessionData);
    client.close();

    return NextResponse.json(
      { success: true, data: SessionData },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `Error fetching filtered Session Data in availability:`,
      error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
