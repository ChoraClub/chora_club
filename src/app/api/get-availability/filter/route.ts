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

    const startDateTime = startTime
      ? new Date(`${date ? date : newDate} ${startTime}:00`)
      : null;

    const endDateTime = endTime
      ? new Date(`${date ? date : newDate} ${endTime}:00`)
      : null;

    console.log("startDateTime", startDateTime);
    console.log("endDateTime", endDateTime);

    const startTimeToSend = startDateTime
      ? startDateTime.toISOString().split("T")[1].substring(0, 5)
      : undefined;

    const endTimeToSend = endDateTime
      ? endDateTime.toISOString().split("T")[1].substring(0, 5)
      : undefined;

    console.log("startTimeToSend", startTimeToSend);
    console.log("endTimeToSend", endTimeToSend);

    let query: any = {
      "dateAndRanges.date": { $gte: newDate },
    };

    if (dao_name !== null) query.dao_name = dao_name;
    if (date !== null) query["dateAndRanges.date"] = date;
    // if (startTime !== null && endTime !== null) {
    //   console.log("inside start and end not null");
    //   query.$and = [
    //     { "dateAndRanges.utcTime_endTime": { $gte: startTimeToSend } },
    //     { "dateAndRanges.utcTime_startTime": { $lte: endTimeToSend } },
    //   ];
    // }
    // if (startTime !== null && endTime === null) {
    //   console.log("inside startTime not null");
    //   query.$and = [
    //     { "dateAndRanges.utcTime_startTime": { $lte: startTimeToSend } },
    //     { "dateAndRanges.utcTime_endTime": { $gte: startTimeToSend } },
    //   ];
    // }
    // if (endTime !== null && startTime === null) {
    //   console.log("inside endTime not null");
    //   query.$and = [
    //     { "dateAndRanges.utcTime_startTime": { $lte: endTimeToSend } },
    //     { "dateAndRanges.utcTime_endTime": { $gte: endTimeToSend } },
    //   ];
    // }

    const sessionData = await collection.find(query).toArray();

    console.log("SessionData", sessionData);

    sessionData.forEach((session: any) => {
      session.dateAndRanges = session.dateAndRanges.filter((dateRange: any) => {
        return new Date(dateRange.date) >= new Date(newDate);
      });
    });

    // Filter out sessions that have no dateAndRanges left
    let finalSessionData = sessionData.filter(
      (session) => session.dateAndRanges.length > 0
    );

    console.log("finalSessionData", finalSessionData);

    // If both startTime and endTime are provided, apply additional filtering
    if (startTime !== null && endTime !== null) {
      console.log("when both startTime and endTime is given");
      finalSessionData = finalSessionData.filter((session) => {
        return session.dateAndRanges.some((dateRange: any) => {
          // console.log(new Date(dateRange.date) >= new Date(newDate));
          return (
            new Date(dateRange.date) >= new Date(date ? date : newDate) &&
            dateRange.utcTime_startTime <= endTimeToSend! &&
            dateRange.utcTime_endTime >= startTimeToSend!
          );
        });
      });
    }

    if (startTime !== null && endTime === null) {
      console.log("when only startTime is given");
      finalSessionData = finalSessionData.filter((session) => {
        return session.dateAndRanges.some((dateRange: any) => {
          // console.log(new Date(dateRange.date) >= new Date(newDate));
          return (
            new Date(dateRange.date) >= new Date(date ? date : newDate) &&
            dateRange.utcTime_startTime <= startTimeToSend! &&
            dateRange.utcTime_endTime >= startTimeToSend!
          );
        });
      });
    }
    if (startTime === null && endTime !== null) {
      console.log("when only endTime is given");
      finalSessionData = finalSessionData.filter((session) => {
        return session.dateAndRanges.some((dateRange: any) => {
          // console.log(new Date(dateRange.date) >= new Date(newDate));
          return (
            new Date(dateRange.date) >= new Date(date ? date : newDate) &&
            dateRange.utcTime_startTime <= endTimeToSend! &&
            dateRange.utcTime_endTime >= endTimeToSend!
          );
        });
      });
    }

    console.log("finalSessionData", finalSessionData);

    client.close();

    return NextResponse.json(
      { success: true, data: finalSessionData, fetchedData: sessionData },
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
