import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";
import { connectDB } from "@/config/connectDB";
export const revalidate = 0;

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Connect to MongoDB
    const client = await connectDB();

    // Access the collections
    const db = client.db();
    const meetingsCollection = db.collection("meetings");
    const delegatesCollection = db.collection("delegates");

    // Fetch all documents from the meetings collection
    const meetings = await meetingsCollection
      .find({ meeting_status: "Recorded" })
      .sort({ slot_time: -1 })
      .toArray();

    // Iterate through each meeting document
    // const mergedData = await Promise.all(
    //   meetings.map(async (session) => {
    //     // Extract address and dao_name from the meeting
    //     const { host_address, dao_name, attendees } = session;

    //     // Query delegates collection based on address and dao_name
    //     const hostInfo = await delegatesCollection.findOne({
    //       address: host_address,
    //       // daoName: dao_name,
    //     });

    //     const guestInfo = await delegatesCollection.findOne({
    //       address: attendees[0].attendee_address,
    //       // daoName: dao_name,
    //     });

    //     // Return merged data
    //     return { session, hostInfo, guestInfo };
    //   })
    // );

    const uniqueAddresses = new Set<string>();
    meetings.forEach((meeting) => {
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
    delegates.forEach((delegate) => {
      delegatesMap.set(delegate.address, delegate);
    });

    const mergedData = meetings.map((meeting) => {
      const hostInfo = delegatesMap.get(meeting.host_address) || null;
      const attendees = meeting.attendees.map((attendee: any) => {
        const guestInfo = delegatesMap.get(attendee.attendee_address) || null;
        return { ...attendee, guestInfo };
      });
      return { ...meeting, hostInfo, attendees };
    });

    client.close();

    // Return the merged data
    return NextResponse.json(
      { success: true, data: mergedData },
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
