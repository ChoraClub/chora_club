import IndividualDAO from "@/components/IndividualDAO/SpecificDAO";
import React from "react";

function page({ params }: { params: { daoDelegates: string } }) {
  return (
    <div>
      <IndividualDAO props={params} />
    </div>
  );
}

export default page;
