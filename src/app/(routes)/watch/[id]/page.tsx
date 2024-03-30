import WatchComponentMain from "@/components/WatchMeeting/WatchComponentMain";
import React from "react";

function page({ params }: { params: { id: string } }) {
  return (
    <>
      <div>
        <WatchComponentMain props={params} />
      </div>
    </>
  );
}

export default page;
