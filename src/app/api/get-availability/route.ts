import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

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

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Connect to MongoDB
    const client = await connectDB();

    // Access the collection
    const db = client.db();
    // console.log("connected");

    const collection = db.collection("scheduling");

    const documents = await collection.find().toArray();

    client.close();

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data in get availability:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, res: NextResponse<Type[]>) {
  try {
    const { dao_name, userAddress } = await req.json();

    console.log("Initial Data start=========");
    console.log("dao_name", dao_name);
    console.log("userAddress", userAddress);
    console.log("Initial Data end=========");

    const client = await connectDB();

    const db = client.db();
    const collection = db.collection("scheduling");

    const currentDate = new Date();
    console.log("currentDate", currentDate);
    const currentTime = currentDate.toUTCString().toLocaleString();
    console.log("currentTime", currentTime);
    let newDate = currentDate.toLocaleDateString();
    if (newDate.length !== 10 || !newDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      newDate = `${year}-${month}-${day}`;
    }
    console.log("newDate", newDate);
    const query: any = {
      dao_name: dao_name,
      userAddress: userAddress,
      "dateAndRanges.date": { $gte: newDate },
    };

    const sessionData = await collection.find(query).toArray();

    sessionData.forEach((session: any) => {
      session.dateAndRanges = session.dateAndRanges.filter((dateRange: any) => {
        return (
          new Date(dateRange.date) >= new Date(newDate) &&
          (dateRange.date === newDate
            ? dateRange.formattedUTCTime_endTime >= currentTime
            : new Date(dateRange.date) >= new Date(newDate))
        );
      });

      // session.allowedDates = session.allowedDates.filter((date: any) => {
      //   return session.dateAndRanges.some(
      //     (dateRange: any) => dateRange.date === date
      //   );
      // });

      session.allowedDates = [...new Set(session.allowedDates)].filter(
        (date: any) => {
          // Check if any of the dateAndRanges contain this date
          return session.dateAndRanges.some(
            (dateRange: any) => dateRange.date === date
          );
        }
      );
    });

    let finalSessionData = sessionData.filter(
      (session) => session.dateAndRanges.length > 0
    );

    console.log("finalSessionData", finalSessionData);

    client.close();

    return NextResponse.json(
      { success: true, data: finalSessionData },
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

export async function DELETE(req: NextRequest, res: NextResponse<Type[]>) {
  try {
    const {
      dao_name,
      userAddress,
      timeSlotSizeMinutes,
      date,
      startTime,
      endTime,
    } = await req.json();

    console.log("Initial Data start=========");
    console.log("dao_name", dao_name);
    console.log("userAddress", userAddress);
    console.log("timeSlotSizeMinutes", timeSlotSizeMinutes);
    console.log("date", date);
    console.log("startTime", startTime);
    console.log("endTime", endTime);
    console.log("Initial Data end=========");

    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("scheduling");

    const query = { dao_name, userAddress, timeSlotSizeMinutes };
    const document = await collection.findOne(query);

    if (!document) {
      client.close();
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Filter out the dateAndRanges entry
    document.dateAndRanges = document.dateAndRanges.filter((range: any) => {
      return !(
        range.date === date &&
        range.utcTime_startTime === startTime &&
        range.utcTime_endTime === endTime
      );
    });

    // Update allowedDates
    document.allowedDates = [
      ...new Set(document.dateAndRanges.map((range: any) => range.date)),
    ];

    await collection.updateOne(query, {
      $set: {
        dateAndRanges: document.dateAndRanges,
        allowedDates: document.allowedDates,
      },
    });

    console.log("Updated Document", document);

    client.close();

    return NextResponse.json(
      { success: true, data: document },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating document:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
