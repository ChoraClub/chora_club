import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { compileDelegateFollowersTemplate, sendMail } from "@/lib/mail";

export async function PUT(req: NextRequest) {
  try {
    const { address, daoName, ensName } = await req.json();

    let delegate_address = address;

    const capitalizedDAO = daoName.charAt(0).toUpperCase() + daoName.slice(1);

    const delegateInfo = ensName
      ? `${ensName}`
      : `${delegate_address.slice(0, 6)}...${delegate_address.slice(-4)}`;

    console.log("Delegate address:", address);
    console.log("DAO name:", daoName);

    console.log("Connecting to MongoDB...");
    const client = await connectDB();
    console.log("Connected to MongoDB");

    const db = client.db();
    const delegate_follow_collection = db.collection("delegate_follow");
    const delegates_collection = db.collection("delegates");

    // Find the document by address in delegate_follow collection
    const document = await delegate_follow_collection.findOne({ address });

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
    const daoFollowers = document.followers.find(
      (dao: any) => dao.dao_name === daoName
    );

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
      .filter((follower: any) => follower.isNotification === true)
      .map((follower: any) => follower.address);

    // Find emails associated with follower addresses from delegates collection
    const followerEmails = await delegates_collection
      .find(
        { address: { $in: followerAddresses } },
        { projection: { emailId: 1, address: 1 } }
      )
      .toArray();

    console.log("Follower emails:", followerEmails);

    const emailsWithAddresses = followerEmails
      .filter((follower) => follower.emailId && follower.emailId.trim() !== "")
      .map((follower) => ({
        emailId: follower.emailId,
        address: follower.address,
      }));

    for (const { emailId, address } of emailsWithAddresses) {
      try {
        await sendMail({
          to: emailId,
          name: "Chora Club",
          subject: "Your Delegate Has Scheduled a New Session",
          body: compileDelegateFollowersTemplate(
            `Hi ${address}`,
            `\nWe're thrilled to let you know that ${delegateInfo} a delegate from a ${capitalizedDAO} DAO you're following has just made new time slots available for you to book!🎉️`,
            `Don’t miss this chance to dive deeper into the Web3 Ecosystem.`,
            `🌐️ Click the link below to book your spot and explore the latest insights:Book Your Spot Now!👇️ `,
            `\n https://app.chora.club/${daoName}/${delegate_address}?active=delegatesSession&session=book`
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
      message: `Emails sent to ${emailsWithAddresses.length} followers`,
    });
  } catch (error) {
    console.error("Error updating delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
