import React, { useEffect, useState } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Tile from "@/components/utils/Tile";
import { StaticImageData } from 'next/image';
interface Type {
    daoDelegates: string;
    individualDelegate: string;
  }
  
function DelegateHostedSessions({ props }: { props: Type }) {
    const details = [
      {
        img: text1,
        title: "Open Forum: Governance, Applications, and Beyond",
        dao: props.daoDelegates,
        participant: 12,
        attendee: "0xf4b0556b9b6f53e00a1fdd2b0478ce841991d8fa",
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
    <>
      <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Recorded" isOfficeHour={false} />
    </>
  );
}

export default DelegateHostedSessions;
