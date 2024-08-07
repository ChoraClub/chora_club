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
  const { address, role, data } = await req.json();

  try {
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("feedbacks");

    // Determine the field to update based on the role
    const roleField = role === "host" ? "asSessionHost" : "asSessionAttendee";

    // Construct the update document
    const updateDocument: any = {
      $set: {
        [`${roleField}.hasResponded`]: true,
      },
      $push: {
        [`${roleField}.feedbackType.platformExperience`]: {
          $each: data.platformExperience,
        },
        [`${roleField}.feedbackType.platformRecommendation`]: {
          $each: data.platformRecommendation,
        },
      },
    };

    // Add platformExperience and platformRecommendation data to the update document

    // Use upsert to update the document if it exists, or insert a new one if it does not
    const insertedDocument = await collection.updateOne(
      { address },
      updateDocument,
      { upsert: true }
    );

    client.close();
    return NextResponse.json(
      { success: true, data: insertedDocument },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "An error occurred while storing feedback" },
      { status: 500 }
    );
  }
}
