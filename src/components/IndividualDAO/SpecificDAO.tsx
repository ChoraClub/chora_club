"use client";

import React, { useState } from "react";
import DelegatesList from "./DelegatesList";
import DelegatesSession from "./DelegatesSession";
import OfficeHours from "./OfficeHours";

function SpecificDAO({ params }: { params: { daoDelegates: string } }) {
  const [activeSection, setActiveSection] = useState("delegatesList");

  return (
    <div className="font-poppins py-6">
      <div className="px-8 pb-5">
        <div className="capitalize text-4xl text-blue-shade-100">
          {params.daoDelegates}
        </div>
        <div className="py-5 pr-8">
          Optimism DAO is the heart of the Optimism network, an innovative layer
          2 solution for faster, cheaper transactions on Ethereum. Think of it
          as a community-driven engine, where token holders govern upgrades,
          fees, and the overall direction of the Optimism ecosystem. With a
          focus on scaling Ethereum effectively and sustainably, Optimism DAO is
          building a brighter future for blockchain technology.
        </div>
      </div>

      <div className="flex gap-16 bg-[#D9D9D945] pl-16">
        <button
          className={`border-b-2 py-4  ${
            activeSection === "delegatesList"
              ? " border-blue-shade-200 text-blue-shade-200 font-semibold"
              : "border-transparent"
          }`}
          onClick={() => setActiveSection("delegatesList")}
        >
          Delegates List
        </button>
        <button
          className={`border-b-2 py-4 ${
            activeSection === "delegatesSession"
              ? "text-blue-shade-200 font-semibold border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => setActiveSection("delegatesSession")}
        >
          Delegates Session
        </button>
        <button
          className={`border-b-2 py-4 ${
            activeSection === "officeHours"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => setActiveSection("officeHours")}
        >
          Office hours
        </button>
      </div>

      <div className="py-6 ps-16">
        {activeSection === "delegatesList" && <DelegatesList />}
        {activeSection === "delegatesSession" && <DelegatesSession />}
        {activeSection === "officeHours" && <OfficeHours />}
      </div>
    </div>
  );
}

export default SpecificDAO;
