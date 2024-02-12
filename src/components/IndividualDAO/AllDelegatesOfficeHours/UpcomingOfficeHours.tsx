import React, { useEffect, useState } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Image from "next/image";

function UpcomingOfficeHours({
  params,
  props,
}: {
  params: string;
  props: string;
}) {
  const details = [
    {
      img: text1,
      title: "Open Forum: Governance, Applications",
      dao: props,
      participant: 12,
      attendee: "olimpio.eth",
      host: "0xf4b0556b9b6f53e00a1fdd2b0478ce841991d8fa",
      started: "07/09/2023 12:1 SPM 1ST",
      desc: `Join the conversation about the future of ${props}. Discuss governance proposals, dApp adoption, and technical developments.`,
    },
    {
      img: text2,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: props,
      participant: 5,
      attendee: "olimpio.eth",
      host: "0x1b686ee8e31c5959d9f5bbd8122a58682788eead",
      started: "07/09/2023 12:1 SPM 1ST",
      desc: `Join the conversation about the future of ${props}. Discuss governance proposals, dApp adoption, and technical developments.`,
    },
  ];

  const [sessionDetails, setSessionDetails] = useState(details);

  useEffect(() => {
    const filtered = details.filter(
      (item) =>
        item.title.toLowerCase().includes(params.toLowerCase()) ||
        item.host.toLowerCase().includes(params.toLowerCase())
    );
    setSessionDetails(filtered);
  }, [params]);

  return (
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
                <div className="bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold capitalize">
                  {data.dao}
                </div>
                <div className="border border-[#1E1E1E] rounded-md text-[#1E1E1E] text-xs px-5 py-1">
                  {data.participant} Participants
                </div>
              </div>

              <div className="pt-1 pe-10">
                <hr />
              </div>

              <div className="flex gap-x-16 text-sm py-3">
                <div className="text-[#3E3D3D]">
                  <span className="font-semibold">Host:</span>{" "}
                  {data.host.substring(0, 10)}...
                </div>
                <div className="text-[#3E3D3D]">
                  <span className="font-semibold">Starts at:</span>{" "}
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
  );
}

export default UpcomingOfficeHours;
