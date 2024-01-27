"use client";
import React from "react";
import { Bars } from "react-loader-spinner";

function loading() {
  return (
    <div className="flex h-screen justify-center items-center">
      <Bars
        height="150"
        width="150"
        color="#0500FF"
        ariaLabel="bars-loading"
        visible={true}
      />
    </div>
  );
}

export default loading;
