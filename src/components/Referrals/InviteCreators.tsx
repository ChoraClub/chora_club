import React, { useEffect, useState } from "react";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";
import { SiFarcaster } from "react-icons/si";
import { BASE_URL } from "@/config/constants";
import Image from "next/image";
import user from "@/assets/images/user/user8.svg";
import { fetchInviteeDetails } from "./InviteUtils";
import Link from "next/link";
import { useConnection } from "@/app/hooks/useConnection";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import Heading from "../ComponentUtils/Heading";
import { RxCross2 } from "react-icons/rx";

function InviteCreators({ userAddress }: { userAddress: any }) {
  const [copied, setCopied] = useState(false);
  const [inviteeDetails, setInviteeDetails] = useState<any>();
  const { isConnected, isLoading, isSessionLoading, isPageLoading, isReady } =
    useConnection();
  const [earnings, setEarnings] = useState(0);
  const [showComingSoon, setShowComingSoon] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${BASE_URL}/invite/${userAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  const url = encodeURIComponent(`${BASE_URL}/invite/${userAddress}`);
  const text = encodeURIComponent(`Join me on Chora Club`);

  const shareOn = (platform: any) => {
    const url = encodeURIComponent(`${BASE_URL}/invite/${userAddress}`);
    const text = encodeURIComponent(
      `Join me on Chora Club and let's revolutionize Web3 together! 🚀`
    );
    const links: any = {
      farcaster: `https://warpcast.com/~/compose?text=${text}&embeds%5B%5D=${url}`,
      telegram: `https://t.me/share/url?text=${text}&url=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    };
    window.open(links[platform], "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      const details = await fetchInviteeDetails(userAddress);
      setInviteeDetails(details);
      // setIsPageLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="min-h-screen h-full bg-gradient-to-br from-blue-50 to-purple-50 ">
        <div className="relative container mx-auto px-4 py-8">
          <Heading />

          <main className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-xl p-8"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Welcome,{" "}
                {inviteeDetails?.ensName ||
                  inviteeDetails?.displayName ||
                  "Creator"}
                !
              </h1>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Ready to earn ETH by inviting creators?
                </h2>
                <p className="text-lg text-gray-600">
                  Invite creators to Chora Club and earn ETH every time they
                  mint! The more you bring, the more you earn!
                </p>
                <Link
                  href="https://docs.chora.club/earn-rewards/create-referral-reward"
                  target="_blank"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
                >
                  Learn more about referrals →
                </Link>
              </div>

              <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
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
                    className="rounded-full border-4 border-white shadow-lg"
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
                <p className="text-center text-gray-700 mb-2">
                  Your unique invite link:
                </p>
                <div className="flex items-center bg-white rounded-md overflow-hidden">
                  <input
                    type="text"
                    value={`${BASE_URL}/invite/${userAddress}`}
                    readOnly
                    className="flex-grow p-3 text-gray-700 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-3 font-semibold transition-colors duration-200 ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Share your invite:
                </h3>
                <div className="flex justify-center gap-6">
                  {[
                    {
                      platform: "twitter",
                      icon: FaXTwitter,
                      color: "bg-black",
                      iconStyle: "text-white",
                      iconSize: 20,
                    },
                    {
                      platform: "farcaster",
                      icon: SiFarcaster,
                      color: "bg-[#9c64ed]",
                      iconStyle: "text-white",
                      iconSize: 28,
                    },
                    {
                      platform: "telegram",
                      icon: FaTelegram,
                      color: "",
                      iconStyle: "text-[#229ED9] bg-white",
                      iconSize: 48,
                    },
                  ].map(
                    ({ platform, icon: Icon, color, iconStyle, iconSize }) => (
                      <motion.button
                        key={platform}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => shareOn(platform)}
                        className={`${color} rounded-full transition-colors duration-200 w-12 h-12 flex items-center justify-center `}
                      >
                        <Icon size={iconSize} className={`${iconStyle} `} />
                      </motion.button>
                    )
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaFire className="text-orange-500 mr-2" /> Your Earnings
                  {showComingSoon && (
                    <div className="flex items-center bg-[#ffffff] border border-yellow-400 rounded-full px-2 ml-4 py-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-yellow-700 mx-2">
                        Claiming feature coming soon
                      </p>
                      <button
                        onClick={() => setShowComingSoon(false)}
                        className="text-yellow-700 hover:text-yellow-800"
                      >
                        <RxCross2 size={12} />
                      </button>
                    </div>
                  )}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">
                    Total earnings from referrals:
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {earnings} ETH
                  </p>
                </div>
                <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 hover:cursor-not-allowed">
                  Claim Rewards
                </button>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
}

export default InviteCreators;