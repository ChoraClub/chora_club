import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTelegram } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";
import { SiFarcaster } from "react-icons/si";
import { BASE_URL } from "@/config/constants";
import { Oval } from "react-loader-spinner";
import Image from "next/image";
import user from "@/assets/images/user/user8.svg";
import logo from "@/assets/images/daos/CCLogo2.png";
import { fetchInviteeDetails } from "./InviteUtils";
import RewardButton from "../ClaimReward/RewardButton";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import Link from "next/link";

function InviteCreators({ userAddress }: { userAddress: any }) {
  const [copied, setCopied] = useState(false);
  const [inviteeDetails, setInviteeDetails] = useState<any>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  // const [formattedAddr, setFormattedAddr] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(`${BASE_URL}invite/${userAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  const url = encodeURIComponent(`${BASE_URL}invite/${userAddress}`);
  const text = encodeURIComponent(`Join me on Chora Club`);

  const shareOnFarcaster = () => {
    const farcasterUrl = `https://warpcast.com/~/compose?text=${text}&embeds%5B%5D=${url}`;

    window.open(farcasterUrl, "_blank");
  };

  const shareOnTelegram = () => {
    const telegramUrl = `https://t.me/share/url?text=${text}&url=${url}`;

    window.open(telegramUrl, "_blank");
  };

  const shareOnTwitter = () => {
    const urlEncoded = encodeURIComponent(`${BASE_URL}invite/${userAddress}`);
    const textTwitter = encodeURIComponent(
      `Join Chora Club 🚀, where DAO delegates share knowledge and insights in Web3!

If you're a delegate eager to share your knowledge and earn rewards, then join & create impactful sessions. Let's make Web3 accessible to everyone!🌐 

Join Now 👇
${decodeURIComponent(urlEncoded)} 

#ChoraClub #Web3`
    );

    // Twitter share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${textTwitter}`;

    // Open Twitter share dialog
    window.open(twitterUrl, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      const details = await fetchInviteeDetails(userAddress);
      setInviteeDetails(details);
      setIsPageLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {isPageLoading ? (
        <div className="flex items-center justify-center top-10 h-screen">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        </div>
      ) : (
        <>
          <div className="w-full flex justify-end pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
            <div className="flex gap-1 xs:gap-2 items-center">
              <RewardButton />
              <ConnectWalletWithENS />
            </div>
          </div>
          <div className="p-8 bg-white">
            <div className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Hi{" "}
              {inviteeDetails?.ensName ||
                inviteeDetails?.displayName ||
                inviteeDetails?.formattedAddr}
              , ready to earn ETH by inviting creators?
            </div>
            <div className="md:text-lg text-gray-700 mb-6">
              Invite creators to Chora Club and earn ETH every time they mint!
              The more you bring, the more you earn!
            </div>
            <div className="mb-8">
              <Link
                href={
                  "https://docs.chora.club/earn-rewards/create-referral-reward"
                }
                target="_blank"
                className="transition-colors"
              >
                Learn more about referrals
              </Link>
            </div>

            <div className="md:w-[70%] mx-auto">
              <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-blue-900 rounded-md flex flex-col items-center mb-8 w-full mx-auto">
                <div className="flex rounded-full bg-white mt-2 sm:mt-3 mb-4 sm:mb-6">
                  <Image
                    src={
                      inviteeDetails?.ensAvatar ||
                      (inviteeDetails?.displayImage &&
                        `https://gateway.lighthouse.storage/ipfs/${inviteeDetails.displayImage}`) ||
                      user
                    }
                    width={100}
                    height={100}
                    alt="Invitee avatar"
                    className="h-20 w-20 sm:h-28 sm:w-28 object-cover rounded-full"
                  />
                </div>
                <div className="font-semibold text-center mb-1 text-sm sm:text-base">
                  You&apos;ve been invited to create on Chora Club by
                </div>
                <div className="font-bold text-base sm:text-lg mb-2 text-center break-words max-w-full px-2">
                  {inviteeDetails?.ensName ||
                    inviteeDetails?.displayName ||
                    inviteeDetails?.formattedAddr}
                </div>
                <div className="mt-2 sm:mt-4">
                  <Image
                    src={logo}
                    alt="Chora Club logo"
                    width={40}
                    height={40}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full sm:flex-row items-center mb-8 gap-3">
                <div className="w-full sm:flex-grow p-2 border border-gray-300 rounded-md overflow-hidden bg-gray-50 text-gray-700 cursor-pointer focus:outline-none truncate">
                  {BASE_URL}invite/{userAddress}
                </div>
                <button
                  className="w-full sm:w-auto bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="flex gap-4 justify-center items-center mb-20">
                <div
                  className="bg-black rounded-full size-[40px] flex justify-center items-center cursor-pointer"
                  onClick={shareOnTwitter}
                >
                  <RiTwitterXLine className="text-white bg-black size-6" />
                </div>
                <div onClick={shareOnFarcaster}>
                  <SiFarcaster className="bg-white text-[#8a63d2] rounded-full size-[40px] cursor-pointer" />
                </div>
                <div onClick={shareOnTelegram}>
                  <FaTelegram className="text-[#1d98dc] bg-white size-[40px] cursor-pointer" />
                </div>
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-md flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center flex-wrap gap-2">
                  <div className="text-xs sm:text-sm md:text-base text-gray-800">
                    Total earnings from referrals
                  </div>
                  <button className="bg-black text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
                    Claim
                  </button>
                </div>
                <div className="text-blue-600 font-bold text-sm sm:text-base md:text-lg">
                  {0} ETH
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default InviteCreators;
