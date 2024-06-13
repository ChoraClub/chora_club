import SpecificDelegate from "@/components/IndividualDelegate/SpecificDelegate";
import { BASE_URL, IMAGE_URL } from "@/config/constants";
import {
  processAddressOrEnsName,
  resolveENSProfileImage,
  getMetaAddressOrEnsName,
  fetchEnsAvatar,
} from "@/utils/ENSUtils";
import { Metadata } from "next";
import React, { useEffect } from "react";
import { getFrameMetadata } from "@coinbase/onchainkit/core";

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

  const avatar = (await fetchEnsAvatar(params.individualDelegate)) || IMAGE_URL;
  const dao_name = params.daoDelegates;
  const tokenName = "Optimism";

  const imgParams = [
    avatar && `avatar=${encodeURIComponent(avatar)}`,
    dao_name && `dao_name=${encodeURIComponent(dao_name)}`,
  ];
  // .filter(Boolean);

  const preview = `${BASE_URL}/api/images/og/ccTest?${imgParams.join(
    "&"
  )}&address=${ensOrTruncatedAddress}`;
  // const title = `${ensOrTruncatedAddress} on Agora`;
  // const description = `See what ${ensOrTruncatedAddress} believes and how they vote on ${tokenName} governance.`;
  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: "Delegate",
        action: "tx",
        target: `${BASE_URL}/api/transaction`,
      },
    ],
    image: preview,
    post_url: preview,
  });

  return {
    title: name,
    description: "Check if you're eligible for a free mint",
    openGraph: {
      title: name,
      description: "Check if you're eligible for a free mint",
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
