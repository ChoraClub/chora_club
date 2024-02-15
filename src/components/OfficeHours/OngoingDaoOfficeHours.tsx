import React, { useEffect, useState } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Tile from "../utils/Tile";
import { StaticImageData } from 'next/image';

interface Type {
  img: StaticImageData;
  title: string;
  dao: string;
  participant: number;
  attendee: string;
  host: string;
  started: string;
  desc: string;
}

function OngoingDaoOfficeHours({ params }: { params: string }) {
  const details: Type[] = [
    {
      img: text1,
      title: "Optimism Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      participant: 12,
      attendee: "olimpio.eth",
      host: "lindaxie.eth",
      started: "07/09/2023 12:15 PM EST",
      desc:
        "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
    {
      img: text2,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: "Arbitrum",
      participant: 5,
      attendee: "olimpio.eth",
      host: "l2beatcom.eth",
      started: "08/09/2023 01:15 PM EST",
      desc:
        "Join the conversation about the future of Arbitrum. Discuss governance proposals, dApp adoption, and technical developments.",
    },
  ];

  const [sessionDetails, setSessionDetails] = useState<Type[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    setSessionDetails(details);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    setDataLoading(true);
    const filtered = details.filter(
      (item) =>
        item.title.toLowerCase().includes(params.toLowerCase()) ||
        item.host.toLowerCase().includes(params.toLowerCase())
    );
    setSessionDetails(filtered);
    setDataLoading(false);
  }, [params]);

  return (
    <>
      <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Ongoing" isOfficeHour={true}/>
    </>
  );
}

export default OngoingDaoOfficeHours;
