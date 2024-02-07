import SpecificDelegate from "@/components/IndividualDelegate/SpecificDelegate";
import { Metadata } from "next";
import React from "react";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function page({ params }: { params: Type }) {
  return (
    <div>
      <SpecificDelegate props={params} />
    </div>
  );
}

export default page;
