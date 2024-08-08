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
  const { address, role, feedbackType, data } = await req.json();

  console.log(
    "address, role, feedbackType, data: ",
    address,
    role,
    feedbackType,
    data
  );

  try {
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("feedbacks");

    // Determine the field to update based on the role
    const roleField = role === "host" ? "asSessionHost" : "asSessionAttendee";

    // Construct the update document
    let updateDocument: any = {};

    if (feedbackType === "feedbackGiven") {
      updateDocument = {
        $set: {
          [`feedbackGiven.${roleField}.hasResponded`]: true,
        },
        $push: {
          [`feedbackGiven.${roleField}.feedbackType.platformExperience`]: {
            $each: data.platformExperience,
          },
          [`feedbackGiven.${roleField}.feedbackType.platformRecommendation`]: {
            $each: data.platformRecommendation,
          },
        },
      };
    } else if (feedbackType === "feedbackReceived") {
      // Construct the update document for feedbackReceived
      updateDocument = {
        $set: {
          "feedbackReceived.$[meeting].ratings": [
            {
              $each: [
                {
                  address: data.address,
                  ratings: data.ratings,
                  timestamp: Date.now(),
                },
              ],
            },
          ],
        },
        $addToSet: {
          feedbackReceived: {
            meetingId: data.meetingId,
            ratings: [
              {
                guestAddress: data.guestAddress,
                ratings: data.ratings,
                timestamp: Date.now(),
              },
            ],
          },
        },
      };
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid feedback type" },
        { status: 400 }
      );
    }

    const insertedDocument = await collection.updateOne(
      { address },
      updateDocument,
      { upsert: true, arrayFilters: [{ "meeting.meetingId": data.meetingId }] }
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
