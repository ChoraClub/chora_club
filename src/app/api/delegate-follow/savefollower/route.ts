import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { dao_details } from "@/config/daoDetails";

type follow_activity = {
  action: string;
  timestamp: Date;
};
type dao_following = {
  isFollowing: boolean;
  follower_address: string;
};
type followings = {
  dao: string;
  following: dao_following[];
};

type dao_follower = {
  address: string;
  isNotification: boolean;
  isFollowing: boolean;
  activity: follow_activity[];
};
type follower_details = {
  dao_name: string;
  follower: dao_follower[];
};

interface FollowerResponseBody {
  address: string;
  followers: follower_details[];
  followings: followings[];
}

export async function POST(
  req: Request,
  res: NextResponse<FollowerResponseBody>
) {
  try {
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("delegate_follow");
    const { address } = await req.json();

    console.log("Finding documents for address in save follower:", address);
    const documents = await collection
      .find({
        address: { $regex: `^${address}$`, $options: "i" },
      })
      .toArray();

    console.log(documents[0]);

    client.close();

    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data in profile:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

    const collections = await db
      .listCollections({ name: "delegate_follow" })
      .toArray();

    if (collections.length === 0) {
      await db.createCollection("delegate_follow");
      console.log("Collection 'delegate_follow' created.");
    } else {
      console.log("Collection 'delegate_follow' already exists.");
    }

    const collection = db.collection("delegate_follow");

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
            $set: {
              address: delegate_address,
            },
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
                [`followings.${existingDaoIndex}.following.${existingFollowingIndex}.timestamp`]:
                  new Date(),
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
                  timestamp: new Date(),
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
              // address: follower_address,
              followings: {
                dao: dao_name,
                following: [
                  {
                    follower_address: delegate_address,
                    isFollowing: true,
                    isNotification: true, // Add isNotification
                    timestamp: new Date(),
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
            // address: follower_address,
            followings: [
              {
                dao: dao,
                following: [
                  {
                    follower_address: delegate_address,
                    isFollowing: true,
                    isNotification: true, // Add isNotification
                    timestamp: new Date(),
                  },
                ],
              },
            ],
          },
        };
        await collection.updateOne({ address: document.address }, updateQuery);
      }
    } else {
      console.log("Creating new document with address and following");
      const newDocument = {
        address: follower_address,
        followings: [
          {
            dao: dao,
            following: [
              {
                follower_address: delegate_address,
                isFollowing: true,
                isNotification: true,
                timestamp: new Date(),
              },
            ],
          },
        ],
      };
      await collection.insertOne(newDocument);
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
