// import React,{useState, useEffect} from 'react'
// import Tile from '@/components/utils/Tile'
// import { useAccount } from 'wagmi';
// import text1 from "@/assets/images/daos/texture1.png";

// function UserAttendedHours() {
//     const { chain, chains } = useAccount();
//     const details = [
//         {
//           img: text1,
//           title: "Open Forum: Governance, Applications, and Beyond",
//           dao: `${chain && chain.name}`,
//           participant: 12,
//           attendee: "0xf4b0556b9b6f53e00a1fdd2b0478ce841991d8fa",
//           host: "lindaxie.eth",
//           started: "07/09/2023 12:15 PM EST",
//           desc: `Join the conversation about the future of ${chain && chain.name}. Discuss governance proposals, dApp adoption, and technical developments.`,
//         },
//       ];
    
//       const [sessionDetails, setSessionDetails] = useState(details);
//       const [dataLoading, setDataLoading] = useState(true);
  
//       useEffect(() => {
//           setSessionDetails(details);
//           setDataLoading(false);
//       }, []);
  
//     return (
//       <>
//         <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Recorded" isOfficeHour={true} />
//       </>
//     );
//   }

// export default UserAttendedHours