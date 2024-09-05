import { fetchInviteeDetails } from "@/components/Referrals/InviteUtils";
import ReferralRedirection from "@/components/Referrals/ReferralRedirection";
import { BASE_URL } from "@/config/constants";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

export async function generateMetadata(
  { params }: { params: { address: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const inviteeDetails = await fetchInviteeDetails(params.address);

  const title = `You have been invited on ChoraClub by ${
    inviteeDetails?.ensName ||
    inviteeDetails?.displayName ||
    inviteeDetails?.formattedAddr
  }`;
  const description = "Ours truly,";

  const user =
    "https://gateway.lighthouse.storage/ipfs/bafkreidirbp5rpggihsab76teieq66wnj6lj75pjn2guhkvabfa3z53dzm";

  return {
    metadataBase: new URL("https://app.chora.club/"),
    title: "Chora Club",
    description: "Discover. Learn. Engage.",
    openGraph: {
      title: title,
      description: description,
      url: `https://app.chora.club/invite/${params.address}`,
      siteName: "Chora Club",
      images: [
        `${BASE_URL}/api/images/og/referral?inviteeName=${encodeURIComponent(
          inviteeDetails?.ensName ||
            inviteeDetails?.displayName ||
            inviteeDetails?.formattedAddr
        )}&inviteeAvatar=${encodeURIComponent(
          inviteeDetails?.ensAvatar ||
            (inviteeDetails?.displayImage &&
              `https://gateway.lighthouse.storage/ipfs/${inviteeDetails.displayImage}`) ||
            user
        )}`,
      ].filter((param): param is string => param !== null),
      locale: "en_US",
      type: "website",
    },
  };
}

function page({ params }: { params: { address: string } }) {
  return <ReferralRedirection params={params} />;
}

export default page;
