import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaBalanceScale,
  FaBook,
  FaDiscord,
} from "react-icons/fa";
import { FaBridge, FaXTwitter } from "react-icons/fa6";
import { GoMirror } from "react-icons/go";
import { SiHiveBlockchain } from "react-icons/si";
import about from "../../utils/about_dao.json";

const AboutDao = ({ props }: any) => {
  const text = props === "arbitrum" ? about.arbitrum : about.optimism;
  const links = [
    {
      name: "Website",
      icon: FaGlobe,
      href: text.community_and_resources.website,
      color: "text-blue-500",
    },
    {
      name: "Governance",
      icon: FaBalanceScale,
      href: text.community_and_resources.governance,
      color: "text-purple-600",
    },
    {
      name: "Forum",
      icon: FaEnvelope,
      href: text.community_and_resources.forum,
      color: "text-[#36b0f7]",
    },
    {
      name: "Bridge",
      icon: FaBridge,
      href: text.community_and_resources.bridge,
      color: "text-[#000]",
    },
    {
      name: "Docs",
      icon: FaBook,
      href: text.community_and_resources.docs,
      color: "text-gray-700",
    },
    {
      name: "GitHub",
      icon: FaGithub,
      href: text.community_and_resources.github,
      color: "text-[#000]",
    },
    {
      name: "Discord",
      icon: FaDiscord,
      href: text.community_and_resources.discord,
      color: "text-[#5865F2]",
    },
    {
      name: "Block Explorer",
      icon: SiHiveBlockchain,
      href: text.community_and_resources.block_explorer,
      color: "text-[#000]",
    },
    ...(props === "arbitrum"
      ? [
          {
            name: "Twitter",
            icon: FaXTwitter,
            href:
              "arbitrum" in text.community_and_resources.twitter
                ? text.community_and_resources.twitter.arbitrum
                : "",
            color: "text-[#1DA1F2]",
          },
          {
            name: "DAO Twitter",
            icon: FaXTwitter,
            href:
              "dao" in text.community_and_resources.twitter
                ? text.community_and_resources.twitter.dao
                : "",
            color: "text-[#1DA1F2]",
          },
        ]
      : [
          {
            name: "Mirror",
            icon: GoMirror,
            href:
              "mirror" in text.community_and_resources
                ? text.community_and_resources.mirror
                : "",
            color: "text-[#000]",
          },
          {
            name: "Twitter",
            icon: FaXTwitter,
            href:
              "optimism" in text.community_and_resources.twitter
                ? text.community_and_resources.twitter.optimism
                : "",
            color: "text-[#1DA1F2]",
          },
          {
            name: "Gov Twitter",
            icon: FaXTwitter,
            href:
              "gov" in text.community_and_resources.twitter
                ? text.community_and_resources.twitter.gov
                : "",
            color: "text-[#1DA1F2]",
          },
        ]),
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-blue-600"
        {...fadeInUp}
      >
        About {props === "arbitrum" ? "Arbitrum" : "Optimism"} DAO
      </motion.h1>

      <motion.section className="mb-16" {...fadeInUp}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">
          Mission and Vision
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Mission:
            </h3>
            <p className="text-gray-700">{text.mission_and_vision.mission}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Vision:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              {text.mission_and_vision.vision.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      <motion.section className="mb-16" {...fadeInUp}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">
          Technology
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-gray-700 mb-4">{text.technology.description}</p>
          <ul className="space-y-4">
            {props === "arbitrum"
              ? (
                  text.technology.features as {
                    name: string;
                    description: string;
                  }[]
                ).map((item, index) => (
                  <li key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-600">{item.name}</h4>
                    <p className="text-gray-700">{item.description}</p>
                  </li>
                ))
              : (text.technology.features as string[]).map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
          </ul>
        </div>
      </motion.section>

      <motion.section className="mb-16" {...fadeInUp}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">
          Governance and DAO Structure
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-gray-700 mb-4">
            {text.governance_and_dao_structure.description}
          </p>
          <ul className="space-y-4">
            {props === "arbitrum"
              ? (
                  text.governance_and_dao_structure as {
                    elements: { name: string; details: string }[];
                  }
                ).elements.map((element, index) => (
                  <li key={index} className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-600">
                      {element.name}
                    </h4>
                    <p className="text-gray-700">{element.details}</p>
                  </li>
                ))
              : (
                  text.governance_and_dao_structure as {
                    houses: { name: string; details: string }[];
                  }
                ).houses.map((house, index) => (
                  <li key={index} className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-600">
                      {house.name}
                    </h4>
                    <p className="text-gray-700">{house.details}</p>
                  </li>
                ))}
          </ul>
        </div>
      </motion.section>

      <motion.section {...fadeInUp}>
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">
          Community and Resources
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <link.icon className={`${link.color} text-2xl`} />
                <span className="text-gray-700 font-medium">{link.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default AboutDao;