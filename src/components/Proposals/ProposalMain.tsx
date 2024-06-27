"use client";
import React, { useEffect, useState, useCallback } from "react";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import Image from "next/image";
import user1 from "@/assets/images/daos/user1.png";
import { IoArrowBack } from "react-icons/io5";
import { IoShareSocialSharp } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import IndividualDaoHeader from "../utils/IndividualDaoHeader";
import { LuDot } from "react-icons/lu";
import user from "@/assets/images/daos/user1.png";
import chain from "@/assets/images/daos/chain.png";
// import style from './proposalMain.module.css';
import {
  Provider,
  cacheExchange,
  createClient,
  fetchExchange,
  gql,
} from "urql";

interface VoteCast {
  voter: string;
  weight: string;
  support: number;
}
interface Props {
  id: string;
}
interface Proposal {
  proposalId: string;
  blockTimestamp: number;
  description?: string;
  votesLoaded?: boolean;
  support0Weight?: number;
  support1Weight?: number;
  support2Weight?: number;
  votersCount?: number;
}
import { Tooltip as Tooltips } from "@nextui-org/react";
import style from "./proposalMain.module.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid,Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ProposalMain({ props }: { props: Props }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [voterCount, setVoterCount] = useState(10);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [voterList,setVoterList] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setLink(window.location.href);
  }, []);
  const weiToEther = (wei: string): number => {
    return Number(wei) / 1e18;
  };

  useEffect(() => {
    const fetchDescription = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(props)
        const response = await fetch(`/api/get-proposals?proposalId=${props.id}`);
        const result = await response.json();
        console.log("result", result)
        const { proposalCreated1S, proposalCreated2S, proposalCreated3S, proposalCreateds } = result.data;

        if (proposalCreated1S.length > 0) {
          setData(proposalCreated1S[0]);
        } else if (proposalCreated2S.length > 0) {
          setData(proposalCreated2S[0]);
        } else if (proposalCreated3S.length > 0) {
          setData(proposalCreated3S[0]);
        } else if (proposalCreateds.length > 0) {
          setData(proposalCreateds[0]);
        } else {
          setData('Nothing found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();

  }, [props]);

  const fetchVotes = useCallback(async () => {
  

    let allVotes: VoteCast[] = [];
    let skip1 = 0;
    let skip2 = 0;
    const first = 1000; // Batch size

    try {
      while (true) {
        const response = await fetch(`/api/get-voters?proposalId=${props.id}&skip1=${skip1}&skip2=${skip2}&first=${first}`);
        const data = await response.json();
        console.log("data", data)
        const newVoteCastWithParams = data?.voteCastWithParams || [];
        const newVoteCasts = data?.voteCasts || [];

        if (newVoteCastWithParams.length === 0 && newVoteCasts.length === 0) {
          break;
        }

        allVotes = [...allVotes, ...newVoteCastWithParams, ...newVoteCasts];
        skip1 += newVoteCastWithParams.length;
        skip2 += newVoteCasts.length;
      }
      allVotes.sort((a, b) => {
        const weightA = BigInt(a.weight);
        const weightB = BigInt(b.weight);
        return weightB > weightA ? 1 : -1;
      });
      setVoterList(allVotes);
      setIsLoading(false)

      let s0Weight = 0;
      let s1Weight = 0;
      let s2Weight = 0;

      allVotes.forEach((vote: VoteCast) => {
        const weightInEther = weiToEther(vote.weight);
        if (vote.support === 0) {
          s0Weight += weightInEther;
        } else if (vote.support === 1) {
          s1Weight += weightInEther;
        } else if (vote.support === 2) {
          s2Weight += weightInEther;
        }
      });
      console.log("Fetched votes:", s0Weight, s1Weight, s2Weight);
      return {
        support0Weight: s0Weight,
        support1Weight: s1Weight,
        support2Weight: s2Weight,
        votersCount: allVotes.length,
        votesLoaded: true,
      };
    } catch (err: any) {
      console.error("Error fetching votes:", err);
      throw err;
    }
  }, []);

  useEffect(() => { fetchVotes() }, [])
  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    let hours: any = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format and adjust midnight (0) to 12
    hours = String(hours).padStart(2, '0'); // Pad hours with leading zero if necessary
    return `${day} ${month}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };


function ProposalMain({ props }: { props: string }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [voterCount, setVoterCount] = useState(10);

  const Chartdata = [
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

  const formatWeight = (weight: number | string): string => {
    const numWeight = Number(weight);
    
    if (isNaN(numWeight)) {
      return 'Invalid';
    }

    if (numWeight >= 1e9) {
      return (numWeight / 1e9).toFixed(2) + 'B';
    } else if (numWeight >= 1e6) {
      return (numWeight / 1e6).toFixed(2) + 'M';
    } else if (numWeight >= 1e3) {
      return (numWeight / 1e3).toFixed(2) + 'K';
    } else {
      return numWeight.toFixed(2);
    }
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(link);
    const text = encodeURIComponent(
      ` ${decodeURIComponent(
        url
      )} via @ChoraClub\n\n#choraclub #session #growth`
    );

    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, "_blank");
  };

  const handleAddressClick = (address: any) => {
    router.push(`/optimism/${address}?active=info`);
  };
  const date = data?.blockTimestamp;
  console.log("data", data)

  const truncateText = (text: any, wordLimit: any) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
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

      <div className="h-[50vh] rounded-[1rem] mx-24 px-12 py-6 transition-shadow duration-300 ease-in-out shadow-xl bg-gray-50 font-poppins relative">
        <div className="flex items-center">
          <div className="flex gap-2 items-center">
            {loading ? (<p></p>) : (<p className="text-3xl font-semibold">{truncateText(data?.description, 7)}</p>)}
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
            <p onClick={() => handleAddressClick('0xf11b6a8c3cb8bb7dbc1518a613b10ceb0bbfc06b')} className="cursor-pointer hover:text-blue-shade-100">0xf11b6a8c3cb8bb7dbc1518a613b10ceb0bbfc06b</p>
            <LuDot /> {(formatDate(date))}
            {/* {console.log(formatDate(data.blockTimestamp))} */}
          </div>
          <div className="rounded-full bg-[#dbf8d4] border border-[#639b55] flex w-fit items-end justify-center text-[#639b55] text-xs h-fit py-0.5 font-medium px-2">SUCCEEDED</div>
        </div>

        <div className="text-sm mt-3">
          {loading ? (
            <p>Loading description...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            data.description
          )}
        </div>
      </div>

      <h1 className="my-8 mx-24 text-4xl font-semibold text-blue-shade-100 font-poppins">Voters</h1>
      <div className="h-[80vh] mx-24 w-fit font-poppins">
        <div className="flex py-3 mb-3 bg-gray-100 w-[46vw] transition-shadow duration-300 ease-in-out shadow-lg text-xl font-semibold pr-6">
          <h3 className="w-[75%] flex pl-8 items-center justify-center">ENS Address</h3>
          <h3 className="w-[25%] flex justify-center items-center ml-auto">Votes</h3>
        </div>

        <div className={`${voterCount > 5 ? `h-[400px] overflow-y-auto ${style.scrollbar}` : ''}`}>
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-shade-100"></div>
            </div>
          ) : (
            voterList.map((voter:any, index:any) => (
              <div className="flex py-4 pl-8 pr-6 text-base mb-2 bg-gray-50 hover:bg-gray-200 transition-shadow duration-300 ease-in-out shadow-lg w-[45vw]" key={index}>
                <div className="w-[75%] flex justify-start items-center ">
                  <Image src={user1} alt="" className="size-8 mx-2" />
                  <p 
                    onClick={() => handleAddressClick(voter.voter)} 
                    className="cursor-pointer hover:text-blue-shade-100"
                  >
                    {voter.voter}
                  </p>
                </div>
                <div className="w-[25%] flex justify-center items-center ml-auto gap-2">
                <div className="bg-[#dbf8d4] border  py-0.5 px-2 text-[#639b55] border-[#639b55] rounded-md text-sm font-medium flex w-32 justify-center items-center">
                    {/* {formatVoteWeight(voter.weight)} {getVoteType(voter.support)} */}
                  { formatWeight(voter.weight/10**18)}
                  </div>
                </div>
              </div>
            ))
          )}
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
}

export default ProposalMain;
