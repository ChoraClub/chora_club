import Image from "next/image";
import text1 from "@/assets/images/daos/texture1.png";
import React, { useState, useEffect } from "react";
import Tile from "@/components/utils/Tile";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function UpcomingDelegateOfficeHrs({ props }: { props: Type }) {
  const details = [
    {
      img: text1,
      title: "Open Forum: Governance, Applications",
      dao: props.daoDelegates,
      participant: 12,
      attendee: "olimpio.eth",
      host: "lindaxie.eth",
      started: "07/09/2023 12:15 PM IST",
      desc: `Join the conversation about the future of ${props.daoDelegates}. Discuss governance proposals, dApp adoption, and technical developments.`,
    },
  ];

  const [sessionDetails, setSessionDetails] = useState(details);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    setSessionDetails(details);
    setDataLoading(false);
  }, []);
  return (
    <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Upcoming" isOfficeHour={true} />
  );
}

export default UpcomingDelegateOfficeHrs;
