import React, { useState, useEffect } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import Tile from "@/components/utils/Tile";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function RecordedDelegateOfficeHrs({ props }: { props: Type }) {
  const details = [
    {
      img: text1,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: props.daoDelegates,
      participant: 12,
      attendee: "olimpio.eth",
      host: "lindaxie.eth",
      started: "2 hours ago",
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
    <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="recorded" isOfficeHour={true} />
  );
}

export default RecordedDelegateOfficeHrs;
