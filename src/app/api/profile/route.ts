import { connectDB } from "@/config/connectDB";
import { Item } from "@radix-ui/react-dropdown-menu";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// // Define the request body type
// interface DelegateRequestBody {
//   address: string;
//   image: string;
//   description: string;
//   daoName: string;
//   isDelegate: boolean;
//   displayName: string;
//   emailId: string;
//   socialHandles: {
//     twitter: string;
//     discord: string;
//     discourse: string;
//     github: string;
//   };
// }

type follow_activity = {
  action: string;
  timestamp: Date;
};
type follower_details = {
  address: string;
  isNotification: boolean;
  isFollowing: boolean;
  activity: follow_activity[];
};
type dao_following = {
  isFollowing: boolean;
  isNotification:boolean;
  follower_address: string;
  timestamp:Date;
};
type followings = {
  dao: string;
  following: dao_following[];
};

type network_details = {
  dao_name: string;
  network: string;
  discourse: string;
  description: string;
};

interface DelegateRequestBody {
  address: string;
  image: string;
  // description: string;
  isDelegate: boolean;
  displayName: string;
  emailId: string;
  isEmailVisible:boolean;
  socialHandles: {
    twitter: string;
    discord: string;
    github: string;
  };
  networks: network_details[];
  followers: follower_details[];
  followings: followings[];
}

// Define the response body type
// interface DelegateResponseBody {
//   success: boolean;
//   data?: {
//     id: string;
//     address: string;
//     image: string;
//     daoName: string;
//     description: string;
//     isDelegate: boolean;
//     displayName: string;
//     emailId: string;
//     socialHandles: {
//       twitter: string;
//       discord: string;
//       discourse: string;
//       github: string;
//     };
//   } | null;
//   error?: string;
// }

interface DelegateResponseBody {
  success: boolean;
  data?: {
    id: string;
    address: string;
    image: string;
    // description: string;
    isDelegate: boolean;
    displayName: string;
    emailId: string;
    isEmailVisible:boolean;
    socialHandles: {
      twitter: string;
      discord: string;
      github: string;
    };
    networks: network_details[];
    followers: follower_details[];
    followings: followings[];
  } | null;
  error?: string;
}

export async function POST(
  req: NextRequest,
  res: NextApiResponse<DelegateResponseBody>
) {
  const {
    address,
    image,
    isDelegate,
    displayName,
    emailId,
    isEmailVisible,
    socialHandles,
    networks,
  }: DelegateRequestBody = await req.json();

  try {
    // Connect to your MongoDB database
    // console.log("Connecting to MongoDB...");
    const client = await connectDB();
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("delegates");

    // Insert the new delegate document
    // console.log("Inserting delegate document...");
    const result = await collection.insertOne({
      address,
      image,
      isDelegate,
      displayName,
      emailId,
      isEmailVisible,
      socialHandles,
      networks,
    });
    console.log("Delegate document inserted:", result);

    client.close();
    // console.log("MongoDB connection closed");

    if (result.insertedId) {
      // Retrieve the inserted document using the insertedId
      // console.log("Retrieving inserted document...");
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });
      // console.log("Inserted document retrieved");
      return NextResponse.json({ result: insertedDocument }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to retrieve inserted document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error storing delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  res: NextApiResponse<DelegateResponseBody>
) {
  const {
    address,
    image,
    isDelegate,
    displayName,
    emailId,
    isEmailVisible,
    socialHandles,
    networks,
  }: DelegateRequestBody = await req.json();

  console.log("Received Properties:");
  console.log("address:", address);
  console.log("image:", image);
  console.log("isDelegate:", isDelegate);
  console.log("displayName:", displayName);
  console.log("networks: ", networks);
  console.log("emailId:", emailId);
  console.log("socialHandles:", socialHandles);
  console.log('Emailstatus',isEmailVisible);

  try {
    // Connect to your MongoDB database
    console.log("Connecting to MongoDB...");
    const client = await connectDB();
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("delegates");

    // Prepare update fields
    const updateFields: any = {};
    if (image !== undefined) updateFields.image = image;
    if (isDelegate !== undefined) updateFields.isDelegate = isDelegate;
    if (displayName !== undefined) updateFields.displayName = displayName;
    if (emailId !== undefined) updateFields.emailId = emailId;
    if (socialHandles !== undefined) updateFields.socialHandles = socialHandles;
    if(isEmailVisible!=undefined) updateFields.isEmailVisible=isEmailVisible;

    // const documents = await collection
    //   .find({
    //     address: { $regex: `^${address}$`, $options: "i" },
    //     // daoName: daoName,
    //   })
    //   .toArray();

    // let flag=0;
    // documents[0].networks.map((item: any) => {
    //   if(item.network==networks[0].network){
    //     flag=1;
    //   }
    // });

    // if(flag==1){
    //   //update give discourse if user try to update discourse
    //   console.log('exist call');
    //   documents[0].networks=networks;

    // }
    // else{
    //   console.log('push call');
    //   documents[0].networks.push(networks);
    // }

    const documents = await collection
      .find({ address: { $regex: `^${address}$`, $options: "i" } })
      .toArray();

    // if (documents.length > 0) {
    //   const document = documents[0];
    //   const existingNetworkIndex = document.networks.findIndex(
    //     (item: any) => item.dao_name === networks[0].dao_name
    //   );

    //   if (existingNetworkIndex !== -1) {
    //     console.log("exist call");
    //     const updateQuery = {
    //       $set: {
    //         [`networks.${existingNetworkIndex}`]: networks[0],
    //       },
    //     };
    //     await collection.updateOne({ address: document.address }, updateQuery);
    //   } else {
    //     console.log("push call");
    //     const updateQuery = {
    //       $push: {
    //         networks: networks[0],
    //       },
    //     };
    //     /* @ts-ignore */
    //     await collection.updateOne({ address: document.address }, updateQuery);
    //   }
    // }

    if (documents.length > 0) {
      const document = documents[0];

      // Check if networks array is provided and is not empty
      if (networks?.length > 0) {
        const existingNetworkIndex = document.networks.findIndex(
          (item: any) => item.dao_name === networks[0].dao_name
        );

        if (existingNetworkIndex !== -1) {
          console.log("exist call");
          const updateQuery = {
            $set: {
              [`networks.${existingNetworkIndex}`]: networks[0],
            },
          };
          await collection.updateOne(
            { address: document.address },
            updateQuery
          );
        } else {
          console.log("push call");
          const updateQuery = {
            $push: {
              networks: networks[0],
            },
          };
          await collection.updateOne(
            { address: document.address },
            /* @ts-ignore */
            updateQuery
          );
        }
      }
    }

    // Update the delegate document
    console.log("Updating delegate document...");
    const result = await collection.updateOne(
      { address: address },
      { $set: updateFields }
    );
    console.log("Delegate document updated:", result);

    client.close();
    console.log("MongoDB connection closed");

    if (result.modifiedCount > 0) {
      // If at least one document was modified
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // If no document was modified
      return NextResponse.json(
        { error: "No document found to update" },
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
