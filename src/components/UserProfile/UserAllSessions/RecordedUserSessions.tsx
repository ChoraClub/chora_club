import React, { useState } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Image from "next/image";
import search from "@/assets/images/daos/search.png";

function RecordedUserSessions() {
  const details = [
    {
      img: text1,
      title:
        "Recorded Optimism Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      participant: 12,
      attendee: "olimpio.eth",
      host: "lindaxie.eth",
      started: "07/09/2023 12:1 SPM 1ST",
      desc: "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
    {
      img: text2,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      participant: 5,
      attendee: "olimpio.eth",
      host: "hexagon.eth",
      started: "07/09/2023 12:1 SPM 1ST",
      desc: "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
  ];

  const [sessionDetails, setSessionDetails] = useState(details);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    // setDaoInfo(daoInfo);
    setSearchQuery(query);

    const filtered = details.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );

    console.log("Filtered Data: ", filtered);

    setSessionDetails(filtered);
  };

  return (
    <div>
      <div
        style={{ background: "rgba(238, 237, 237, 0.36)" }}
        className="flex border-[0.5px] border-black w-fit rounded-full mb-8 font-poppins"
      >
        <input
          type="text"
          placeholder="Search"
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="pl-5 rounded-full outline-none"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        ></input>
        <span className="flex items-center bg-black rounded-full px-5 py-2">
          <Image src={search} alt="search" width={20} />
        </span>
      </div>
      <div className="space-y-6">
        {sessionDetails.length > 0 ? (
          sessionDetails.map((data, index) => (
            <div
              key={index}
              className="flex p-5 rounded-[2rem]"
              style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
            >
              <Image
                src={data.img}
                alt="image"
                className="w-44 h-44 rounded-3xl border border-[#D9D9D9]"
              />

              <div className="ps-6 pe-12 py-1">
                <div className="font-semibold text-blue-shade-200 text-lg">
                  {data.title}
                </div>

                <div className="flex space-x-4 py-2">
                  <div className="bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold">
                    {data.dao}
                  </div>
                  <div className="border border-[#1E1E1E] rounded-md text-[#1E1E1E] text-xs px-5 py-1">
                    {data.participant} Views
                  </div>
                </div>

                <div className="pt-1 pe-10">
                  <hr />
                </div>

                <div className="flex gap-x-16 text-sm py-3">
                  <div className="text-[#3E3D3D]">
                    <span className="font-semibold">Attendee:</span>{" "}
                    {data.attendee}
                  </div>
                  <div className="text-[#3E3D3D]">
                    <span className="font-semibold">Host:</span> {data.host}
                  </div>
                  <div className="text-[#3E3D3D]">
                    <span className="font-semibold">Started at:</span>{" "}
                    {data.started}
                  </div>
                </div>

                <div className="text-[#1E1E1E] text-sm">{data.desc}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecordedUserSessions;
