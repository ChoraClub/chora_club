"use client"
import react, { useEffect, useState } from "react";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import Image from "next/image";
import user1 from "@/assets/images/daos/user1.png"
import { IoArrowBack } from "react-icons/io5";
import { IoShareSocialSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import IndividualDaoHeader from "../utils/IndividualDaoHeader";

function ProposalMain({ props }: { props: string }) {
 
    const router = useRouter();
    const [link, setLink] = useState("");

  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    setLink(window.location.href);
  }, []);

  const shareOnTwitter = () => {
    const url = encodeURIComponent(link);
    const text = encodeURIComponent(
      ` ${decodeURIComponent(
        url
      )} via @ChoraClub\n\n#choraclub #session #growth`
    );

    // Twitter share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

    // Open Twitter share dialog
    window.open(twitterUrl, "_blank");
  };

  return (
    <>
      {/* <div className="mx-10 my-8 flex justify-between  ">
        <h1 className="capitalize text-4xl text-blue-shade-100 flex items-center justify-between">
          Optimism/ Arbritrum
        </h1>
        <ConnectWalletWithENS />
      </div> */}
       <div className="pr-8 pb-5 pl-16 pt-6">

      <IndividualDaoHeader/>
       </div>

      {/* buttons */}
      <div className="flex gap-4 mx-24 mb-8 mt-2 font-poppins">
        <div className="text-white bg-blue-shade-100 rounded-full py-1.5 px-4 flex justify-center items-center gap-1 cursor-pointer" onClick={handleBack}>
        <IoArrowBack />
          Back
        </div>
        <div className="text-white bg-blue-shade-100 rounded-full py-1.5 px-4 flex justify-center items-center gap-1 cursor-pointer" onClick={shareOnTwitter}>
          Share
          <IoShareSocialSharp/>
        </div>
      </div>

      {/* For description */}
      <div
        className="h-[50vh] rounded-[1rem] mx-24 px-12 py-6 transition-shadow duration-300 ease-in-out shadow-xl bg-gray-50 font-poppins"
        // style={{
        //   boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
        // }}
      >
        <p className="text-3xl font-semibold ">Title</p>
        Description
      </div>

      {/* For Voters  */}
      <h1 className="mt-6 mx-24 text-4xl font-semibold text-blue-shade-100 font-poppins">Votes</h1>
      <div
        className="h-[80vh] mx-24 p-12 mb-10 font-poppins"
      >
        <div className="flex py-3 mb-3 bg-gray-200 rounded-3xl transition-shadow duration-300 ease-in-out shadow-lg text-xl font-semibold">
          <h3 className="basis-2/5 flex pl-8 items-center">
            ENS Address
          </h3>
          <h3 className="basis-1/5 flex justify-center items-center">
            Votes
          </h3>
          <h3 className="basis-2/5 flex justify-center items-center">
            Reasons
          </h3>
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex p-4 text-base mb-2  bg-gray-100 hover:bg-gray-50 rounded-3xl transition-shadow duration-300 ease-in-out shadow-lg">
            <div className="basis-2/5 flex justify-start items-center ">
                <Image src={user1} alt="" className="size-8 mx-2"/>
              <p className="">0xBb4c2baB6B2de45F9CC7Ab41087b730Eaa4adE31</p>
            </div>
            <p className="basis-1/5 flex justify-center items-center">1000</p>
            <p className="basis-2/5 flex text-right items-center">
              Nothing Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Neque tenetur
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
export default ProposalMain;
