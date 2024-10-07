import SpecificDelegate from "@/components/IndividualDelegate/SpecificDelegate";
import { BASE_URL } from "@/config/constants";
import {
  processAddressOrEnsName,
  resolveENSProfileImage,
  getMetaAddressOrEnsName,
  fetchEnsNameAndAvatar,
} from "@/utils/ENSUtils";
import { Metadata } from "next";
import React, { useEffect } from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/core";
import { IMAGE_URL } from "@/config/staticDataUtils";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

export async function generateMetadata({
  params,
}: {
  params: Type;
}): Promise<Metadata> {
  const name = "Chora Club";

  const address = await getMetaAddressOrEnsName(
    params.daoDelegates,
    params.individualDelegate
  );

  // const ensOrTruncatedAddress = await processAddressOrEnsName(
  //   params.individualDelegate
  // );

  const ensOrTruncatedAddress = await getMetaAddressOrEnsName(
    params.daoDelegates,
    params.individualDelegate
  );

  // const avatar = (await fetchEnsNameAndAvatar(params.individualDelegate)) || IMAGE_URL;
  // const [avatar] = await Promise.all([
  //   fetchEnsNameAndAvatar(params.individualDelegate),
  // ]);
  // console.log("avatar...", avatar);
  // const dao_name = params.daoDelegates;
  // const tokenName = "Optimism";

  // const imgParams = [
  //   avatar ? `avatar=${encodeURIComponent(avatar.avatar)}` : null,
  //   dao_name ? `dao_name=${encodeURIComponent(dao_name)}` : null,
  // ].filter((param): param is string => param !== null);

  const defaultAvatar = IMAGE_URL; // Provide a default value for avatar
  const [avatar] = await Promise.all([
    fetchEnsNameAndAvatar(params.individualDelegate),
  ]);
  console.log("avatar...", avatar);
  const dao_name = params.daoDelegates;
  const tokenName = "Optimism";

  const imgParams = [
    avatar
      ? `avatar=${encodeURIComponent(avatar?.avatar ?? defaultAvatar)}`
      : null, // Use nullish coalescing operator to provide a default value for avatar
    dao_name ? `dao_name=${encodeURIComponent(dao_name)}` : null,
  ].filter((param): param is string => param !== null);

  console.log("imgParams...", imgParams);
  // .filter(Boolean);

  const preview = `${BASE_URL}/api/images/og/ccTest?${imgParams.join(
    "&"
  )}&address=${ensOrTruncatedAddress}`;

  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: "Delegate",
        action: "tx",
        target: `https://farcaster-frames-ivory.vercel.app/api/transaction`,
      },
    ],
    image: preview,
    post_url: preview,
  });

  return {
    title: name,
    description: "Chora Club",
    openGraph: {
      title: name,
      description: "Delegate",
      images: [preview],
    },
    other: {
      ...frameMetadata,
      "fc:frame:image:aspect_ratio": "1.91:1",
    },
  };
}

function page({ params }: { params: Type }) {
  return (
    <div>
      <SpecificDelegate props={params} />
    </div>
  );
}

export default page;
