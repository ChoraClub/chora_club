import React, { useState } from "react";
import discourse from "@/assets/images/watchmeeting/discourse.svg";
import twitter from "@/assets/images/watchmeeting/twitter.svg";
import discord from "@/assets/images/watchmeeting/discord.svg";
import github from "@/assets/images/watchmeeting/github.svg";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import {
  DynamicAttendeeInterface,
  SessionInterface,
} from "@/types/MeetingTypes";
import { UserProfileInterface } from "@/types/UserProfileTypes";

interface Attendee extends DynamicAttendeeInterface {
  profileInfo: UserProfileInterface;
}

interface Meeting extends SessionInterface {
  attendees: Attendee[];
  hostProfileInfo: UserProfileInterface;
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
      <div className="font-poppins 1.7xl:text-lg  text-base w-full">
        <div className="flex mb-5">
          <p className="font-medium xl:text-base 1.7xl:text-lg">Social Links</p>
        </div>
        <div className="flex flex-col gap-2">
          {socialLinks && socialLinks.length > 0 ? (
            socialLinks.map((link, index) => (
              <Link href={link.handles} key={index} target="_blank">
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
            <div className="flex items-center justify-center rounded-full border text-sm border-black-shade-200 bg-white py-2 hover:bg-blue-shade-400 text-blue-shade-100">
              <p className="font-medium">No socials added by the host.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WatchSocialLinks;
