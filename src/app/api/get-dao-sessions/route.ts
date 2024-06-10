import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { dao_name, address } = await req.json();

    // Check if dao_name is provided
    if (!dao_name) {
      return NextResponse.json(
        { success: false, error: "dao_name is required" },
        { status: 400 }
      );
    }

    const client = await connectDB();
    const db = client.db();
    const meetingsCollection = db.collection("meetings");
    const delegatesCollection = db.collection("delegates");

    // Build the query for meetings
    let query: any = { dao_name };

    // Add address condition if provided
    if (address && address.trim() !== "") {
      query.host_address = { $regex: new RegExp(`^${address}$`, "i") };
    }

    const meetings = await meetingsCollection.find(query).toArray();

    // Extract unique addresses from meetings data
    const uniqueAddresses = new Set<string>();
    meetings.forEach(meeting => {
      uniqueAddresses.add(meeting.host_address);
      meeting.attendees.forEach((attendee: any) => {
        uniqueAddresses.add(attendee.attendee_address);
      });
    });

    // Fetch profile data from delegates collection
    const delegates = await delegatesCollection
      .find({ address: { $in: Array.from(uniqueAddresses) } })
      .toArray();

    // Create a map for quick lookup of delegate data
    const delegatesMap = new Map<string, any>();
    delegates.forEach(delegate => {
      delegatesMap.set(delegate.address, delegate);
    });

    // Merge profile data with meeting data
    const mergedMeetings = meetings.map(meeting => {
      const hostInfo = delegatesMap.get(meeting.host_address) || null;
      const attendees = meeting.attendees.map((attendee: any) => {
        const guestInfo = delegatesMap.get(attendee.attendee_address) || null;
        return { ...attendee, guestInfo };
      });
      return { ...meeting, hostInfo, attendees };
    });

    await client.close();

    return NextResponse.json(
      { success: true, data: mergedMeetings },
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
