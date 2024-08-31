"use client";

import { useRouter } from "next-nprogress-bar";
import React, { useEffect } from "react";

function Page({ params }: { params: { address: string } }) {
  console.log(params.address);
  const router = useRouter();
  // const { address } = router.query;

  useEffect(() => {
    if (params.address) {
      router.push(`/?referrer=${params.address}`);
    }
  }, [params.address]);

  return null;
}

export default Page;
