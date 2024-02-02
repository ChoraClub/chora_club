import SpecificDelegate from "@/components/IndividualDelegate/SpecificDelegate";
import { Metadata } from "next";
import React from "react";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

export async function generateMetadata({
  params,
}: {
  params: Type;
}): Promise<Metadata> {
  return {
    title: params.individualDelegate,
    description: `This is description for ${params.individualDelegate}`,
  };
}

function page({ params }: { params: Type }) {
  return (
    <div>
      <SpecificDelegate params={params} />
    </div>
  );
}

export default page;
