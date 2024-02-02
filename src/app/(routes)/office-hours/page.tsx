import DaoOfficeHours from "@/components/OfficeHours/DaoOfficeHours";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Office Hours",
  description: "Office hours of delegates",
};

function page() {
  return (
    <div>
      <DaoOfficeHours />
    </div>
  );
}

export default page;
