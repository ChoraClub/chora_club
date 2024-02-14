"use client";

import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
import user from "@/assets/images/daos/user3.png";
import { FaXTwitter, FaDiscord, FaGithub } from "react-icons/fa6";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import UserInfo from "./UserInfo";
import UserVotes from "./UserVotes";
import UserSessions from "./UserSessions";
import UserOfficeHours from "./UserOfficeHours";
import ClaimNFTs from "./ClaimNFTs";
import { FaPencil } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount} from "wagmi";
import { useNetwork } from 'wagmi'

function MainProfile() {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<File | undefined>();
  const [hovered, setHovered] = useState(false);
  const [profileDetails, setProfileDetails] = useState<any>();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [socials, setSocials] = useState({
    twitter: "https://twitter.com/",
    discourse: "https://google.com/",
    discord: "https://discord.com/",
    github:"https://github.com/"
  });
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [discourse, setDiscourse] = useState("");
  const [github, setGithub] = useState("");

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setImg(selectedFile);
    }
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setSocials({
      ...socials,
      [fieldName]: value,
    });
  };

  const formatNumber = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "m";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "k";
    } else {
      return number;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dao = "";
        if (chain && chain.name === "Optimism") {
          dao = "optimism";
        } else if (chain && chain.name === "Arbitrum One") {
          dao = "arbitrum";
        } else {
          return;
        }

        const res = await fetch(
          `https://api.karmahq.xyz/api/dao/find-delegate?dao=${dao}&user=${address}`
        );
        const details = await res.json();
        console.log("Socials: ", details.data.delegate);
        setProfileDetails(details.data.delegate);

        if (details.data.delegate.twitterHandle != null) {
          setTwitter(
            `https://twitter.com/${details.data.delegate.twitterHandle}`
          );
        }

        if (details.data.delegate.discourseHandle != null) {
          if (dao === "optimism") {
            setDiscourse(
              `https://gov.optimism.io/u/${details.data.delegate.discourseHandle}`
            );
          }
          if (dao === "arbitrum") {
            setDiscourse(
              `https://forum.arbitrum.foundation/u/${details.data.delegate.discourseHandle}`
            );
          }
        }

        if (details.data.delegate.discordHandle != null) {
          setDiscord(
            `https://discord.com/${details.data.delegate.discordHandle}`
          );
        }

        if (details.data.delegate.githubHandle != null) {
          setGithub(
            `https://github.com/${details.data.delegate.githubHandle}`
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
  
      }
    };

    fetchData();
  }, [chain, address]);

  return (
    <div className="font-poppins">
      <div className="flex ps-14 py-5 pe-10 justify-between">
        <div className="flex">
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
              <Image
                src={profileDetails?.profilePicture || user}
                alt="user"
                width={40}
                height={40}
                className="w-40 rounded-3xl"
              />
            <div
              className={`absolute top-3 right-3 cursor-pointer  ${
                hovered ? "bg-gray-50 rounded-full p-1" : "hidden"
              } `}
              onClick={handleLogoClick}
            >
              <FaPencil className="opacity-100 backdrop-blur-sm" size={12} />
              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="px-4">
            <div className=" flex items-center py-1">
            <div className="font-bold text-lg pr-4">
              {profileDetails?.ensName ? (
                profileDetails?.ensName
              ) : (
                <>
                {`${address}`.substring(0, 6)} ...{" "}
                {`${address}`.substring(`${address}`.length - 4)}
              </>
              )}
            </div>
              <div className="flex gap-3">
              <Link
                href={twitter}
                className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                  twitter == "" ? "hidden" : ""
                }`}
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                target="_blank"
              >
                <FaXTwitter color="#7C7C7C" size={12} />
              </Link>
              <Link
                href={discourse}
                className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1  ${
                  discourse == "" ? "hidden" : ""
                }`}
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                target="_blank"
              >
                <BiSolidMessageRoundedDetail color="#7C7C7C" size={12} />
              </Link>
              <Link
                href={discord}
                className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                  discord == "" ? "hidden" : ""
                }`}
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                target="_blank"
              >
                <FaDiscord color="#7C7C7C" size={12} />
              </Link>
              <Link
                href={github}
                className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                  github == "" ? "hidden" : ""
                }`}
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                target="_blank"
              >
                <FaGithub color="#7C7C7C" size={12} />
              </Link>
                <Tooltip
                  content="Edit social links"
                  placement="right"
                  showArrow
                >
                  <span
                    className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                    style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                    onClick={onOpen}
                  >
                    <FaPencil color="#3e3d3d" size={12} />
                  </span>
                </Tooltip>
                <Modal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  className="font-poppins"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Edit Socials
                        </ModalHeader>
                        <ModalBody>
                          <div className="px-1 font-medium">Twitter ID:</div>
                          <input
                            type="url"
                            value={twitter}
                            placeholder="https://twitter.com/"
                            className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                            onChange={(e) =>
                              handleInputChange("twitter", e.target.value)
                            }
                          />

                          <div className="px-1 font-medium">Discourse ID:</div>
                          <input
                            type="url"
                            value={discourse}
                            placeholder="https://discourse.com/"
                            className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                            onChange={(e) =>
                              handleInputChange("discourse", e.target.value)
                            }
                          />

                          <div className="px-1 font-medium">Discord ID:</div>
                          <input
                            type="url"
                            value={discord}
                            placeholder="https://discord.com/"
                            className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                            onChange={(e) =>
                              handleInputChange("discord", e.target.value)
                            }
                          />
                          <div className="px-1 font-medium">Github ID:</div>
                          <input
                            type="url"
                            value={github}
                            placeholder="https://github.com/"
                            className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                            onChange={(e) =>
                              handleInputChange("github", e.target.value)
                            }
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button color="default" onPress={onClose}>
                            Close
                          </Button>
                          <Button color="primary" onPress={onClose}>
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </div>

            <div className="flex items-center py-1">
              <div>
                {`${address}`.substring(0, 6)} ...{" "}
                {`${address}`.substring(`${address}`.length - 4)}
              </div>

              <Tooltip
                content="Copy"
                placement="right"
                closeDelay={1}
                showArrow
              >
                <span className="px-2 cursor-pointer" color="#3E3D3D">
                  <IoCopy onClick={() => handleCopy(`${address}`)} />
                </span>
              </Tooltip>
              <Toaster
                toastOptions={{
                  style: {
                    fontSize: "14px",
                    backgroundColor: "#3E3D3D",
                    color: "#fff",
                    boxShadow: "none",
                    borderRadius: "50px",
                    padding: "3px 5px",
                  },
                }}
              />
            </div>

            <div className="flex gap-4 py-1">
              <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
              <span className="text-blue-shade-200 font-semibold">
                {formatNumber(Number(profileDetails?.delegatedVotes))}
                &nbsp;
              </span>
              delegated tokens
              </div>
              <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
                Delegated from
                <span className="text-blue-shade-200 font-semibold">
                  &nbsp;{formatNumber(profileDetails?.delegatorCount)}&nbsp;
                </span>
                Addresses
              </div>
            </div>

            <div className="pt-2 flex gap-5">
              <button className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]">
                Delegate
              </button>
              {/* <div className="">
                <select className="outline-none border border-blue-shade-200 text-blue-shade-200 rounded-full py-2 px-3">
                  <option className="text-gray-700">Optimism</option>
                  <option className="text-gray-700">Arbitrum</option>
                </select>
              </div> */}
            </div>
          </div>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>

      <div className="flex gap-12 bg-[#D9D9D945] pl-16">
        <button
          className={`border-b-2 py-4 px-2 outline-none ${
            searchParams.get("active") === "info"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=info")}
        >
          Info
        </button>
        <button
          className={`border-b-2 py-4 px-2 outline-none ${
            searchParams.get("active") === "votes"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=votes")}
        >
          Past Votes
        </button>
        <button
          className={`border-b-2 py-4 px-2 outline-none ${
            searchParams.get("active") === "sessions"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() =>
            router.push(path + "?active=sessions&session=schedule")
          }
        >
          Sessions
        </button>
        <button
          className={`border-b-2 py-4 px-2 outline-none ${
            searchParams.get("active") === "officeHours"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() =>
            router.push(path + "?active=officeHours&hours=schedule")
          }
        >
          Office Hours
        </button>
        <button
          className={`border-b-2 py-4 px-2 outline-none ${
            searchParams.get("active") === "claimNft"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=claimNft")}
        >
          Claim NFTs
        </button>
      </div>

      <div className="py-6 ps-16">
        {searchParams.get("active") === "info" ? <UserInfo /> : ""}
        {searchParams.get("active") === "votes" ? <UserVotes /> : ""}
        {searchParams.get("active") === "sessions" ? <UserSessions /> : ""}
        {searchParams.get("active") === "officeHours" ? (
          <UserOfficeHours />
        ) : (
          ""
        )}
        {searchParams.get("active") === "claimNft" ? <ClaimNFTs /> : ""}
      </div>
    </div>
  );
}

export default MainProfile;
