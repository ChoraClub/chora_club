import React, { useState } from "react";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { usePathname, useRouter } from "next/navigation";
import { dao_details } from "@/config/daoDetails";
import RewardButton from "../ClaimReward/RewardButton";

function IndividualDaoHeader() {
  const path = usePathname();
  const router = useRouter();
  const dao_name = path.split("/").filter(Boolean)[0] || "";

  const logoMapping: any = {};
  const options: any[] = [];

  // Populate logoMapping and options from dao_details
  Object.keys(dao_details).forEach((key) => {
    const dao = dao_details[key];
    logoMapping[key] = dao.logo;
    options.push({ value: key, label: dao.dao_name, image: dao.logo });
  });

  const selectedLogo = logoMapping[dao_name] || logoMapping.optimism;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: dao_name,
    label: dao_name,
    image: selectedLogo,
  });

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const selectOption = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);

    const formatted = option.value.toLowerCase();
    const localData = JSON.parse(localStorage.getItem("visitedDao") || "{}");
    localStorage.setItem(
      "visitedDao",
      JSON.stringify({ ...localData, [formatted]: [formatted, option.image] })
    );

    router.push(`/${formatted}?active=about`);
  };

  return (
    <div className="flex items-center justify-between">
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          <div className="capitalize text-xl sm:text-2xl md:text-3xl lg:text-4xl text-blue-shade-100 bg-white-200 outline-none cursor-pointer flex items-center justify-between transition duration-500">
            <div className="mr-2 sm:mr-3 md:mr-4 lg:mr-5 flex items-center truncate">{selectedOption.label}</div>
            <svg
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2 flex-shrink-0 ${
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
              className={`absolute mt-1 p-1.5 w-full min-w-[200px] sm:w-56 md:w-64 lg:w-72 border border-white-shade-100 rounded-xl bg-white shadow-md z-50 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ transition: "opacity 0.3s" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {options.map((option: any, index: number) => (
                <div key={index}>
                  <div
                    className={`option flex items-center cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 capitalize ${
                      option.label === dao_name ? "text-blue-shade-100" : ""
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

      <div className="flex gap-1 xs:gap-2 items-center">
              <RewardButton />
              <ConnectWalletWithENS />
            </div>
    </div>
  );
}

export default IndividualDaoHeader;
