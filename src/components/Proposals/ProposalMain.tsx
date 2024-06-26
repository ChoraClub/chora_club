"use client";
import react, { useEffect, useState } from "react";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import Image from "next/image";
import user1 from "@/assets/images/daos/user1.png";
import { IoArrowBack } from "react-icons/io5";
import { IoShareSocialSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import IndividualDaoHeader from "../utils/IndividualDaoHeader";
import { LuDot } from "react-icons/lu";
import user from "@/assets/images/daos/user1.png";
import chain from "@/assets/images/daos/chain.png";
import { Tooltip as Tooltips } from "@nextui-org/react";
import style from "./proposalMain.module.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid,Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ProposalMain({ props }: { props: string }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [voterCount, setVoterCount] = useState(10);

  const data = [
    { name: 'Day 1', For: 4000, Against: 2400 },
    { name: 'Day 2', For: 3000, Against: 1398 },
    { name: 'Day 3', For: 2000, Against: 9800 },
    { name: 'Day 4', For: 2780, Against: 3908 },
    { name: 'Day 5', For: 1890, Against: 4800 },
    { name: 'Day 6', For: 2390, Against: 3800 },
    { name: 'Day 7', For: 3490, Against: 4300 },
  ];

  const [isChartLoading, setIsChartLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartLoading(false);
    }, 2000); // Simulate 2 seconds loading time
  
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    setLink(window.location.href);
  }, []);

  const shareOnTwitter = () => {
    const url = encodeURIComponent(link);
    const text = encodeURIComponent(
      ` ${decodeURIComponent(
        url
      )} via @ChoraClub\n\n#choraclub #session #growth`
    );

    // Twitter share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

    // Open Twitter share dialog
    window.open(twitterUrl, "_blank");
  };

  const handleAddressClick = (address: any) => {
    router.push(`/optimism/${address}?active=info`);
  };

  return (
    <>
      {/* <div className="mx-10 my-8 flex justify-between  ">
        <h1 className="capitalize text-4xl text-blue-shade-100 flex items-center justify-between">
          Optimism/ Arbritrum
        </h1>
        <ConnectWalletWithENS />
      </div> */}
      <div className="pr-8 pb-5 pl-16 pt-6">
        <IndividualDaoHeader />
      </div>

      {/* buttons */}
      <div className="flex gap-4 mx-24 mb-8 mt-2 font-poppins">
        <div
          className="text-white bg-blue-shade-100 rounded-full py-1.5 px-4 flex justify-center items-center gap-1 cursor-pointer"
          onClick={handleBack}
        >
          <IoArrowBack />
          Back
        </div>
        <div
          className="text-white bg-blue-shade-100 rounded-full py-1.5 px-4 flex justify-center items-center gap-1 cursor-pointer"
          onClick={shareOnTwitter}
        >
          Share
          <IoShareSocialSharp />
        </div>
      </div>

      {/* For description */}
      <div
        className="h-[50vh] rounded-[1rem] mx-24 px-12 py-6 transition-shadow duration-300 ease-in-out shadow-xl bg-gray-50 font-poppins relative"
        // style={{
        //   boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
        // }}
      >
        <div className="flex items-center">
          <div className="flex gap-2 items-center">
            <p className="text-3xl font-semibold ">
              Season 6: V2. Code of Conduct Council Renewal
            </p>
            <Tooltips
              showArrow
              content={<div className="font-poppins">OnChain</div>}
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              <Image src={chain} alt="" className="size-6 cursor-pointer" />
            </Tooltips>
          </div>
          <div className="rounded-full bg-[#f4d3f9] border border-[#77367a] flex items-center justify-center text-[#77367a] text-xs h-fit  py-0.5 font-medium px-2 w-fit ml-auto ">
            Closed
          </div>
        </div>
        <div className="flex gap-1 my-1 items-center">
          <Image src={user} alt="" className="size-4" />
          <div className="flex text-xs font-normal items-center">
            {" "}
            <p
              onClick={() =>
                handleAddressClick("0xf11b6a8c3cb8bb7dbc1518a613b10ceb0bbfc06b")
              }
              className="cursor-pointer hover:text-blue-shade-100"
            >
              0xf11b6a8c3cb8bb7dbc1518a613b10ceb0bbfc06b{" "}
            </p>
            <LuDot /> Created At 10 May 2025
          </div>
          <div className="rounded-full bg-[#dbf8d4] border border-[#639b55] flex w-fit items-end justify-center text-[#639b55] text-xs h-fit  py-0.5 font-medium px-2">
            SUCCEEDED
          </div>
        </div>

        <div className="text-sm mt-3">
          Please see the Code of Conduct Rescoping #2 before voting on this
          proposal:
          https://gov.optimism.io/t/season-6-code-of-conduct-rescoping-2/8101.
          This v2 proposal addresses feedback from the previous cycle, aiming to
          renew the Code of Conduct Council for Season 6. If approved, the
          Council will become a persistent structure within the Collective,
          managing the enforcement of the Rules of Engagement. The proposed Code
          of Conduct Council Operating Budget, presented by Juan Carlos Bell
          (juankbell), is 26k OP:
          https://gov.optimism.io/t/final-v2-code-of-conduct-council-operating-budget-re-scope-for-season-6-cycle-23b/8271
          This proposal is eligible for Special Voting Cycle #23b:
          https://gov.optimism.io/t/final-v2-code-of-conduct-council-operating-budget-re-scope-for-season-6-cycle-23b/8271
          Delegates may choose to approve an operating budget for the Code of
          Conduct Council to oversee the Rules of Engagement in Season 6,
          effectively electing the proposal author as Council Lead. If delegates
          do not believe an elected Council is necessary to enforce the Rules of
          Engagement, they should not approve any operating budget for a Code of
          Conduct Council. In the event that no operating budget is approved for
          a Code of Conduct Council, the supportNERDs will continue to monitor
          the forum and enforce the Rules of Engagement as they previously have.
        </div>
      </div>


      <div className="flex ">

     
      {/* For Voters  */}
      <div>

      
      <h1 className="my-8 ml-24 text-4xl font-semibold text-blue-shade-100 font-poppins">
        Voters
      </h1>
      <div className="h-[460px] ml-24 hover:mr-7 mr-10 w-fit font-poppins  transition-shadow duration-300 ease-in-out shadow-xl">
              <div
          className={`${
            voterCount > 5 ? `h-[460px] overflow-y-auto gap-2 flex flex-col ${style.scrollContainer}` : ""
          }`}
        >
          {Array.from({ length: voterCount }).map((_, index) => (
            <div
              className="flex py-4 pl-8 pr-6 text-base  bg-gray-50 hover:bg-gray-200 transition-shadow duration-300 ease-in-out shadow-lg w-[45vw]"
              key={index}
            >
              <div className="w-[75%] flex justify-start items-center ">
                <Image src={user1} alt="" className="size-8 mx-2" />
                <p
                  onClick={() =>
                    handleAddressClick(
                      "0xf11b6a8c3cb8bb7dbc1518a613b10ceb0bbfc06b"
                    )
                  }
                  className="cursor-pointer hover:text-blue-shade-100"
                >
                  0xf11b6a8c3cb8bb7dbc1518a613b10ceb0bbfc06b
                </p>
              </div>
              <div className="w-[25%] flex justify-center items-center ml-auto ">
                
                <div className="bg-[#dbf8d4] border  py-0.5 px-2 text-[#639b55] border-[#639b55] rounded-md text-sm font-medium flex w-32 justify-center items-center">
                  3.5M For
                </div>
                <div>arrow</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/*  Chart for status   */}
      <div className="w-[40vw] mr-16 my-[105px]  transition-shadow duration-300 ease-in-out shadow-xl h-[460px] flex text-sm items-center justify-center bg-gray-50 font-poppins">
      {isChartLoading ? (
   <>
     <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black-shade-900"></div>
   </>
  ) :(
    
  <ResponsiveContainer width="100%" height={400} className=''>
    <LineChart
      data={data}
      margin={{
        top: 40,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="For" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="Against" stroke="#ff4560" strokeWidth={2}/>
    </LineChart>
  </ResponsiveContainer>
  )}
 
</div>

</div>

    </>
  );
}
export default ProposalMain;
