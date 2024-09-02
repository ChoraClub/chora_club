import React, { useEffect, useState } from "react";
import ShareMediaModal from "../WatchMeeting/ShareMediaModal";
import toast from "react-hot-toast";
import { FaTelegram } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";
import { TbMailFilled } from "react-icons/tb";
import { SiFarcaster } from "react-icons/si";
import { BASE_URL } from "@/config/constants";
import { headers } from "next/headers";
import { fetchEnsAvatar, getEnsName } from "@/utils/ENSUtils";
import { Oval } from "react-loader-spinner";
import { truncateAddress } from "@/utils/text";
import Image from "next/image";
import user from "@/assets/images/user/user1.svg";
import logo from "@/assets/images/daos/CCLogo2.png";

function InviteCreators({ userAddress }: { userAddress: any }) {
  const [copied, setCopied] = useState(false);
  const [displayName, setDisplayName] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [ensName, setEnsName] = useState<any>();
  const [ensAvatar, setEnsAvatar] = useState<any>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formattedAddr, setFormattedAddr] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(`${BASE_URL}invite/${userAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  const shareOnFarcaster = () => {
    toast("Coming soon🚀");
  };
  const shareOnTelegram = () => {
    toast("Coming soon🚀");
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent("");
    const text = encodeURIComponent(
      `Tile ${decodeURIComponent(
        url
      )} via @ChoraClub\n\n#choraclub #session #growth`
    );

    // Twitter share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

    // Open Twitter share dialog
    window.open(twitterUrl, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions: any = {
        method: "GET",
        headers: myHeaders,
      };

      const res = await fetch(`/api/profile/${userAddress}`, requestOptions);

      const response = await res.json();

      console.log("response: ", response);
      setDisplayImage(response.data[0].image);
      setDisplayName(response.data[0].displayName);
    };
    fetchData();

    const fetchEnsData = async () => {
      const getEnsData = await fetchEnsAvatar(userAddress);
      setEnsName(getEnsData?.ensName);
      setEnsAvatar(getEnsData?.avatar);
    };

    fetchEnsData();

    const trucateAddr = truncateAddress(userAddress);
    setFormattedAddr(trucateAddr);

    setIsPageLoading(false);
  }, []);

  return (
    <>
      {isPageLoading ? (
        <div className="flex items-center justify-center top-10">
          <Oval
            visible={true}
            height="20"
            width="20"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        </div>
      ) : (
        <div className="p-8 bg-white">
          <div className="text-3xl font-semibold text-gray-900 mb-4">
            Hi {ensName || displayName || formattedAddr}, ready to earn ETH by
            inviting creators?
          </div>
          <div className="text-lg text-gray-700 mb-6">
            Invite creators to Chora Club and earn ETH every time they mint! The
            more you bring, the more you earn!
          </div>
          <div className="text-blue-600 underline mb-8 cursor-pointer hover:text-blue-800 transition-colors">
            Learn more about referrals
          </div>

          <div className="w-[70%] mx-auto">
            <div className="p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-blue-900 rounded-md flex flex-col items-center mb-8">
              <div className="flex rounded-full bg-white mt-3 mb-6">
                <Image
                  src={
                    ensAvatar ||
                    (displayImage &&
                      `https://gateway.lighthouse.storage/ipfs/${displayImage}`) ||
                    user
                  }
                  width={100}
                  height={100}
                  alt="image"
                  className="h-28 w-28 object-cover rounded-full"
                />
              </div>
              <div className="font-semibold mb-1">
                You&apos;ve been invited to create on Chora Club by
              </div>
              <div className="font-bold text-lg mb-2">
                {ensName || displayName || formattedAddr}
              </div>

              <div>
                <Image src={logo} alt="image" width={50} />
              </div>
            </div>

            <div className="flex items-center mb-10 gap-3">
              <div className="flex-grow p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                {BASE_URL}invite/{userAddress}
              </div>
              <button
                className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-colors"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="flex gap-4 justify-center items-center my-5 mb-14">
              <div
                className="bg-black rounded-full size-[72px]  flex justify-center items-center cursor-pointer"
                onClick={shareOnTwitter}
              >
                <RiTwitterXLine className="text-white bg-black size-10 " />
              </div>
              <div
                // className="bg-[#8a63d2] rounded-full size-[72px]  flex justify-center items-center cursor-pointer"
                onClick={shareOnFarcaster}
              >
                <SiFarcaster className="bg-white text-[#8a63d2] rounded-full size-[72px] cursor-pointer" />
              </div>
              <div onClick={shareOnTelegram}>
                <FaTelegram className="text-[#1d98dc] bg-white size-[72px] cursor-pointer" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="text-gray-800">
                  Total earnings from referrals
                </div>
                <button className="bg-black text-white text-sm font-semibold px-4 py-1 rounded-full hover:bg-gray-800 transition-colors">
                  Claim
                </button>
              </div>
              <div className="text-blue-600 font-bold">0 ETH</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InviteCreators;
