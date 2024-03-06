import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

// Define the response body type
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
    // const { dao_name, date } = await req.json();
    const { dao_name, date, startTime, endTime } = await req.json();

    console.log("dao_name", dao_name);
    console.log("date", date);
    console.log("startTime", startTime);
    console.log("endTime", endTime);

    // Connect to MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    // Access the collection
    const db = client.db();
    const collection = db.collection("scheduling");
    const newDate = new Date().toISOString().split("T")[0];
    // console.log("newDate", newDate);

    if (
      dao_name === null &&
      date === null &&
      startTime === null &&
      endTime === null
    ) {
      console.log("inside if all null");
      console.log("newDate if all null", newDate);
      const SessionData = await collection
        .find({
          allowedDates: { $gte: newDate },
        })
        .toArray();

      client.close();

      return NextResponse.json(
        { success: true, data: SessionData },
        { status: 200 }
      );
    } else if (dao_name === null && date && startTime && endTime) {
      console.log("second");
      const SessionData = await collection
        .find({
          allowedDates: date,
          $and: [
            { "dateAndRanges.utcTime_endTime": { $gte: startTime } },
            { "dateAndRanges.utcTime_startTime": { $lte: endTime } },
          ],
        })
        .toArray();
      client.close();

      return NextResponse.json(
        { success: true, data: SessionData },
        { status: 200 }
      );
    } else if (date === null && dao_name && startTime && endTime) {
      console.log("third");
      const SessionData = await collection
        .find({
          dao_name: dao_name,
          allowedDates: { $gte: newDate },
          $and: [
            { "dateAndRanges.utcTime_endTime": { $gte: startTime } },
            { "dateAndRanges.utcTime_startTime": { $lte: endTime } },
          ],
        })
        .toArray();

      client.close();

      return NextResponse.json(
        { success: true, data: SessionData },
        { status: 200 }
      );
    } else if (dao_name === null && date === null && startTime && endTime) {
      console.log("fourth");
      const SessionData = await collection
        .find({
          allowedDates: { $gte: newDate },
          $and: [
            { "dateAndRanges.utcTime_endTime": { $gte: startTime } },
            { "dateAndRanges.utcTime_startTime": { $lte: endTime } },
          ],
        })
        .toArray();

      client.close();

      return NextResponse.json(
        { success: true, data: SessionData },
        { status: 200 }
      );
    } else if (
      dao_name === null &&
      date === null &&
      startTime &&
      endTime === null
    ) {
      console.log("fifth");
      const SessionData = await collection
        .find({
          allowedDates: { $gte: newDate },
          $and: [
            { "dateAndRanges.utcTime_startTime": { $lte: startTime } },
            { "dateAndRanges.utcTime_endTime": { $gte: startTime } },
          ],
        })
        .toArray();

      client.close();

      return NextResponse.json(
        { success: true, data: SessionData },
        { status: 200 }
      );
    } else if (
      dao_name === null &&
      date === null &&
      startTime === null &&
      endTime
    ) {
      console.log("sixth");
      const SessionData = await collection
        .find({
          allowedDates: { $gte: newDate },
          $and: [
            { "dateAndRanges.utcTime_startTime": { $lte: endTime } },
            { "dateAndRanges.utcTime_endTime": { $gte: endTime } },
          ],
        })
        .toArray();

      client.close();

      return NextResponse.json(
        { success: true, data: SessionData },
        { status: 200 }
      );
    } else if (
      dao_name &&
      date === null &&
      startTime === null &&
      endTime === null
    ) {
      console.log("seventh");
      const SessionData = await collection
        .find({
          dao_name: dao_name,
          allowedDates: { $gte: newDate },
        })
        .toArray();

      client.close();

      return NextResponse.json(
        { success: true, data: SessionData },
        { status: 200 }
      );
    } else if (
      dao_name === null &&
      date &&
      startTime === null &&
      endTime === null
    ) {
      console.log("eighth");
      const SessionData = await collection
        .find({
          allowedDates: date,
        })
        .toArray();

      client.close();

      return NextResponse.json(
        { success: true, data: SessionData },
        { status: 200 }
      );
    }
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
