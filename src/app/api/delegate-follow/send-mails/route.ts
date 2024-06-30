import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { sendMail, compileBookedSessionTemplate } from "@/libs/mail";

export async function PUT(req: NextRequest) {
  try {
    const { address, daoName } = await req.json();

    console.log("Delegate address:", address);
    console.log("DAO name:", daoName);

    console.log("Connecting to MongoDB...");
    const client = await connectDB();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("delegates");
    
    // Find the document by address
    const document = await collection.findOne({ address });

    if (!document) {
      client.close();
      return NextResponse.json(
        {
          message: "Delegate document not found",
        },
        { status: 404 }
      );
    }

    // Find the specific DAO in the followers array
    const daoFollowers = document.followers.find((dao:any) => dao.dao_name === daoName);

    if (!daoFollowers) {
      client.close();
      return NextResponse.json(
        {
          message: "Specified DAO not found for this delegate",
        },
        { status: 404 }
      );
    }

    // Extract follower addresses who have notifications enabled
    const followerAddresses = daoFollowers.follower
      .filter((follower:any) => follower.isNotification === true)
      .map((follower:any) => follower.address);

    // Find emails associated with follower addresses
    const followerEmails = await collection
      .find(
        { address: { $in: followerAddresses } },
        { projection: { emailId: 1, address: 1 } }
      )
      .toArray();

    console.log("Follower emails:", followerEmails);

    // Extract only the valid emailId values
    const emailIds = followerEmails
      .map(follower => follower.emailId)
      .filter(email => email && email.trim() !== ""); // Remove empty or null emails

    for (const emailId of emailIds) {
      try {
        await sendMail({
          to: emailId,
          name: "Chora Club",
          subject: "Your Delegate Has Scheduled a New Session",
          body: compileBookedSessionTemplate(
            "Dear Chora Club Member,We're thrilled to inform you that a delegate from a DAO you're following has just scheduled a new session!",
            "Don't miss out—book your spot now to dive deeper into the Web3 Ecosystem."
          ),
        });
        console.log(`Email sent successfully to ${emailId}`);
      } catch (error) {
        console.error(`Error sending mail to ${emailId}:`, error);
      }
    }

    client.close();

    // Return the email addresses
    return NextResponse.json({
      message: `Emails sent to ${emailIds.length} followers`,
    });
  } catch (error) {
    console.error("Error updating delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}