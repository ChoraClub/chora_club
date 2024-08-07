import React from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaBalanceScale,
  FaBook,
} from "react-icons/fa";
import about from "../../utils/about_dao.json";
import { FaBridge, FaDiscord, FaTwitter } from "react-icons/fa6";
import { GoMirror } from "react-icons/go";
import { SiHiveBlockchain } from "react-icons/si";

function AboutDao({ props }: any) {
  const text = props === "arbitrum" ? about.arbitrum : about.optimism;
  const links =
    props === "arbitrum"
      ? [
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
          {
            name: "Twitter",
            icon: FaTwitter,
            href:
              "arbitrum" in text.community_and_resources.twitter
                ? text.community_and_resources.twitter.arbitrum
                : "",
            color: "text-[#1DA1F2]",
          },
          {
            name: "DAO Twitter",
            icon: FaTwitter,
            href:
              "dao" in text.community_and_resources.twitter
                ? text.community_and_resources.twitter.dao
                : "",
            color: "text-[#1DA1F2]",
          },
        ]
      : [
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
            name: "Mirror",
            icon: GoMirror,
            href:
              "mirror" in text.community_and_resources
                ? text.community_and_resources.mirror
                : "",
            color: "text-[#000]",
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
          {
            name: "Twitter",
            icon: FaTwitter,
            href:
              "optimism" in text.community_and_resources.twitter
                ? text.community_and_resources.twitter.optimism
                : "",
            color: "text-[#1DA1F2]",
          },
          {
            name: "Gov Twitter",
            icon: FaTwitter,
            href:
              "gov" in text.community_and_resources.twitter
                ? text.community_and_resources.twitter.gov
                : "",
            color: "text-[#1DA1F2]",
          },
        ];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-shade-100">
          Mission and Vision
        </h2>
        <div className="bg-gray-50 shadow-md rounded-lg p-8 mb-10 ">
          <div className="mb-4 ms-8">
            <h2 className="text-lg font-semibold mb-2">Mission:</h2>
            <ul className="list-disc pl-8 ">
              <li className=" ">{text.mission_and_vision.mission}</li>
            </ul>
          </div>
          <div className="ms-8">
            <h2 className="text-lg font-semibold mb-2">Vision:</h2>
            <ul className="list-disc pl-8">
              {text.mission_and_vision.vision.map((item, index) => (
                <li key={index} className="mb-1">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mt-5 mb-5 text-blue-shade-100">
            Technology
          </h2>
          <div className="bg-gray-50 shadow-md rounded-lg p-8 mb-10 ps-8">
            <div className="ms-8">
              <p className="mb-2">{text.technology.description}</p>
              <ul className="list-disc pl-8">
                {props === "arbitrum"
                  ? (
                      text.technology.features as {
                        name: string;
                        description: string;
                      }[]
                    ).map((item, index) => (
                      <li key={index} className="mb-2">
                        <p className="font-semibold">{item.name}:</p>
                        <p>{item.description}</p>
                      </li>
                    ))
                  : (text.technology.features as string[]).map(
                      (item, index) => (
                        <li key={index} className="mb-1">
                          {item}
                        </li>
                      )
                    )}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mt-5 mb-5 text-blue-shade-100">
            Governance and DAO Structure
          </h2>
          <div className="bg-gray-50 shadow-md rounded-lg p-8 mb-10 ">
            <div className="ms-8">
              <p className="mb-2">
                {text.governance_and_dao_structure.description}
              </p>
              <ul className="list-disc pl-8">
                {props === "arbitrum"
                  ? (
                      text.governance_and_dao_structure as {
                        elements: { name: string; details: string }[];
                      }
                    ).elements.map((element, index) => (
                      <li key={index} className="mb-2">
                        <p className="font-semibold">{element.name}:</p>
                        <p>{element.details}</p>
                      </li>
                    ))
                  : (
                      text.governance_and_dao_structure as {
                        houses: { name: string; details: string }[];
                      }
                    ).houses.map((house, index) => (
                      <li key={index} className="mb-2">
                        <p className="font-semibold">{house.name}:</p>
                        <p> {house.details}</p>
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-8 text-blue-shade-100">
          Community and Resources
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-gray-50 shadow-md rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition duration-300">
                <link.icon className={`${link.color} text-xl`} />
                <span className="text-gray-700">{link.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default AboutDao;
