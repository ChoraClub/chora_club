"use client";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import DelegatesList from "./DelegatesList";
import DelegatesSession from "./DelegatesSession";
import OfficeHours from "./OfficeHours";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import OPLogo from "@/assets/images/daos/op.png";
// import ARBLogo from "@/assets/images/daos/arbitrum.jpg";
// import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { dao_details } from "@/config/daoDetails";
import Proposals from "./Proposals";
import IndividualDaoHeader from "../ComponentUtils/IndividualDaoHeader";
import AboutDao from "./AboutDao";
import Leaderboard from "./Leaderboard";
import { ChevronDownIcon } from "lucide-react";

const desc = dao_details;

function SpecificDAO({ props }: { props: { daoDelegates: string } }) {
  const router = useRouter();
  const path = usePathname();
  // const dao_name = path.slice(1);
  const searchParams = useSearchParams(); 
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("About");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.matches(":hover")) {
        setIsDropdownOpen(false);
      }
    }, 100);
  };

  const tabs = [
    { name: "About", value: "about" },
    { name: "Proposals", value: "proposals" },
    { name: "Delegates List", value: "delegatesList" },
    { name: "Delegates Sessions", value: "delegatesSession" },
    { name: "Office Hours", value: "officeHours" },
    { name: "Leaderboard", value: "leaderboard" },
  ];

  const handleTabChange = (tabValue: string) => {
    console.log(tabValue);
    const selected = tabs.find((tab) => tab.value === tabValue);
    console.log(selected);
    if (selected) {
      setSelectedTab(selected.name);
      setIsDropdownOpen(false);
      // if (tabValue === "about") {
      //   router.push(path + "?active=about");
      // } else 
      if (tabValue === "proposals") {
        router.push(path + "?active=proposals");
      } else if (tabValue === "delegatesList") {
        router.push(path + "?active=delegatesList");
      } else if (tabValue === "delegatesSession") {
        router.push(path + "?active=delegatesSession&session=recorded");
      } else if (tabValue === "officeHours") {
        router.push(path + "?active=officeHours&hours=ongoing");
      } else if (tabValue === "leaderboard") {
        router.push(path + "?active=leaderboard");
      } 
      else {
        router.push(path + `?active=${tabValue}`);
      }
    }
  };

  // const logoMapping: any = {
  //   optimism: OPLogo,
  //   arbitrum: ARBLogo,
  //   // Add more mappings as needed
  // };

  // const selectedLogo = logoMapping[dao_name] || OPLogo;

  // const [isOpen, setIsOpen] = useState(false);
  // const [selectedOption, setSelectedOption] = useState({
  //   value: dao_name,
  //   label: dao_name,
  //   image: selectedLogo,
  // });

  // const options = [
  //   { value: "optimism", label: "optimism", image: OPLogo },
  //   { value: "arbitrum", label: "arbitrum", image: ARBLogo },
  // ];

  // const handleMouseEnter = () => {
  //   setIsOpen(true);
  // };

  // const handleMouseLeave = () => {
  //   setIsOpen(false);
  // };

  // const selectOption = (option: any) => {
  //   setSelectedOption(option);
  //   setIsOpen(false);

  //   let name: string;
  //   name = option.value;
  //   const formatted = name.toLowerCase();
  //   const localData = JSON.parse(localStorage.getItem("visitedDao") || "{}");
  //   localStorage.setItem(
  //     "visitedDao",
  //     JSON.stringify({ ...localData, [formatted]: [formatted, option.image] })
  //   );

  //   router.push(`/${name}?active=delegatesList`);
  // };

  return (
    <>
    <div className="font-poppins py-6" id="secondSection">
      <div className="px-4 md:px-6 lg:px-14 pb-5 ">

        <IndividualDaoHeader />
        <div className="py-5">
          {props.daoDelegates === "optimism"
            ? desc.optimism.description
            : props.daoDelegates === "arbitrum"
            ? desc.arbitrum.description
            : null}
        </div>
      </div>

      <div
              className="lg:hidden mt-4 px-8 xs:px-4 sm:px-8 py-2 sm:py-[10px] bg-[#D9D9D945]"
              ref={dropdownRef}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="w-full flex justify-between items-center text-left font-normal rounded-full capitalize text-lg text-blue-shade-100 bg-white px-4 py-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={handleMouseEnter}
              >
                <span>{selectedTab}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-700 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`w-[calc(100vw - 3rem)] mt-1 overflow-hidden transition-all duration-700 ease-in-out ${
                  isDropdownOpen
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-2 border border-white-shade-100 rounded-xl bg-white shadow-md">
                  {tabs.map((tab, index) => (
                    <React.Fragment key={tab.value}>
                      <div
                        onClick={() => handleTabChange(tab.value)}
                        className="px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-gray-100 capitalize text-base cursor-pointer"
                      >
                        {tab.name}
                      </div>
                      {index !== tabs.length - 1 && <hr className="my-1" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

      <div className="hidden lg:flex gap-12 bg-[#D9D9D945] pl-16">
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "about"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=about")}
        >
          About
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "proposals"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=proposals")}
        >
          Proposals
        </button>
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
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "leaderboard"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() =>
            router.push(path + "?active=leaderboard")
          }
        >
          Leaderboard
        </button>
      </div>

      <div className="py-6 px-4 md:px-6 lg:px-16">
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
        {searchParams.get("active") === "proposals" ? (
          <Proposals props={props.daoDelegates} />
        ) : (
          ""
        )}
        {searchParams.get("active") === "about" ? (
          <AboutDao props={props.daoDelegates} />
        ) : (
          ""
        )}
        {searchParams.get("active") === "leaderboard" ? (
          <Leaderboard props={props.daoDelegates} />
        ) : (
          ""
        )}
      </div>
    </div>
    </>
  );
}

export default SpecificDAO;
