import React, { useState } from "react";
import discourse from "@/assets/images/watchmeeting/discourse.svg";
import twitter from "@/assets/images/watchmeeting/twitter.svg";
import discord from "@/assets/images/watchmeeting/discord.svg";
import github from "@/assets/images/watchmeeting/github.svg";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";

interface ProfileInfo {
  _id: string;
  address: string;
  image: string;
  description: string;
  daoName: string;
  isDelegate: boolean;
  displayName: string;
  socialHandles: {
    twitter: string;
    discord: string;
    discourse: string;
    github: string;
  };
  emailId: string;
}
interface Attendee {
  attendee_address: string;
  attendee_uid: string;
  profileInfo: ProfileInfo;
}

interface HostProfileInfo {
  _id: string;
  address: string;
  image: string;
  description: string;
  daoName: string;
  isDelegate: boolean;
  displayName: string;
  socialHandles: {
    twitter: string;
    discord: string;
    discourse: string;
    github: string;
  };
  emailId: string;
}

interface Meeting {
  _id: string;
  slot_time: string;
  office_hours_slot: string; // Assuming this is a date-time string
  title: string;
  description: string;
  video_uri: string;
  meetingId: string;
  attendees: Attendee[];
  uid_host: string;
  dao_name: string;
  host_address: string;
  joined_status: string | null;
  booking_status: string;
  meeting_status:
    | "active"
    | "inactive"
    | "ongoing"
    | "Recorded"
    | "Upcoming"
    | "Ongoing"; // Assuming meeting status can only be active or inactive
  session_type: string;
  hostProfileInfo: HostProfileInfo;
}

const WatchSocialLinks = ({
  data,
  collection,
}: {
  data: Meeting;
  collection: string;
}) => {
  const [showComingSoon, setShowComingSoon] = useState(true);
  console.log("data of socials: ", data);

  const socialLinks = [
    {
      img: discourse,
      socialMedia: "Discourse",
      handles:
        data.dao_name === "optimism" &&
        data.hostProfileInfo?.socialHandles?.discourse
          ? `https://gov.optimism.io/${data.hostProfileInfo?.socialHandles?.discourse}`
          : data.dao_name === "arbitrum" &&
            data.hostProfileInfo?.socialHandles?.discourse
          ? `https://forum.arbitrum.foundation/${data.hostProfileInfo?.socialHandles?.discourse}`
          : "",
    },
    {
      img: twitter,
      socialMedia: "Twitter",
      handles: data.hostProfileInfo?.socialHandles?.twitter
        ? `https://twitter.com/${data.hostProfileInfo?.socialHandles?.twitter}`
        : "",
    },
    {
      img: discord,
      socialMedia: "Discord",
      handles: data.hostProfileInfo?.socialHandles?.discord
        ? `https://discord.com/${data.hostProfileInfo?.socialHandles?.discord}`
        : "",
    },
    {
      img: github,
      socialMedia: "Github",
      handles: data.hostProfileInfo?.socialHandles?.github
        ? `https://github.com/${data.hostProfileInfo?.socialHandles?.github}`
        : "",
    },
  ].filter((link) => link.handles);

  return (
    <>
      <div className="font-poppins text-lg  ">
        <div className="flex mb-5">
          <p className="font-medium">Social Links</p>
        </div>
        <div className="flex flex-col gap-2">
          {socialLinks && socialLinks.length > 0 ? (
            socialLinks.map((link, index) => (
              <Link href={link.handles} key={index}>
                <div className="flex rounded-full border border-blue-shade-100 bg-white py-2 hover:bg-blue-shade-400">
                  <Image
                    src={link.img}
                    alt=""
                    width={23}
                    height={23}
                    className="ml-6"
                  />
                  <div className="text-blue-shade-100 align-middle flex items-center justify-center w-full">
                    {link.socialMedia}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <>No socials added by the host.</>
          )}
        </div>
      </div>
    </>
  );
};

export default WatchSocialLinks;
