"use client";
import IndividualDAO from "@/components/IndividualDAO/SpecificDAO";
import PageNotFound from "@/components/PageNotFound/PageNotFound";
import React from "react";
import ButtonWithCircle from "@/components/Circle/ButtonWithCircle";

function page({ params }: { params: { daoDelegates: string } }) {
  return (
    <ButtonWithCircle>
    <div>
      {params.daoDelegates === "optimism" ||
      params.daoDelegates === "arbitrum" ? (
        <IndividualDAO props={params} />
      ) : (
        <PageNotFound />
      )}
    </div>
    </ButtonWithCircle>
  );
}

export default page;
