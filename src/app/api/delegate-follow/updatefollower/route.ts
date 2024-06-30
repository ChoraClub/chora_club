import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function PUT(req: NextRequest) {
  try {
    const {
      delegate_address,
      follower_address,
      action,
      updatenotification,
      dao,
    } = await req.json();

    console.log("Received follower details:", {
      delegate_address,
      follower_address,
      action,
      dao,
    });

    console.log("Connecting to MongoDB...");
    const client = await connectDB();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("delegates");

    console.log(`Updating delegate document for ${delegate_address}...`);

    let updateOperation;
    if (action === 1) {
      // Unfollow action
      updateOperation = {
        $set: {
          "followers.$[outer].follower.$[inner].isFollowing": false,
          "followers.$[outer].follower.$[inner].isNotification": false,
        },
        $push: {
          "followers.$[outer].follower.$[inner].activity": {
            action: "unfollow",
            timestamp: new Date(),
          } as any,
        },
      };

      const documents = await collection
        .find({ address: { $regex: `^${follower_address}$`, $options: "i" } })
        .toArray();

      const document = documents[0];

      if (Array.isArray(document.followings)) {
        console.log("Followings array:", JSON.stringify(document.followings));
        console.log("Delegate address:", delegate_address);

        const existingFollowingIndex = document.followings.findIndex(
          (item) =>
            item.follower_address.toLowerCase() ===
            delegate_address.toLowerCase()
        );

        if (existingFollowingIndex !== -1) {
          console.log("Updating following status");
          const updateQuery = {
            $set: {
              [`followings.${existingFollowingIndex}.isFollowing`]: false,
            },
          };
          await collection.updateOne(
            { address: follower_address },
            updateQuery
          );
        } else {
          console.log("Following not found");
        }
      } else {
        console.log("Followings array doesn't exist");
      }
    } else if (action === 2) {
      // Update notification setting only
      updateOperation = {
        $set: {
          "followers.$[outer].follower.$[inner].isNotification":
            updatenotification,
        },
      };
      const followerUpdateResult = await collection.updateOne(
        {
          address: { $regex: `^${follower_address}$`, $options: "i" },
          "followings.follower_address": { $ne: delegate_address },
        },
        {
          $addToSet: {
            followings: {
              follower_address: delegate_address,
              isFollowing: false,
            },
          },
        },
        { upsert: true }
      );
    } else {
      throw new Error("Invalid action");
    }

    const result = await collection.updateOne(
      {
        address: { $regex: `^${delegate_address}$`, $options: "i" },
        "followers.dao_name": dao,
      },
      updateOperation,
      {
        arrayFilters: [
          { "outer.dao_name": dao },
          {
            "inner.address": { $regex: `^${follower_address}$`, $options: "i" },
          },
        ],
      }
    );

    console.log(`Delegate document updated for ${delegate_address}:`, result);

    // const followerUpdateResult = await collection.updateOne(
    //   {
    //     address: { $regex: `^${follower_address}$`, $options: "i" },
    //     "followings.follower_address": { $ne: delegate_address },
    //   },
    //   {
    //     $addToSet: {
    //       followings: {
    //         follower_address: delegate_address,
    //         isFollowing: false,
    //       },
    //     },
    //   },
    //   { upsert: true }
    // );

    await client.close();
    console.log("MongoDB connection closed");

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        {
          success: true,
          modifiedCount: result.modifiedCount,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "No document was updated" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
