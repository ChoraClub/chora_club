import React, { useEffect, useState } from "react";
import Image from "next/image";
import user from "@/assets/images/user/user1.svg";
import { IoArrowDown } from "react-icons/io5";
import Arrow1 from "@/assets/images/daos/arrow1.png";
import Arrow2 from "@/assets/images/daos/arrow2.png";
import Link from "next/link";
import { BASE_URL } from "@/config/constants";
import { HiOutlineExternalLink } from "react-icons/hi";
import { ThreeDots } from "react-loader-spinner";
import Confetti from "react-confetti";

interface delegate {
  isOpen: boolean;
  closeModal: any;
  handleDelegateVotes: any;
  fromDelegate: any;
  delegateName: String;
  displayImage: any;
  daoName: String;
  addressCheck: boolean;
  delegatingToAddr: boolean;
  confettiVisible: boolean;
}

function DelegateTileModal({
  isOpen,
  closeModal,
  handleDelegateVotes,
  fromDelegate,
  delegateName,
  displayImage,
  daoName,
  addressCheck,
  delegatingToAddr,
  confettiVisible,
}: delegate) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Change the timeout duration as per your requirements
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden font-poppins">
        <div className="absolute inset-0 backdrop-blur-md"></div>
        <div className="bg-white px-6 py-8 rounded-2xl flex flex-col z-50 border-[2px] border-black-shade-900">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black-shade-900"></div>
          </div>
        </div>
      </div>
    );
  }
  // console.log("deleeeeee", addressCheck);
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50  overflow-hidden font-poppins">
        <div
          className="absolute inset-0 backdrop-blur-md"
          onClick={closeModal}
        ></div>
        <div className="bg-white p-9 rounded-[34px] flex flex-col  z-50 border-[2px] items-center justify-center ">
          {confettiVisible && <Confetti />}
          <h1 className="font-semibold text-[26px] mb-2 text-blue-shade-100 text-center">
            Set {delegateName} as your delegate
          </h1>
          <p className="font-normal text-[13px] text-center text-black-shade-1000 max-w-[400px]">
            {delegateName} will be able to vote with any token owned by your
            address
          </p>

          <div className="my-6 w-full">
            <div className="flex items-center rounded-3xl border-[2.5px] border-white bg-[#F4F4F4] pb-5 pt-4">
              <Image src={user} alt="" className="size-[46px] mx-5" />
              <div className="">
                <p className=" text-sm font-medium">Currently delegated to</p>
                {fromDelegate === "N/A" ? (
                  <p className="font-normal text-[12px]">{fromDelegate}</p>
                ) : (
                  <Link
                    href={`${BASE_URL}/${daoName}/${fromDelegate}?active=info`}
                    target="_blank"
                    className="font-normal text-[12px] flex gap-1 items-center"
                  >
                    {fromDelegate.slice(0, 6) + "..." + fromDelegate.slice(-4)}
                    <HiOutlineExternalLink size={14} />
                  </Link>
                )}
              </div>
            </div>
            <div className="w-full border-[0.5px] border-white flex items-center justify-center h-0">
              {/* <div className='rounded-full size-14 border-[5px] border-white flex items-center justify-center z-50 bg-[#F4F4F4]'><IoArrowDown className='text-black size-7 hover:text-blue-shade-100'/></div> */}
              <div className="border-[5px] border-white rounded-full size-14">
                <Image
                  src={isHovering ? Arrow2 : Arrow1}
                  alt=""
                  className="w-full h-full z-50" // Adjust the size as needed
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
            <div className="flex items-center rounded-3xl border-[2.5px] border-white bg-[#F4F4F4] pb-4 pt-5">
              <Image
                src={displayImage}
                alt=""
                width={46}
                height={46}
                className="size-10 mx-5 rounded-full"
              />
              <div className="">
                <p className=" text-sm font-medium"> Delegating to</p>
                <p className=" font-normal text-[12px]">{delegateName}</p>
              </div>
            </div>
          </div>
          <button
            className={`rounded-full py-5 font-semibold font-poppins w-full text-base ${
              addressCheck
                ? "bg-grey-shade-50 text-grey"
                : "bg-black text-white hover:bg-blue-shade-100"
            }`}
            onClick={handleDelegateVotes}
            disabled={addressCheck}
          >
            {addressCheck ? (
              "You cannot delegate to the same address again"
            ) : delegatingToAddr ? (
              <div className="flex items-center justify-center">
                Delegating your tokens...
              </div>
            ) : (
              "Delegate"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default DelegateTileModal;
