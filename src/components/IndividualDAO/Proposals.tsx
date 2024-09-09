import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import { Tooltip } from "@nextui-org/react";
import { LuDot } from "react-icons/lu";
import opLogo from "@/assets/images/daos/op.png";
import user from "@/assets/images/daos/user1.png";
import chain from "@/assets/images/daos/chain.png";
import ProposalsSkeletonLoader from "../SkeletonLoader/ProposalsSkeletonLoader";
import ArbLogo from "@/assets/images/daos/arbCir.png";
import { dao_details } from "@/config/daoDetails";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";

interface Proposal {
  proposalId: string;
  blockTimestamp: number;
  description?: string;
  votesLoaded?: boolean;
  support0Weight?: number;
  support1Weight?: number;
  support2Weight?: number;
  votersCount?: number;
  status?: string;
  proposer: string;
  queueStartTime?: number;
  queueEndTime?: number;
}
const cache: any = {
  optimism: null,
  arbitrum: null,
};
let optimismCache: any = null;
let arbitrumCache: any = null;

function Proposals({ props }: { props: string }) {
  const router = useRouter();
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [displayedProposals, setDisplayedProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [canceledProposals, setCanceledProposals] = useState<any[]>([]);
  const proposalsPerPage = 7;
  const isOptimism = props === "optimism";
  const currentCache = isOptimism ? optimismCache : arbitrumCache;

  const VoteLoader = () => (
    <div className=" flex justify-center items-center w-32">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-shade-900"></div>
    </div>
  );
  const StatusLoader = () => (
    <div className="flex items-center justify-center w-24">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-shade-900"></div>
    </div>
  );

  const handleClick = (proposal: Proposal) => {
    router.push(`/${props}/proposals/${proposal.proposalId}`);
  };

  const weiToEther = (wei: string): number => {
    return Number(wei) / 1e18;
  };

  const formatWeight = (weight: number): string => {
    if (weight >= 1e9) {
      return (weight / 1e9).toFixed(2) + "B";
    } else if (weight >= 1e6) {
      return (weight / 1e6).toFixed(2) + "M";
    } else if (weight >= 1e3) {
      return (weight / 1e3).toFixed(2) + "K";
    } else {
      return weight?.toFixed(2);
    }
  };
  useEffect(() => {
    const fetchCanacelledProposals = async () => {
      const response = await fetch(`/api/get-canceledproposal?dao=${props}`);
      const result = await response.json();
      console.log("result", result);
      setCanceledProposals(result);
    };
    fetchCanacelledProposals();
  }, []);

  const fetchVotes = useCallback(
    async (proposal: Proposal): Promise<Proposal> => {
      let allVotes: any[] = [];
      let skip1 = 0;
      let skip2 = 0;
      const limit = 1000;
      let hasMore = true;

      try {
        while (hasMore) {
          const response = await fetch(
            `/api/get-voters?proposalId=${proposal.proposalId}&skip1=${skip1}&skip2=${skip2}&first=${limit}&dao=${props}`
          );
          const data = await response.json();

          const newVotes = [
            ...(data?.voteCastWithParams || []),
            ...(data?.voteCasts || []),
          ];

          if (newVotes.length === 0) {
            hasMore = false;
          } else {
            allVotes = [...allVotes, ...newVotes];
            skip1 += data?.voteCastWithParams?.length || 0;
            skip2 += data?.voteCasts?.length || 0;
          }
        }

        let s0Weight = 0;
        let s1Weight = 0;
        let s2Weight = 0;

        allVotes.forEach((vote: any) => {
          const weightInEther = weiToEther(vote.weight);
          if (vote.support === 0) {
            s0Weight += weightInEther;
          } else if (vote.support === 1) {
            s1Weight += weightInEther;
          } else if (vote.support === 2) {
            s2Weight += weightInEther;
          }
        });
        return {
          ...proposal,
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
    },
    [props]
  );
  const fetchProposals = async () => {
    setLoading(true);
    try {
      if (cache[props]) {
        setAllProposals(cache[props]);
        setDisplayedProposals(cache[props].slice(0, proposalsPerPage));
        setLoading(false);
        return;
      }
      let response;
      if (props === "optimism") {
        response = await fetch("/api/get-proposals");
      } else {
        response = await fetch(`/api/get-arbitrumproposals`);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      let newProposals;
      if (props === "optimism") {
        const {
          proposalCreated1S,
          proposalCreated2S,
          proposalCreated3S,
          proposalCreateds,
        } = responseData.data;

        newProposals = [
          ...proposalCreated1S,
          ...proposalCreated2S,
          ...proposalCreated3S,
          ...proposalCreateds,
        ].map((p) => ({
          ...p,
          votesLoaded: false,
        }));
        cache[props] = newProposals;
      } else {
        newProposals = responseData.data.proposalCreateds;
        const queueResponse = await fetch("/api/get-arbitrum-queue-info");
        const queueData = await queueResponse.json();
        newProposals = newProposals.map((proposal: Proposal) => {
          const queueInfo = queueData.data.proposalQueueds.find(
            (q: any) => q.proposalId === proposal.proposalId
          );
          return {
            ...proposal,
            queueStartTime: queueInfo?.blockTimestamp,
            queueEndTime: queueInfo?.eta,
          };
        });
      }
      newProposals.sort(
        (a: any, b: any) => b.blockTimestamp - a.blockTimestamp
      );

      cache[props] = newProposals;
      setAllProposals((prevProposals) => {
        const updatedProposals = [...prevProposals, ...newProposals];
        return updatedProposals.sort(
          (a, b) => b.blockTimestamp - a.blockTimestamp
        );
      });

      setDisplayedProposals((prevDisplayed) => {
        const newDisplayed = [...prevDisplayed, ...newProposals];
        return newDisplayed.slice(
          0,
          Math.min(newDisplayed.length, prevDisplayed.length + proposalsPerPage)
        );
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        setError("Please check your internet connection and try again.");
      } else if (error.name === "TimeoutError") {
        setError(
          "The request is taking longer than expected. Please try again."
        );
      } else if (error.name === "SyntaxError") {
        setError(
          "We're having trouble processing the data. Please try again later."
        );
      } else {
        setError(
          "Unable to load proposals. Please try again in a few moments."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVotesForDisplayedProposals = async () => {
      setLoading(true);
      try {
        const updatedProposals = await Promise.all(
          displayedProposals.map(async (proposal) => {
            if (!proposal.votesLoaded) {
              return await fetchVotes(proposal);
            }
            return proposal;
          })
        );

        if (isOptimism) {
          optimismCache = { updatedProposals, props };
        } else {
          arbitrumCache = { updatedProposals, props };
        }
        setDisplayedProposals(updatedProposals);
      } catch (error: any) {
        console.error("Error fetching votes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (displayedProposals.some((proposal) => !proposal.votesLoaded)) {
      fetchVotesForDisplayedProposals();
    }
  }, [displayedProposals, fetchVotes, props]);

  useEffect(() => {
    const proposals = async () => {
      if (currentCache && currentCache.props === props) {
        setDisplayedProposals(currentCache.updatedProposals);
        setLoading(false);
      } else {
        await fetchProposals();
      }
    };
    proposals();
  }, [props]);

  const getProposalStatus = (proposal: Proposal): string => {
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (props === "arbitrum") {
      if (proposal.queueStartTime && proposal.queueEndTime) {
        if (currentTime < proposal.queueStartTime) {
          return "PENDING";
        } else if (
          currentTime >= proposal.queueStartTime &&
          currentTime < proposal.queueEndTime
        ) {
          return "QUEUED";
        } else {
          return proposal.support1Weight! > proposal.support0Weight!
            ? "SUCCEEDED"
            : "DEFEATED";
        }
      } else {
        const proposalAge = currentTime - proposal.blockTimestamp;
        if (proposalAge <= 17 * 24 * 60 * 60) {
          return "PENDING";
        } else {
          return proposal.support1Weight! > proposal.support0Weight!
            ? "SUCCEEDED"
            : "DEFEATED";
        }
      }
    } else {
      if (
        canceledProposals.some(
          (item) => item.proposalId === proposal.proposalId
        )
      ) {
        return "CANCELLED";
      }
      const proposalAge = currentTime - proposal.blockTimestamp;
      if (proposalAge <= 7 * 24 * 60 * 60) {
        return "PENDING";
      } else {
        return proposal.support1Weight! > proposal.support0Weight!
          ? "SUCCEEDED"
          : "DEFEATED";
      }
    }
  };

  const loadMoreProposals = useCallback(() => {
    if (props === "optimism") {
      let nextPage;
      if (currentCache) {
        nextPage = currentCache.updatedProposals.length / proposalsPerPage + 1;
      } else {
        nextPage = currentPage + 1;
      }
      const startIndex = (nextPage - 1) * proposalsPerPage;
      const endIndex = startIndex + proposalsPerPage;
      const newProposals = cache[props].slice(startIndex, endIndex);
      setDisplayedProposals((prevProposals) => [
        ...prevProposals,
        ...newProposals,
      ]);
      setCurrentPage(nextPage);
    } else {
      // For Arbitrum
      const currentLength = displayedProposals.length;
      const moreProposals = cache[props].slice(
        currentLength,
        currentLength + proposalsPerPage
      );
      setDisplayedProposals((prevProposals) => [
        ...prevProposals,
        ...moreProposals,
      ]);

      if (currentLength + proposalsPerPage >= cache[props].length) {
        fetchProposals();
      }
    }
  }, [props, allProposals, currentPage, displayedProposals.length]);

  const truncateText = (text: string, charLimit: number) => {
    const cleanedText = text.replace(/#/g, "");

    return cleanedText.length <= charLimit
      ? cleanedText
      : cleanedText.slice(0, charLimit) + "...";
  };

  const formatDate = (timestamp: number): string => {
    const milliseconds = timestamp * 1000;

    const date = new Date(milliseconds);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = String(hours % 12 || 12).padStart(2, "0");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return `${day} ${month}, ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  if (loading && displayedProposals.length === 0)
    return <ProposalsSkeletonLoader />;

  const handleRetry = () => {
    setError(null);
    fetchProposals();
    window.location.reload();
  };

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );

  return (
    <>
      <div className="mr-[16px] rounded-[2rem] mt-4">
        {displayedProposals.map((proposal: Proposal, index: number) => (
          <div
            key={index}
            className="flex flex-col md:flex-row p-4 text-lg mb-2 gap-5 bg-gray-100 hover:bg-gray-50 rounded-3xl transition-shadow duration-300 ease-in-out shadow-lg cursor-pointer items-center"
            onClick={() => handleClick(proposal)}
          >
            <div className="flex items-center md:w-[60%]">
              <Image
                src={dao_details[props as keyof typeof dao_details].logo}
                alt={`${
                  dao_details[props as keyof typeof dao_details].title
                } logo`}
                className="size-10 mx-5 rounded-full flex-shrink-0"
              />

              <div>
                <p className="text-base font-medium">
                  {proposal.proposalId ===
                  "109425185690543736048728494223916696230797128756558452562790432121529327921478"
                    ? `[Cancelled] ${truncateText(
                        proposal.description || "",
                        65
                      )}`
                    : truncateText(proposal.description || "", 65)}
                </p>
                <div className="flex gap-1">
                  {/* <Image src={user} alt="" className="size-4" /> */}
                  <p className="flex text-xs font-normal items-center">
                    <span className="text-[#004DFF]"> Created at </span>&nbsp;
                    {formatDate(proposal.blockTimestamp)}
                    <span>
                      <LuDot />
                    </span>
                    <span className="font-bold text-sm text-blue-shade-200">
                      OnChain
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center md:w-[40%] mt-4 md:mt-0 gap-2">
              {/* <Tooltip
                showArrow
                content={<div className="font-poppins">OnChain</div>}
                placement="bottom"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                <div>
                  <Image src={chain} alt="" className="size-8" />
                </div>
              </Tooltip> */}
              {proposal.votesLoaded ? (
                <div
                  className={`rounded-full flex items-center justify-center text-xs h-fit py-0.5 border font-medium w-24 ${
                    getProposalStatus(proposal) === "SUCCEEDED"
                      ? "bg-green-200 border-green-600 text-green-600"
                      : getProposalStatus(proposal) === "DEFEATED" ||
                        getProposalStatus(proposal) === "CANCELLED"
                      ? "bg-red-200 border-red-500 text-red-500"
                      : getProposalStatus(proposal) === "QUEUED"
                      ? "bg-yellow-200 border-yellow-600 text-yellow-600"
                      : "bg-yellow-200 border-yellow-600 text-yellow-600"
                  }`}
                >
                  {getProposalStatus(proposal)}
                </div>
              ) : (
                <StatusLoader />
              )}

              {proposal.votesLoaded ? (
                <div
                  className={`py-0.5 rounded-md text-sm font-medium border flex justify-center items-center w-32 
               ${
                 canceledProposals?.some(
                   (item) => item.proposalId === proposal.proposalId
                 )
                   ? proposal.support1Weight! > proposal.support0Weight!
                     ? "text-[#639b55] border-[#639b55] bg-[#dbf8d4]" // Styles for proposals with more 'FOR' votes
                     : "bg-[#fa989a] text-[#e13b15] border-[#e13b15]"
                   : proposal.support1Weight! === 0 &&
                     proposal.support0Weight! === 0 &&
                     proposal.support2Weight! === 0
                   ? "bg-[#FFEDD5] border-[#F97316] text-[#F97316]" // Styles for proposals that haven't started
                   : proposal.support1Weight! > proposal.support0Weight!
                   ? "text-[#639b55] border-[#639b55] bg-[#dbf8d4]" // Styles for proposals with more 'FOR' votes
                   : "bg-[#fa989a] text-[#e13b15] border-[#e13b15]" // Styles for proposals with more 'AGAINST' votes
               }`}
                >
                  {canceledProposals?.some(
                    (item) => item.proposalId === proposal.proposalId
                  )
                    ? proposal.support1Weight! > proposal.support0Weight!
                      ? `${formatWeight(proposal.support1Weight!)} FOR`
                      : `${formatWeight(proposal.support0Weight!)} AGAINST`
                    : proposal.support1Weight! === 0 &&
                      proposal.support0Weight! === 0 &&
                      proposal.support2Weight! === 0
                    ? "Yet to start"
                    : proposal.support1Weight! > proposal.support0Weight!
                    ? `${formatWeight(proposal.support1Weight!)} FOR`
                    : `${formatWeight(proposal.support0Weight!)} AGAINST`}
                </div>
              ) : (
                <VoteLoader />
              )}
              <div className="flex items-center justify-center w-[15%]">
                <div className="rounded-full bg-[#f4d3f9] border border-[#77367a] flex text-[#77367a] text-xs h-fit py-0.5 font-medium px-2 ">
                  {(() => {
                    if (
                      canceledProposals.some(
                        (item) => item.proposalId === proposal.proposalId
                      )
                    ) {
                      return "Closed";
                    }

                    const currentTime: any = new Date();
                    const proposalTime: any = new Date(
                      proposal.blockTimestamp * 1000
                    );
                    const timeDifference = currentTime - proposalTime;
                    const daysDifference =
                      timeDifference / (24 * 60 * 60 * 1000);

                    if (props === "arbitrum") {
                      if (daysDifference <= 3) {
                        const daysLeft = Math.ceil(3 - daysDifference);
                        return `${daysLeft} day${
                          daysLeft !== 1 ? "s" : ""
                        } to go`;
                      } else if (daysDifference <= 17) {
                        return "Active";
                      } else {
                        return "Closed";
                      }
                    } else {
                      if (daysDifference <= 7) {
                        return "Active";
                      } else {
                        return "Closed";
                      }
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        ))}
        {displayedProposals?.length < cache[props]?.length && (
          <div className="flex items-center justify-center">
            <button
              onClick={loadMoreProposals}
              className="bg-blue-shade-100 text-white py-2 px-4 w-fit rounded-lg font-medium"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Proposals;
