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

  const client = await connectDB();
  try {
    const db = client.db();
    const collection = db.collection("feedbacks");

    // Determine the field to update based on the role
    const roleField = role === "host" ? "asSessionHost" : "asSessionAttendee";

    // Construct the update document
    let updateDocument: any = {};
    let arrayFilters: any[] = [];

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
      const existingDocument = await collection.findOne({ address });

      if (existingDocument) {
        // Check if the meetingId exists in feedbackReceived
        const meetingExists = existingDocument.feedbackReceived?.some(
          (meeting: any) => meeting.meetingId === data.meetingId
        );

        if (meetingExists) {
          // Add the data to the existing meeting's ratings array
          updateDocument = {
            $push: {
              "feedbackReceived.$[meeting].ratings": {
                guestAddress: data.guestAddress,
                ratings: data.ratings,
                timestamp: Date.now(),
              },
            },
          };
          arrayFilters = [{ "meeting.meetingId": data.meetingId }];
        } else {
          // Add a new meetingId with ratings array
          updateDocument = {
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
        }
      } else {
        // Create a new document if the address doesn't exist
        console.log("Document doesn't exists");
        updateDocument = {
          $set: {
            address,
            feedbackReceived: [
              {
                meetingId: data.meetingId,
                ratings: [
                  {
                    guestAddress: data.guestAddress,
                    ratings: data.ratings,
                    timestamp: Date.now(),
                  },
                ],
              },
            ],
          },
        };
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid feedback type" },
        { status: 400 }
      );
    }

    const insertedDocument = await collection.updateOne(
      { address },
      updateDocument,
      { upsert: true, arrayFilters }
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
  } finally {
    client.close();
  }
}
