import React, { useState } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Image from "next/image";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import EventTile from "../../utils/EventTile";

function BookedUserSessions() {
  const details = [
    {
      img: text1,
      title: "Optimism Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      status: "Approved",
      attendee: "olimpio.eth",
      host: "lindaxie.eth",
      started: "20/09/2023 05:15 PM EST",
      desc: "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
    {
      img: text2,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      status: "Pending",
      attendee: "olimpio.eth",
      host: "hexagon.eth",
      started: "21/09/2023 02:00 PM EST",
      desc: "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
    {
      img: text2,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      status: "Rejected",
      attendee: "olimpio.eth",
      host: "hexagon.eth",
      started: "22/09/2023 11:45 PM EST",
      desc: "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
  ];

  const [sessionDetails, setSessionDetails] = useState(details);

  return (
    <div className="space-y-6">
      {sessionDetails.length > 0 ? (
        sessionDetails.map((data, index) => (
          <EventTile key={index} tileIndex={index} data={data} isEvent="Book"/>
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

export default BookedUserSessions;
