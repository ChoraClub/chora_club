import React, { useState, useEffect } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import Tile from "@/components/utils/Tile";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function AttendedDelegateOfficeHrs({ props }: { props: Type }) {
  const details = [
    {
      img: text1,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: props.daoDelegates,
      participant: 12,
      attendee: "olimpio.eth",
      host: "lindaxie.eth",
      started: "21/09/2023 12:15 PM IST",
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
    <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Recorded" isOfficeHour={true} />
  );
}

export default AttendedDelegateOfficeHrs;
