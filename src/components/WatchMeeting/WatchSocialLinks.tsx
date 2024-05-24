import React from 'react'
import discourse from "@/assets/images/watchmeeting/discourse.svg";
import twitter from "@/assets/images/watchmeeting/twitter.svg";
import discord from "@/assets/images/watchmeeting/discord.svg";
import github from "@/assets/images/watchmeeting/github.svg";
import Image from "next/image";

const WatchSocialLinks = () => {
    const socialLinks=[
        {img:discourse,socialMedia:"Discourse"},
        {img:twitter,socialMedia:"Twitter"},
        {img:discord,socialMedia:"Discord"},
        {img:github,socialMedia:"Github"},
      ]
  return (
    <>
    <div className="font-poppins text-lg  ">
                <p className="mb-5 font-medium">Social Links</p>
                <div className="flex flex-col gap-2">
                  {socialLinks.map((link, index)=>(
                    <div className="flex rounded-full border border-blue-shade-100 bg-white py-2 hover:bg-blue-shade-400">
                      <Image src={link.img} alt="" width={23} height={23} className="ml-6"/>
                      <div className="text-blue-shade-100 align-middle flex items-center justify-center w-full">{link.socialMedia}</div>
                    </div>
                  ))}
                </div>

              </div>
    </>
  )
}

export default WatchSocialLinks