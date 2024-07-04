import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { dao_details } from "@/config/daoDetails";

export async function PUT(req: NextRequest) {
  try {
    const { delegate_address, follower_address, dao } = await req.json();

    if (dao === null) {
      return NextResponse.json(
        { message: "Dao is not blank" },
        { status: 404 }
      );
    }

    console.log("Received follower details:", {
      delegate_address,
      follower_address,
      dao,
    });

    console.log("Connecting to MongoDB...");
    const client = await connectDB();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("delegates");

    console.log(`Updating delegate document for ${delegate_address}...`);

    // First, try to update an existing follower entry
    // const updateResult = await collection.updateOne(
    //   {
    //     address: { $regex: `^${delegate_address}$`, $options: "i" },
    //     "followers.dao_name": dao,
    //     "followers.follower.address":follower_address,
    //   },
    //   {
    //     $set: {
    //       "followers.$.isFollowing": true,
    //       "followers.$.isNotification": true,
    //     },
    //     $push: {
    //       "followers.$.activity": {
    //         action: "follow",
    //         timestamp: new Date(),
    //       } as any,
    //     },
    //   }
    // );

    const updateResult = await collection.updateOne(
      {
        address: { $regex: `^${delegate_address}$`, $options: "i" },
        "followers.dao_name": dao,
      },
      {
        $set: {
          "followers.$[outer].follower.$[inner].isFollowing": true,
          "followers.$[outer].follower.$[inner].isNotification": true,
        },
        $push: {
          "followers.$[outer].follower.$[inner].activity": {
            action: "follow",
            timestamp: new Date(),
          } as any,
        },
      },
      {
        arrayFilters: [
          { "outer.dao_name": dao },
          { "inner.address": follower_address },
        ],
      }
    );

    // If no document was modified, it means the follower doesn't exist yet
    if (updateResult.modifiedCount === 0) {
      // Try to add a new follower to an existing DAO entry, or create a new one if needed
      const insertResult = await collection.updateOne(
        {
          address: { $regex: `^${delegate_address}$`, $options: "i" },
          "followers.dao_name": dao,
        },
        {
          $addToSet: {
            "followers.$.follower": {
              address: follower_address,
              isNotification: true,
              isFollowing: true,
              activity: [
                {
                  action: "follow",
                  timestamp: new Date(),
                },
              ],
            },
          },
        }
      );

      // If no document was modified, it means the DAO entry doesn't exist, so create a new one
      if (insertResult.modifiedCount === 0) {
        await collection.updateOne(
          { address: { $regex: `^${delegate_address}$`, $options: "i" } },
          {
            $addToSet: {
              followers: {
                dao_name: dao,
                follower: [
                  {
                    address: follower_address,
                    isNotification: true,
                    isFollowing: true,
                    activity: [
                      {
                        action: "follow",
                        timestamp: new Date(),
                      },
                    ],
                  },
                ],
              },
            },
          },
          { upsert: true }
        );
      }
    } else {
      console.log(
        `Existing follower updated for ${delegate_address}:`,
        updateResult
      );
    }

    const documents = await collection
      .find({ address: { $regex: `^${follower_address}$`, $options: "i" } })
      .toArray();

    if (documents.length > 0) {
      const document = documents[0];
      console.log(document);

      const dao_name = dao; // Replace with actual DAO name

      // Check if followings array exists
      if (Array.isArray(document.followings)) {
        const existingDaoIndex = document.followings.findIndex(
          (item) => item.dao === dao_name
        );

        if (existingDaoIndex !== -1) {
          // DAO exists in followings array
          const existingFollowingIndex = document.followings[
            existingDaoIndex
          ].following.findIndex(
            (item: any) => item.follower_address === delegate_address
          );

          if (existingFollowingIndex !== -1) {
            console.log("Updating existing following for DAO");
            const updateQuery = {
              $set: {
                [`followings.${existingDaoIndex}.following.${existingFollowingIndex}.isFollowing`]:
                  true,
                [`followings.${existingDaoIndex}.following.${existingFollowingIndex}.isNotification`]:
                  true, // Add isNotification
              },
            };
            await collection.updateOne(
              { address: document.address },
              updateQuery
            );
          } else {
            console.log("Adding new following for existing DAO");
            const updateQuery = {
              $push: {
                [`followings.${existingDaoIndex}.following`]: {
                  follower_address: delegate_address,
                  isFollowing: true,
                  isNotification: true, // Add isNotification
                } as any,
              },
            };
            await collection.updateOne(
              { address: document.address },
              updateQuery
            );
          }
        } else {
          console.log("Adding new DAO and following");
          const updateQuery = {
            $push: {
              followings: {
                dao: dao_name,
                following: [
                  {
                    follower_address: delegate_address,
                    isFollowing: true,
                    isNotification: true, // Add isNotification
                  },
                ],
              },
            } as any,
          };
          await collection.updateOne(
            { address: document.address },
            updateQuery
          );
        }
      } else {
        console.log("Creating followings array with DAO");
        const updateQuery = {
          $set: {
            followings: [
              {
                dao: dao,
                following: [
                  {
                    follower_address: delegate_address,
                    isFollowing: true,
                    isNotification: true, // Add isNotification
                  },
                ],
              },
            ],
          },
        };
        await collection.updateOne({ address: document.address }, updateQuery);
      }
    }

    await client.close();
    console.log("MongoDB connection closed");

    return NextResponse.json(
      {
        success: true,
        modifiedCount: updateResult.modifiedCount,
        upsertedCount: updateResult.upsertedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
