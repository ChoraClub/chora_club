import React from "react";
import PageBackgroundPattern from "@/components/ComponentUtils/PageBackgroundPattern"

function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBackgroundPattern />
      {children}
    </>
  );
}

export default InviteLayout;
