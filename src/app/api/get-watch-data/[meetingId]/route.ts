import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

type Params = {
  meetingId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const meetingId = context.params.meetingId;
  try {
    const client = await connectDB();

    const db = client.db();
    const meetingsCollection = db.collection("meetings");
    const officeHoursCollection = db.collection("office_hours");
    const delegatesCollection = db.collection("delegates");

    const meetingsDocuments = await meetingsCollection
      .find({ meetingId, meeting_status: "Recorded" })
      .toArray();

    const officeHoursDocuments = await officeHoursCollection
      .find({ meetingId, meeting_status: "inactive" })
      .toArray();

    if (meetingsDocuments.length > 0) {
      const mergedData = await Promise.all(
        meetingsDocuments.map(async (session) => {
          // Extract address and dao_name from the meeting
          const { host_address, dao_name, attendees } = session;

          // Query delegates collection based on address and dao_name
          const hostInfo = await delegatesCollection.findOne({
            address: host_address,
            // daoName: dao_name,
          });

          const attendeesProfileDetails = await Promise.all(
            session.attendees.map(async (attendee: any) => {
              // Query delegates collection based on attendee_address
              const attendeeInfo = await delegatesCollection.findOne({
                address: attendee.attendee_address,
              });
              // Add profile details to the attendee object
              attendee.profileInfo = attendeeInfo;
              return attendee;
            })
          );

          session.attendees = attendeesProfileDetails;
          session.hostProfileInfo = hostInfo;

          // Return merged data
          return session;
        })
      );
      client.close();
      return NextResponse.json(
        { success: true, collection: "meetings", data: mergedData },
        { status: 200 }
      );
    } else if (officeHoursDocuments.length > 0) {
      const mergedData = await Promise.all(
        officeHoursDocuments.map(async (session) => {
          // Extract address and dao_name from the meeting
          const { host_address, dao_name } = session;

          // Query delegates collection based on address and dao_name
          const hostInfo = await delegatesCollection.findOne({
            address: host_address,
            daoName: dao_name,
          });
          const attendeesProfileDetails = await Promise.all(
            session.attendees.map(async (attendee: any) => {
              // Query delegates collection based on attendee_address
              const attendeeInfo = await delegatesCollection.findOne({
                address: attendee.attendee_address,
              });
              // Add profile details to the attendee object
              attendee.profileInfo = attendeeInfo;
              return attendee;
            })
          );

          session.attendees = attendeesProfileDetails;
          session.hostProfileInfo = hostInfo;

          // Return merged data
          return session;
        })
      );
      client.close();
      return NextResponse.json(
        {
          success: true,
          collection: "office_hours",
          data: mergedData,
        },
        { status: 200 }
      );
    } else {
      client.close();
      return NextResponse.json({ success: true, data: null }, { status: 404 });
    }
  } catch (error) {
    console.error(
      "Error retrieving data in meeting session data by id:",
      error
    );
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
