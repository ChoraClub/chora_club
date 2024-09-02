import React, { useState } from "react";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { usePathname, useRouter } from "next/navigation";
import { dao_details } from "@/config/daoDetails";

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
    <div className="flex items-center justify-between pe-10">
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          <div className="capitalize text-4xl text-blue-shade-100 bg-white-200 outline-none cursor-pointer flex items-center justify-between transition duration-500">
            <div className="mr-5 flex items-center">{selectedOption.label}</div>
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
              {options.map((option: any, index: number) => (
                <div key={index}>
                  <div
                    className={`option flex items-center cursor-pointer px-3 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 capitalize ${
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

      <div>
        <ConnectWalletWithENS />
      </div>
    </div>
  );
}

export default IndividualDaoHeader;
