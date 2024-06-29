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
import about from "../../utils/about_dao.json";

const processText = (text:any) => {
  // Replace headings
  text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');

  // Replace bold text
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Replace bullet points
  text = text.replace(/^\s*- (.+)$/gm, '<li>$1</li>');

  // Wrap lists in <ul> tags
  text = text.replace(/(<li>.*<\/li>\n)+/gs, '<ol>\n$&</ol>\n');

  // Replace links
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Replace newlines with <br> tags
  text = text.replace(/\n/g, '<br>\n');

  return text;
};

function AboutDao({ props }:any) {
  const links = [
    { name: "Profile", icon: FaUser, href: "/profile", color: "text-[#a6a6a6]" },
    { name: "Contact", icon: FaEnvelope, href: "/contact", color: "text-[#36b0f7]" },
    { name: "GitHub", icon: FaGithub, href: "https://github.com", color: "text-[#000]" },
    { name: "LinkedIn", icon: FaLinkedin, href: "https://linkedin.com", color: "text-[#0a66c2]" },
    { name: "Website", icon: FaGlobe, href: "/", color: "text-blue-500" },
    { name: "Governance", icon: FaBalanceScale, href: "/governance", color: "text-purple-600" },
    { name: "Documentation", icon: FaBook, href: "/docs", color: "text-gray-700" },
    { name: "Bug Bounty", icon: FaBug, href: "/bug-bounty", color: "text-red-500" },
    { name: "Blog", icon: FaBlog, href: "/blog", color: "text-indigo-500" },
    { name: "Mirror", icon: FaMediumM, href: "https://mirror.xyz", color: "text-black" },
    { name: "Twitch", icon: FaTwitch, href: "https://twitch.tv", color: "text-purple-500" },
  ];

  const text = props === "arbitrum" ? about.arb_description : about.op_description;
  const formattedText = processText(text);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-50 shadow-md rounded-lg p-6 mb-10">
      <div dangerouslySetInnerHTML={{ __html: formattedText }} />
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
