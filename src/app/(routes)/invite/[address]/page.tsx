"use client";

import ReferralRedirection from "@/components/Referrals/ReferralRedirection";
import { useRouter } from "next-nprogress-bar";
import React, { useEffect } from "react";

function page({ params }: { params: { address: string } }) {
  // console.log(params.address);
  // const router = useRouter();
  // // const { address } = router.query;

  // useEffect(() => {
  //   if (params.address) {
  //     router.push(`/?referrer=${params.address}`);
  //   }
  // }, [params.address]);

  return <ReferralRedirection params={params} />;
}

export default page;
