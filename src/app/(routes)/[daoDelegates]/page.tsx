import IndividualDAO from "@/components/IndividualDAO/SpecificDAO";
import PageNotFound from "@/components/PageNotFound/PageNotFound";
import React from "react";

function page({ params }: { params: { daoDelegates: string } }) {
  return (
    <div>
      {params.daoDelegates === "optimism" ||
      params.daoDelegates === "arbitrum" ? (
        <IndividualDAO props={params} />
      ) : (
        <PageNotFound />
      )}
    </div>
  );
}

export default page;
