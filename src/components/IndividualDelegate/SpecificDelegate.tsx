"use client";
import Image from "next/image";
import React, { useState } from "react";
import user from "@/assets/images/daos/user3.png";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import DelegateInfo from "./DelegateInfo";
import DelegateVotes from "./DelegateVotes";
import DelegateSessions from "./DelegateSessions";
import DelegateOfficeHrs from "./DelegateOfficeHrs";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function SpecificDelegate({ params }: { params: Array<Type>[] }) {
  const [activeSection, setActiveSection] = useState("info");

  return (
    <div className="font-poppins">
      <div className="flex ps-14 py-5">
        <Image src={user} alt="user" className="w-40" />

        <div className="px-4">
          <div className=" flex items-center py-1">
            <div className="font-bold text-lg pr-4">
              {params.individualDelegate}
            </div>
            <div className="flex gap-3">
              <span
                className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
              >
                <FaXTwitter color="#7C7C7C" size={12} />
              </span>
              <span
                className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
              >
                <BiLogoInstagramAlt color="#7C7C7C" size={12} />
              </span>
              <span
                className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
              >
                <FaDiscord color="#7C7C7C" size={12} />
              </span>
            </div>
          </div>

          <div className="flex items-center py-1">
            <div>
              {"0xB351a70dD6E5282A8c84edCbCd5A955469b9b032".substring(0, 6)} ...{" "}
              {"0xB351a70dD6E5282A8c84edCbCd5A955469b9b032".substring(
                "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032".length - 4
              )}
            </div>

            <Tooltip content="Copy" placement="right" closeDelay={1} showArrow>
              <span className="px-2 cursor-pointer" color="#3E3D3D">
                <IoCopy
                  onClick={() =>
                    copy("0xB351a70dD6E5282A8c84edCbCd5A955469b9b032")
                  }
                />
              </span>
            </Tooltip>
          </div>

          <div className="flex gap-4 py-1">
            <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
              <span className="text-blue-shade-200 font-semibold">5.02m </span>
              Tokens Delegated
            </div>
            <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
              Delegated from
              <span className="text-blue-shade-200 font-semibold"> 2.56k </span>
              Addresses
            </div>
          </div>

          <div className="pt-2">
            <button className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]">
              Delegate
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-12 bg-[#D9D9D945] pl-16">
        <button
          className={`border-b-2 py-4 px-2  ${
            activeSection === "info"
              ? " border-blue-shade-200 text-blue-shade-200 font-semibold"
              : "border-transparent"
          }`}
          onClick={() => setActiveSection("info")}
        >
          Info
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            activeSection === "pastVotes"
              ? "text-blue-shade-200 font-semibold border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => setActiveSection("pastVotes")}
        >
          Past Votes
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            activeSection === "sessions"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => setActiveSection("sessions")}
        >
          Sessions
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            activeSection === "officeHours"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => setActiveSection("officeHours")}
        >
          Office Hours
        </button>
      </div>

      <div className="py-6 ps-16">
        {activeSection === "info" && <DelegateInfo />}
        {activeSection === "pastVotes" && <DelegateVotes />}
        {activeSection === "sessions" && <DelegateSessions />}
        {activeSection === "officeHours" && <DelegateOfficeHrs />}
      </div>
    </div>
  );
}

export default SpecificDelegate;
