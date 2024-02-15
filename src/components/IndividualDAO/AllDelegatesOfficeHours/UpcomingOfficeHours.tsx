import React, { useEffect, useState } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Tile from "@/components/utils/Tile";
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
      started: "16/09/2023 01:15 PM EST",
      desc: `Join the conversation about the future of ${props}. Discuss governance proposals, dApp adoption, and technical developments.`,
    },
    {
      img: text2,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: props,
      participant: 5,
      attendee: "olimpio.eth",
      host: "0x1b686ee8e31c5959d9f5bbd8122a58682788eead",
      started: "18/09/2023 02:00 PM EST",
      desc: `Join the conversation about the future of ${props}. Discuss governance proposals, dApp adoption, and technical developments.`,
    },
  ];

  const [sessionDetails, setSessionDetails] = useState(details);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    setSessionDetails(details);
    setDataLoading(false);
  }, []);
  useEffect(() => {
    const filtered = details.filter(
      (item) =>
        item.title.toLowerCase().includes(params.toLowerCase()) ||
        item.host.toLowerCase().includes(params.toLowerCase())
    );
    setSessionDetails(filtered);
  }, [params]);

  return (
    <>
    <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Upcoming" isOfficeHour={true} />
  </>  
  );
}

export default UpcomingOfficeHours;
