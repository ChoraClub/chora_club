import React from "react";
import Link from "next/link";
import {
  FaUser,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaBalanceScale,
  FaBook,
  FaBug,
  FaBlog,
  FaMediumM,
  FaTwitch,
} from "react-icons/fa";
import { IoEarth } from "react-icons/io5";

function AboutDao({ props }: { props: string }) {
  const links = [
    {
      name: "Profile",
      icon: FaUser,
      href: "/profile",
      color: "text-[#a6a6a6]",
    },
    {
      name: "Contact",
      icon: FaEnvelope,
      href: "/contact",
      color: "text-[#36b0f7]",
    },
    {
      name: "GitHub",
      icon: FaGithub,
      href: "https://github.com",
      color: "text-[#000]",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: "https://linkedin.com",
      color: "text-[#0a66c2]",
    },
    { name: "Website", icon: FaGlobe, href: "/", color: "text-blue-500" },
    {
      name: "Governance",
      icon: FaBalanceScale,
      href: "/governance",
      color: "text-purple-600",
    },
    {
      name: "Documentation",
      icon: FaBook,
      href: "/docs",
      color: "text-gray-700",
    },
    {
      name: "Bug Bounty",
      icon: FaBug,
      href: "/bug-bounty",
      color: "text-red-500",
    },
    { name: "Blog", icon: FaBlog, href: "/blog", color: "text-indigo-500" },
    {
      name: "Mirror",
      icon: FaMediumM,
      href: "https://mirror.xyz",
      color: "text-black",
    },
    {
      name: "Twitch",
      icon: FaTwitch,
      href: "https://twitch.tv",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-50 shadow-md rounded-lg p-6 mb-10">
        <p className="text-gray-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi magni
          reprehenderit possimus hic, tempora est culpa quibusdam delectus
          ratione ex, laborum pariatur? Veritatis rerum quae laudantium
          similique necessitatibus, eius dolorum. Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Doloribus, fugit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Numquam incidunt perspiciatis
          quaerat culpa cumque at consequatur mollitia et nostrum.
        </p>
      </div>
      <h2 className="text-2xl font-semibold mb-8 text-blue-shade-100">Important Links</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map((link) => (
          <Link key={link.name} href={link.href}>
            <div className="bg-gray-50 shadow-md rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition duration-300">
              <link.icon className={`${link.color} text-xl`} />
              <span className="text-gray-700">{link.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AboutDao;
