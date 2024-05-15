"use client";
import SpecificDelegate from "@/components/IndividualDelegate/SpecificDelegate";
import { Metadata } from "next";
import React from "react";
import ButtonWithCircle from "@/components/Circle/ButtonWithCircle";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function page({ params }: { params: Type }) {
  return (
    <ButtonWithCircle>
    <div>
      <SpecificDelegate props={params} />
    </div>
    </ButtonWithCircle>
  );
}

export default page;
