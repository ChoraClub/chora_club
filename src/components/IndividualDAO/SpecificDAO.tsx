"use client";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import DelegatesList from "./DelegatesList";
import DelegatesSession from "./DelegatesSession";
import OfficeHours from "./OfficeHours";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import OPLogo from "@/assets/images/daos/op.png";
import ARBLogo from "@/assets/images/daos/arbitrum.jpg";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";

const desc = {
  optimism:
    "Optimism DAO is the heart of the Optimism network, an innovative layer 2 solution for faster, cheaper transactions on Ethereum. Think of it as a community-driven engine, where token holders govern upgrades, fees, and the overall direction of the Optimism ecosystem. With a focus on scaling Ethereum effectively and sustainably, Optimism DAO is building a brighter future for blockchain technology.",

  arbitrum:
    "The Arbitrum DAO is a decentralized autonomous organization (DAO) built on the Ethereum blockchain. At its core, the Arbitrum DAO is a community-driven governance mechanism that allows $ARB token holders to propose and vote on changes to the organization and the technologies it governs.",
};

function SpecificDAO({ props }: { props: { daoDelegates: string } }) {
  const router = useRouter();
  const path = usePathname();
  const daoname = path.slice(1);
  const searchParams = useSearchParams();

  const logoMapping: any = {
    optimism: OPLogo,
    arbitrum: ARBLogo,
    // Add more mappings as needed
  };

  const selectedLogo = logoMapping[daoname] || OPLogo;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: daoname,
    label: daoname,
    image: selectedLogo,
  });

  const options = [
    { value: "optimism", label: "optimism", image: OPLogo },
    { value: "arbitrum", label: "arbitrum", image: ARBLogo },
  ];

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const selectOption = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);

    let name: string;
    name = option.value;
    const formatted = name.toLowerCase();
    const localData = JSON.parse(localStorage.getItem("visitedDao") || "{}");
    localStorage.setItem(
      "visitedDao",
      JSON.stringify({ ...localData, [formatted]: [formatted, option.image] })
    );

    // Redirect or perform other actions based on the selected DAO
    switch (option.value) {
      case "optimism":
        router.push("/optimism?active=delegatesList");
        break;
      case "arbitrum":
        router.push("/arbitrum?active=delegatesList");
        break;
      default:
        break;
    }
  };

  return (
    <div className="font-poppins py-6" id="secondSection">
      {/* <div className="px-8 pb-5">
        <div className="flex justify-between pe-10">
          <div className="capitalize text-4xl text-blue-shade-100">
            {props.daoDelegates}
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>

        <div className="py-5 pr-8">
          {props.daoDelegates === "optimism"
            ? desc.optimism
            : props.daoDelegates === "arbitrum"
            ? desc.arbitrum
            : null}
        </div>
      </div> */}

      <div className="pr-8 pb-5 pl-16">
        <div className="flex items-center justify-between pe-10">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <div
                className="capitalize text-4xl text-blue-shade-100 bg-white-200 outline-none cursor-pointer flex items-center justify-between transition duration-500"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="mr-5 flex items-center">
                  {selectedOption.label}
                </div>
                <svg
                  className={`w-4 h-4 mr-2 ${
                    isOpen
                      ? "transform rotate-180 transition-transform duration-300"
                      : "transition-transform duration-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              {isOpen && (
                <div
                  className={`absolute mt-1 p-2 w-72 border border-white-shade-100 rounded-xl bg-white shadow-md ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  style={{ transition: "opacity 0.3s" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {options.map((option, index) => (
                    <div key={index}>
                      <div
                        className={`option flex items-center cursor-pointer px-3 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 capitalize ${
                          option.label === daoname ? "text-blue-shade-100" : ""
                        }`}
                        onClick={() => selectOption(option)}
                      >
                        {option.value}
                      </div>
                      {index !== options.length - 1 && <hr />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <ConnectWalletWithENS />
          </div>
        </div>
        <div className="py-5 pr-8">
          {props.daoDelegates === "optimism"
            ? desc.optimism
            : props.daoDelegates === "arbitrum"
            ? desc.arbitrum
            : null}
        </div>
      </div>

      <div className="flex gap-12 bg-[#D9D9D945] pl-16">
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "delegatesList"
              ? " border-blue-shade-200 text-blue-shade-200 font-semibold"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=delegatesList")}
        >
          Delegates List
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "delegatesSession"
              ? "text-blue-shade-200 font-semibold border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() =>
            router.push(path + "?active=delegatesSession&session=recorded")
          }
        >
          Delegates Sessions
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "officeHours"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() =>
            router.push(path + "?active=officeHours&hours=ongoing")
          }
        >
          Office hours
        </button>
      </div>

      <div className="py-6 ps-16">
        {searchParams.get("active") === "delegatesList" ? (
          <DelegatesList props={props.daoDelegates} />
        ) : (
          ""
        )}
        {searchParams.get("active") === "delegatesSession" ? (
          <DelegatesSession props={props.daoDelegates} />
        ) : (
          ""
        )}
        {searchParams.get("active") === "officeHours" ? (
          <OfficeHours props={props.daoDelegates} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default SpecificDAO;
