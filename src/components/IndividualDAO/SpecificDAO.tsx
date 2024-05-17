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
import ButtonWithCircle from "../Circle/ButtonWithCircle";

function SpecificDAO({ props }: { props: { daoDelegates: string } }) {
  const router = useRouter();
  const path = usePathname();
  const daoname = path.slice(1);
  const searchParams = useSearchParams();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [desc, setDesc] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: daoname,
    label: daoname,
  });

  const [options, setOptions] = useState<any>([]);

  useEffect(() => {
    // setIsPageLoading(false);
    const setDescFunction = async () => {
      setIsPageLoading(true);
      const data = await options?.find(
        (option: any) => option.value === props.daoDelegates
      )?.desc;
      setDesc(data);
      setIsPageLoading(false);
    };
    setDescFunction();
    setIsPageLoading(false);
  }, [isPageLoading, options, desc]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions: RequestInit = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch("/api/get-dao-details", requestOptions);
        const result = await response.json();

        const fetchedDaoInfo = await result.data.map((dao: any) => ({
          value: dao.dao_name,
          label: dao.dao_name,
          image: dao.logo,
          desc: dao.description,
        }));
        setOptions(fetchedDaoInfo);

        // console.log("dao-details", result.data);
        setIsPageLoading(false);
      } catch (error) {
        console.error(error);
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [isPageLoading]);

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

    router.push(`/${name}?active=delegatesList`);
  };

  return (
    <div className="font-poppins py-6" id="secondSection">
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
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
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
                  {options.map((option: any, index: number) => (
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
          {isPageLoading ? <>Loading...</> : desc || <>Loading...</>}
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
