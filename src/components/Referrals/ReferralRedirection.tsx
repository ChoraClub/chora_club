"use client";

import { useRouter } from "next-nprogress-bar";
import React, { useEffect } from "react";

function ReferralRedirection({ params }: { params: { address: string } }) {
  console.log(params.address);
  const router = useRouter();

  useEffect(() => {
    if (params.address) {
      router.push(`/?referrer=${params.address}`);
    }
  }, [params.address]);

  return null;
}

export default ReferralRedirection;
