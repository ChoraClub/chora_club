import SpecificDelegate from "@/components/IndividualDelegate/SpecificDelegate";
import React from "react";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function page({ params }: { params: Type }) {
  return (
    <div>
      <SpecificDelegate params={params} />
    </div>
  );
}

export default page;
