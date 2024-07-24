import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { promises } from "dns";

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
    const collection = db.collection("delegate_follow");

    console.log(`Updating delegate document for ${delegate_address}...`);

    let updateOperation;
    if (action === 1) {
      // Unfollow action
      await updateFollowing(
        collection,
        follower_address,
        delegate_address,
        dao,
        action,
        updatenotification
      );
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

        // For unfollow action
      };
    } else if (action === 2) {
      // Update notification setting only
      await updateFollowing(
        collection,
        follower_address,
        delegate_address,
        dao,
        action,
        updatenotification
      );
      updateOperation = {
        $set: {
          "followers.$[outer].follower.$[inner].isNotification":
            updatenotification,
        },
      };
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

async function updateFollowing(
  collection: any,
  follower_address: string,
  delegate_address: string,
  dao: string,
  action: number,
  updatenotification?: boolean
): Promise<void> {
  const documents = await collection
    .find({ address: { $regex: `^${follower_address}$`, $options: "i" } })
    .toArray();

  if (documents.length > 0) {
    const document = documents[0];
    const dao_name = dao;

    if (Array.isArray(document.followings)) {
      console.log("Followings array:", JSON.stringify(document.followings));
      console.log("Delegate address:", delegate_address);

      const existingDaoIndex = document.followings.findIndex(
        (item: any) => item.dao === dao_name
      );

      if (existingDaoIndex !== -1) {
        const daoFollowings = document.followings[existingDaoIndex].following;
        const existingFollowingIndex = daoFollowings.findIndex(
          (item: any) =>
            item.follower_address.toLowerCase() ===
            delegate_address.toLowerCase()
        );

        if (existingFollowingIndex !== -1) {
          let updateQuery;

          if (action === 1) {
            // Unfollow action
            updateQuery = {
              $set: {
                [`followings.${existingDaoIndex}.following.${existingFollowingIndex}.isFollowing`]:
                  false,
                [`followings.${existingDaoIndex}.following.${existingFollowingIndex}.isNotification`]:
                  false,
              },
            };
          } else if (action === 2) {
            // Update notification setting only
            updateQuery = {
              $set: {
                [`followings.${existingDaoIndex}.following.${existingFollowingIndex}.isNotification`]:
                  updatenotification,
              },
            };
          } else {
            throw new Error("Invalid action");
          }

          console.log("Updating following status");
          await collection.updateOne(
            { address: follower_address },
            updateQuery
          );
        } else {
          console.log("Following not found for this DAO");
        }
      } else {
        console.log("DAO not found in followings");
      }
    } else {
      console.log("Followings array doesn't exist");
    }
  } else {
    console.log("Document not found");
  }
}
