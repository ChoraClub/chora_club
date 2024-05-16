import ButtonWithCircle from "@/components/Circle/ButtonWithCircle";
import MainProfile from "@/components/UserProfile/MainProfile";
import React from "react";

function page() {
  return (
    <ButtonWithCircle>
      <div>
        <MainProfile />
      </div>
    </ButtonWithCircle>
  );
}

export default page;
