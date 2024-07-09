"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import Image from "next/image";
import user1 from "@/assets/images/daos/user1.png";
import { IoArrowBack } from "react-icons/io5";
import { IoShareSocialSharp } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import IndividualDaoHeader from "../utils/IndividualDaoHeader";
import { LuDot } from "react-icons/lu";
import chain from "@/assets/images/daos/chain.png";
import user2 from "@/assets/images/user/user2.svg";
import user5 from "@/assets/images/user/user5.svg";

interface ArbitrumVote {
  voter: {
    name: string;
    picture: string;
    address: string;
    twitter: string;
  };
  amount: string;
  type: string;
}

interface VoteCast {
  voter: string;
  weight: string;
  support: number;
}
interface Props {
  id: string;
  daoDelegates: string;
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RiArrowRightUpLine, RiExternalLinkLine } from "react-icons/ri";
import ProposalMainVotersSkeletonLoader from "../SkeletonLoader/ProposalMainVotersSkeletonLoader";
import ProposalMainDescriptionSkeletonLoader from "../SkeletonLoader/ProposalMainDescriptionSkeletonLoader";

function ProposalMain({ props }: { props: Props }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [voterList, setVoterList] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any>([]);
  const [canceledProposals, setCanceledProposals] = useState<any[]>([]);
  const [support0Weight, setSupport0Weight] = useState(0);
  const [support1Weight, setSupport1Weight] = useState(0);
  const [isArbitrum, setIsArbitrum] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);

  const loadMore = () => {
    const newDisplayCount = displayCount + 20;
    setDisplayCount(newDisplayCount);
  };

  useEffect(() => {
    setIsArbitrum(props?.daoDelegates === "arbitrum"); // Arbitrum One chain ID
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isExpanded
        ? `${contentRef.current.scrollHeight}px`
        : "141px"; // 6 lines * 24px line-height
    }
  }, [isExpanded, data?.description]);
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const getLineCount = (text: string) => {
    const lines = text.split("\n");
    return lines.length;
  };

  useEffect(() => {
    setLink(window.location.href);
  }, []);
  const weiToEther = (wei: string): number => {
    return Number(wei) / 1e18;
  };

  const formatDescription = (description: any) => {
    if (!description) return "";

    // Convert headers (lines starting with #)
    description = description.replace(/^# (.+)$/gm, "<h2>$1</h2>");
    description = description.replace(
      /(\*\*)(.+?)(\*\*)/g,
      "<strong>$2</strong>"
    );
    description = description.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    description = description.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    description = description.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    // Convert links [text](url)
    description = description.replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="underline">$1</a>'
    );
    description = description.replace(
      /<(https?:\/\/[^>]+)>/g,
      '<a href="$1" class="underline">$1</a>'
    );
    // Convert bullet points (lines starting with *)
    let inList = false;
    description = description
      .split("\n")
      .map((line: any) => {
        if (line.trim().startsWith("*")) {
          if (!inList) {
            inList = true;
            return (
              '<br/><ul class="list-disc pl-5 mb-3"><li >' +
              line.trim().substring(1).trim() +
              "</li>"
            );
          }
          return (
            '<li class="mb-1">' + line.trim().substring(1).trim() + "</li>"
          );
        } else {
          if (inList) {
            inList = false;
            return "</ul>" + line;
          }
          return line;
        }
      })
      .join("\n");

    if (inList) {
      description += "</ul>";
    }

    // Convert remaining newlines to <br> tags
    description = description.replace(/\n/g, "<br>");

    return description;
  };

  useEffect(() => {
    const fetchCanacelledProposals = async () => {
      const response = await fetch(`/api/get-canceledproposal`);
      const result = await response.json();

      setCanceledProposals(result);
    };
    fetchCanacelledProposals();
  }, []);
  useEffect(() => {
    const fetchDescription = async () => {
      if (props.daoDelegates === "optimism") {
        setLoading(true);
        setError(null);
        try {

          const response = await fetch(
            `/api/get-proposals?proposalId=${props.id}`
          );
          const result = await response.json();
 
          const {
            proposalCreated1S,
            proposalCreated2S,
            proposalCreated3S,
            proposalCreateds,
          } = result.data;

          if (proposalCreated1S.length > 0) {
            setData(proposalCreated1S[0]);
          } else if (proposalCreated2S.length > 0) {
            setData(proposalCreated2S[0]);
          } else if (proposalCreated3S.length > 0) {
            setData(proposalCreated3S[0]);
          } else if (proposalCreateds.length > 0) {
            setData(proposalCreateds[0]);
          } else {
            setData("Nothing found");
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError(null);

        try {
          const response = await fetch(
            `/api/get-arbitrumproposals?proposalId=${props.id}`
          );
          const result = await response.json();
          setData(result.data.proposalCreateds[0])

        } catch (err: any) {
          setError(err.message);

        }
      }


      setLoading(false);

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
        const response = await fetch(
          `/api/get-voters?proposalId=${props.id}&skip1=${skip1}&skip2=${skip2}&first=${first}&dao=${props.daoDelegates}`
        );
        const data = await response.json();
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
      setIsLoading(false);

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
      setSupport0Weight(s0Weight);
      setSupport1Weight(s1Weight);
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

  useEffect(() => {

    fetchVotes();

  }, []);

  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    let hours: any = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format and adjust midnight (0) to 12
    hours = String(hours).padStart(2, "0"); // Pad hours with leading zero if necessary
    return `${day} ${month}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };


  // New useEffect to handle chart data processing
  const formatWeight = (weight: number | string): string => {
    const numWeight = Number(weight);

    if (isNaN(numWeight)) {
      return "Invalid";
    }

    if (numWeight >= 1e9) {
      return (numWeight / 1e9).toFixed(2) + "B";
    } else if (numWeight >= 1e6) {
      return (numWeight / 1e6).toFixed(2) + "M";
    } else if (numWeight >= 1e3) {
      return (numWeight / 1e3).toFixed(2) + "K";
    } else {
      return numWeight.toFixed(2);
    }
  };

  useEffect(() => {
    if (voterList && voterList.length > 0) {
      // Sort voterList by blockTimestamp
      const sortedVoterList = [...voterList].sort(
        (a, b) => parseInt(a.blockTimestamp) - parseInt(b.blockTimestamp)
      );
      const startTimestamp = parseInt(sortedVoterList[0].blockTimestamp);
      const endTimestamp = parseInt(
        sortedVoterList[sortedVoterList.length - 1].blockTimestamp
      );

      const getDayFromTimestamp = (timestamp: number): string => {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(startTimestamp * 1000);
        startDate.setUTCHours(0, 0, 0, 0);
        const date = new Date(timestamp * 1000);
        const dayNumber =
          Math.floor(
            (date.getTime() - startDate.getTime()) / millisecondsPerDay
          ) + 1;
        return `Day ${dayNumber}`;
      };

      const aggregateDataByDay = (data: typeof sortedVoterList) => {
        const aggregatedData: Record<
          string,
          { For: number; Against: number; date: Date }
        > = {};
        let cumulativeFor = 0;
        let cumulativeAgainst = 0;

        data.forEach((entry: any) => {
          const timestamp = parseInt(entry.blockTimestamp);
          const day = getDayFromTimestamp(timestamp);
          const weight = parseFloat(entry.weight) / 1e18; // Convert wei to ether

          if (entry.support === 1) {
            cumulativeFor += weight;
          } else {
            cumulativeAgainst += weight;
          }

          aggregatedData[day] = {
            For: cumulativeFor,
            Against: cumulativeAgainst,
            date: new Date(timestamp * 1000),
          };
        });

        return aggregatedData;
      };

      const aggregatedData = aggregateDataByDay(sortedVoterList);

      const newChartData = Object.entries(aggregatedData)
        .sort(([, a], [, b]) => a.date.getTime() - b.date.getTime())
        .map(([day, data]) => {
          const formattedFor = formatWeight(data.For);
          const formattedAgainst = formatWeight(data.Against);

          return {
            name: day,
            For: data.For,
            Against: data.Against,
            date: data.date,
          };
        });
      setChartData(newChartData);
    }
  }, [voterList]);

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

  const handleTransactionClick = (transactionHash: any) => {
    isArbitrum ? window.open(
      `https://arbiscan.io/tx/${transactionHash}`,
      "_blank") :
      window.open(
        `https://optimistic.etherscan.io/tx/${transactionHash}`,
        "_blank"
      );
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
    if(props.daoDelegates === "optimism"){

      router.push(`/optimism/${address}?active=info`);
    }else{
      router.push(`/arbitrum/${address}?active=info`);
    }
    // window.location.href = `/optimism/${address}?active=info`;
  };
  const date = data?.blockTimestamp;
  const formatYAxis = (value: number) => {
    return formatWeight(value);
  };

  const truncateText = (text: string, charLimit: number) => {
    // Remove all '#' characters from the text
    const cleanedText = text.replace(/#/g, '');
    
    // Truncate the cleaned text if necessary
    return cleanedText.length <= charLimit ? cleanedText : cleanedText.slice(0, charLimit) + "...";
  };

  return (
    <>
      <div className="pr-8 pb-5 pl-16 pt-6">
        <IndividualDaoHeader />
      </div>

      {/* buttons */}
      <div className="flex gap-4 mx-24 mb-8 mt-5 font-poppins">
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

      <div
        className={` rounded-[1rem] mx-24 px-12 py-6 transition-shadow duration-300 ease-in-out shadow-xl bg-gray-50 font-poppins relative ${isExpanded ? "h-fit" : "h-fit"
          }`}
      >
        <div className="flex items-center ">
          <div className="flex gap-2 items-center">
            {loading ? (
              <div className="h-5 bg-gray-200 animate-pulse w-[50vw] rounded-full"></div>
            ) : (
              <p className="text-3xl font-semibold">
                {truncateText(data?.description, 50)}
              </p>
            )}
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

          <div
            className={`rounded-full flex items-center justify-center text-xs h-fit py-0.5 font-medium px-2 w-fit ml-auto ${data && data.blockTimestamp
                ? new Date() >
                  new Date(data.blockTimestamp * 1000 + 7 * 24 * 60 * 60 * 1000)
                  ? "bg-red-100 border border-red-500 text-red-500" // Closed state
                  : "bg-[#f4d3f9] border border-[#77367a] text-[#77367a]" // Active state
                : "bg-gray-200 animate-pulse  rounded-full" // Loading state
              }`}
          >
            {data && data.blockTimestamp ? (
              new Date() >
                new Date(data.blockTimestamp * 1000 + 7 * 24 * 60 * 60 * 1000) ? (
                "Closed"
              ) : (
                "Active"
              )
            ) : (
              <div className="h-5 w-20"></div>
            )}
          </div>
        </div>
        <div className="flex gap-1 my-1 items-center">
          <div className="flex text-xs font-normal items-center">
            {date ? (
              formatDate(date)
            ) : (
              <div className="animate-pulse bg-gray-200  h-4 w-32 rounded-full"></div>
            )}

          </div>

          <div
            className={`rounded-full flex items-end justify-center text-xs h-fit py-0.5 border font-medium w-24 ${data && support1Weight ?
                (props.daoDelegates === "optimism" &&
                  canceledProposals.some(
                    (item) => item.proposalId === props.id
                  )
                  ? "bg-red-200 border-red-500 text-red-500"
                  : support1Weight! > support0Weight!
                    ? "bg-green-200 border-green-600 text-green-600"
                    : "bg-red-200 border-red-500 text-red-500") :
                "bg-gray-200 animate-pulse  rounded-full"
              }`}
          >
            {data && support1Weight  ?
              (new Date() > new Date(data.blockTimestamp * 1000 + 7 * 24 * 60 * 60 * 1000)
                ?
                (canceledProposals.some(
                  (item) =>  item.proposalId === props.id
                )
                  ? "CANCELLED"
                  : support1Weight! > support0Weight!
                    ? "SUCCEEDED"
                    : "DEFEATED")
                : ("PENDING"))
              : (<div className="h-5 w-20"></div>)

            }
          </div>
        </div>

        <div className="text-sm mt-3">
          {loading ? (
            <ProposalMainDescriptionSkeletonLoader />
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              {/* // data.description */}
              <div
                ref={contentRef}
                className={`max-h-full transition-max-height duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-full" : "max-h-36"
                  }`}
              >
                <div
                  className="description-content"
                  dangerouslySetInnerHTML={{
                    __html: formatDescription(data?.description || ""),
                  }}
                />
              </div>
              {contentRef.current && contentRef.current.scrollHeight > 144 && (
                <button
                  className="text-sm text-blue-shade-200 mt-2"
                  onClick={toggleExpansion}
                >
                  {isExpanded ? "View Less" : "View More"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <h1 className="my-8 mx-24 text-4xl font-semibold text-blue-shade-100 font-poppins">
        Voters
      </h1>
      <div className="flex mb-6 ml-24 ">
        <div className="flex gap-8 items-center">
          <div className="h-[500px] w-[45%] font-poppins px-4 flex items-center justify-center rounded-2xl bg-gray-50 transition-shadow duration-300 ease-in-out shadow-xl">
          {
  isLoading ? (
    <ProposalMainVotersSkeletonLoader />
  ) : (
    <div
      className={`flex flex-col gap-2 py-3 pl-3 pr-2 my-3 border-gray-200 ${
        voterList.length > 5 ? `h-[440px] overflow-y-auto ${style.scrollbar}` : "h-fit"
      }`}
    >
      {voterList.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          ⏳ No Participation: This proposal hasn't received any votes yet.
        </div>
      ) : (
        voterList.slice(0, displayCount).map((voter: any, index: any) => (
          <div
            className="flex items-center py-6 px-6 bg-white transition-all duration-300 rounded-2xl border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-1 space-x-6"
            key={index}
          >
            <div className="flex-grow flex items-center space-x-4">
              {isArbitrum ? (
                <Image
                  src={user2}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <Image
                  src={user5}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              )}

              <div>
                <p
                  onClick={() => handleAddressClick(voter.voter)}
                  className="text-gray-800 font-medium hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                >
                  {voter.voter.slice(0, 6)}...
                  {voter.voter.slice(-4)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`px-4 py-2 rounded-full text-sm w-36 flex items-center justify-center font-medium ${
                  voter.support === 1 || voter.type === "for"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {formatWeight(voter.weight / 10 ** 18)}
                &nbsp;
                {voter.support === 1 ? "For" : "Against"}
              </div>
              <Tooltips
                showArrow
                content={<div className="font-poppins">Transaction Hash</div>}
                placement="right"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                <button
                  onClick={() => handleTransactionClick(voter.transactionHash)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <RiExternalLinkLine className="w-5 h-5" />
                </button>
              </Tooltips>
            </div>
          </div>
        ))
      )}
      {displayCount <= voterList.length && (
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={loadMore}
            className="bg-blue-shade-100 text-white py-2 px-4 w-fit rounded-lg font-medium"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

          </div>

{
  isChartLoading ? (
    <div
      className="w-[45vw] h-[500px] flex items-center justify-center bg-gray-50 rounded-2xl"
      style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
    >
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black-shade-900"></div>
    </div>
  ) :voterList && chartData.length === 0 ? (
    <div
      className="w-[45vw] h-[500px] flex items-center justify-center bg-gray-50 rounded-2xl"
      style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
    >
      <p className="text-lg font-poppins text-gray-500">📊 Chart Empty: No votes have been recorded on this chart. </p>
    </div>
  ) : (
    <div className="w-[45vw] transition-shadow duration-300 ease-in-out shadow-xl h-[500px] rounded-2xl flex text-sm items-center justify-center bg-gray-50 font-poppins">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#718096", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: "#718096", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <Tooltip
            formatter={(value) => formatWeight(value as number)}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "0.5rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              padding: "10px",
            }}
            labelStyle={{ color: "#2d3748", fontWeight: "bold" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="For"
            stroke="#4CAF50"
            strokeWidth={3}
            activeDot={{
              r: 8,
              fill: "#4CAF50",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="Against"
            stroke="#F44336"
            strokeWidth={3}
            activeDot={{
              r: 8,
              fill: "#F44336",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
        </div>
      </div>
    </>
  );
}

export default ProposalMain;
