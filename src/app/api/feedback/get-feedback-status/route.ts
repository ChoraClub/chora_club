//endpoint for fetching feedback status
import {
  StoreFeedbackInterface,
  FeedbackType,
} from "@/components/FeedbackPopup/FeedbackUtils";
import { connectDB } from "@/config/connectDB";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  res: NextResponse<StoreFeedbackInterface>
) {
  const { address, role } = await req.json();

  const client = await connectDB();
  try {
    const db = client.db();
    const collection = db.collection("feedbacks");

    // Determine the field to update based on the role
    const roleField = role === "host" ? "asSessionHost" : "asSessionAttendee";

    //Logic

    const feedbackDoc = await collection.findOne({ address });

    if (!feedbackDoc) {
      return NextResponse.json(
        { data: false, message: "Address not found in the database" },
        { status: 404 }
      );
    }

    // Check if the role field exists in the document
    const hasResponded =
      feedbackDoc.feedbackGiven?.[roleField]?.hasResponded ?? false;

    return NextResponse.json(
      { success: true, data: hasResponded },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "An error occurred while storing feedback" },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
