import React, { useEffect, useState, useCallback } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tooltip } from "@nextui-org/react";
import { LuDot } from "react-icons/lu";
import opLogo from "@/assets/images/daos/op.png";
import user from "@/assets/images/daos/user1.png";
import chain from "@/assets/images/daos/chain.png";
import ProposalsSkeletonLoader from "../SkeletonLoader/ProposalsSkeletonLoader";
import ArbLogo from "@/assets/images/daos/arbCir.png";


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
}

function Proposals({ props }: { props: string }) {
  const router = useRouter();
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [displayedProposals, setDisplayedProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [canceledProposals, setCanceledProposals] = useState<any[]>([]);
  const proposalsPerPage = 5;

  const VoteLoader = () => (
    <div className=" flex justify-center items-center ">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-shade-900"></div>
          </div>
  );
  const StatusLoader = () => (
    <div className="flex items-end justify-center ">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-shade-900"></div>
          </div>
  );
  

  // const StatusLoader = () => (
  //   <div className="rounded-full flex items-end justify-center text-xs py-1 border font-medium w-24 bg-red-200 border-red-500">
  //     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-shade-900"></div>
  //   </div>
  // );

  const handleClick = (proposal: Proposal) => {
    router.push(`/${props}/Proposals/${proposal.proposalId}`);
  };

  const weiToEther = (wei: string): number => {
    return Number(wei) / 1e18;
  };

  const formatWeight = (weight: number): string => {
    if (weight >= 1e9) {
      return (weight / 1e9).toFixed(2) + 'B';
    } else if (weight >= 1e6) {
      return (weight / 1e6).toFixed(2) + 'M';
    } else if (weight >= 1e3) {
      return (weight / 1e3).toFixed(2) + 'K';
    } else {
      return weight?.toFixed(2);
    }
  };
  useEffect(() => {
    const fetchCanacelledProposals = async () => {
      const response = await fetch(`/api/get-canceledproposal`);
      const result = await response.json();
      console.log("result", result)
      console.log("result?.data", result[0].proposalId)
      setCanceledProposals(result);
    }
    fetchCanacelledProposals();
  }, [])

  const fetchVotes = useCallback(async (proposal: Proposal): Promise<Proposal> => {
    if (proposal.votesLoaded || props === "arbitrum") {
      return proposal;
    }

    try {
      const response = await fetch(`/api/get-voters?proposalId=${proposal.proposalId}&skip1=0&skip2=0&first=1000`);
      const data = await response.json();
      const allVotes = [...(data?.voteCastWithParams || []), ...(data?.voteCasts || [])];

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
  }, [props]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        let response;
        if (props === "optimism") {
          response = await fetch('/api/get-proposals');
        } else {
          response = await fetch('/api/get-arbitrumproposals');
        }
        const responseData = await response.json();
console.log("responseData of arb", responseData.porposalV2)
        let proposals: Proposal[];
        if (props === "optimism") {
          const {
            proposalCreated1S,
            proposalCreated2S,
            proposalCreated3S,
            proposalCreateds,
          } = responseData.data;

          proposals = [
            ...proposalCreated1S,
            ...proposalCreated2S,
            ...proposalCreated3S,
            ...proposalCreateds,
          ].map((p: any) => ({
            ...p,
            votesLoaded: false,
          }));
        } else {
          proposals = responseData.proposalsV2.nodes.map((node: any) => ({
            blockTimestamp: new Date(node.block.timestamp).getTime() / 1000,
            description: node.metadata.description,
            proposalId: node.id,
            proposer: node.governor.id.split(':').pop() || '',
            support0Weight: (node.voteStats.find((v: any) => v.type === "against")?.votesCount)/10**18 || 0,
            support1Weight: (node.voteStats.find((v: any) => v.type === "for")?.votesCount)/10**18 || 0,
            support2Weight: (node.voteStats.find((v: any) => v.type === "abstain")?.votesCount)/10**18 || 0,
            votersCount: node.voteStats.reduce((acc: number, v: any) => acc + v.votersCount, 0),
            votesLoaded: true,
            status: node.status,
          }));
        }

        proposals.sort((a, b) => b.blockTimestamp - a.blockTimestamp);
        setAllProposals(proposals);
        setDisplayedProposals(proposals.slice(0, proposalsPerPage));
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [props]);

  useEffect(() => {
    const fetchVotesForDisplayedProposals = async () => {
      if (props === "arbitrum") return; // Skip for Arbitrum as votes are already loaded
      
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
        setDisplayedProposals(updatedProposals);
      } catch (error: any) {
        console.error("Error fetching votes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (displayedProposals.some(proposal => !proposal.votesLoaded)) {
      fetchVotesForDisplayedProposals();
    }
  }, [displayedProposals, fetchVotes, props]);

  const loadMoreProposals = useCallback(() => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * proposalsPerPage;
    const endIndex = startIndex + proposalsPerPage;
    const newProposals = allProposals.slice(startIndex, endIndex);
    setDisplayedProposals(prevProposals => [...prevProposals, ...newProposals]);
    setCurrentPage(nextPage);
  }, [allProposals, currentPage, proposalsPerPage]);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    let hours: number | string = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');
    return `${day} ${month}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  if (loading && displayedProposals.length === 0) return <ProposalsSkeletonLoader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="mr-16 rounded-[2rem] mt-4">
        {displayedProposals.map((proposal: Proposal, index: number) => (
          <div
            key={index}
            className="flex p-4 text-lg mb-2 gap-5 bg-gray-100 hover:bg-gray-50 rounded-3xl transition-shadow duration-300 ease-in-out shadow-lg cursor-pointer items-center"
            onClick={() => handleClick(proposal)}
          >
            <div className="flex basis-1/2">
              <Image src={props === "optimism" ? opLogo:ArbLogo} alt="" className="size-10 mx-5" />
              <div>
                <p className="text-base font-medium">
                  {truncateText(proposal.description || '', 7)}
                </p>
                <div className="flex gap-1">
                  {/* <Image src={user} alt="" className="size-4" /> */}
                  <p className="flex text-xs font-normal items-center">
                    Started at {formatDate(proposal.blockTimestamp)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-around items-center basis-1/2">
              <Tooltip
                showArrow
                content={<div className="font-poppins">OnChain</div>}
                placement="bottom"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                <div>
                  <Image src={chain} alt="" className="size-8" />
                </div>
              </Tooltip>
              {proposal.votesLoaded ? (
                <div
                  className={`rounded-full flex items-end justify-center text-xs h-fit py-0.5 border font-medium w-24 ${
                    props === "optimism" && canceledProposals.some((item) => item.proposalId === proposal.proposalId)
                      ? 'bg-red-200 border-red-500 text-red-500'
                      : props === "arbitrum"
                      ? proposal.status === "executed" || proposal.status === "succeeded"
                        ? 'bg-green-200 border-green-600 text-green-600'
                        : 'bg-red-200 border-red-500 text-red-500'
                      : proposal.support1Weight! > proposal.support0Weight!
                      ? 'bg-green-200 border-green-600 text-green-600'
                      : 'bg-red-200 border-red-500 text-red-500'
                  }`}
                >
                  {props === "optimism" && canceledProposals.some((item) => item.proposalId === proposal.proposalId)
                    ? 'CANCELLED'
                    : props === "arbitrum"
                    ? proposal.status?.toUpperCase()
                    : proposal.support1Weight! > proposal.support0Weight!
                    ? 'SUCCEEDED'
                    : 'DEFEATED'}
                </div>
              ) : (
                <StatusLoader />
              )}

              {proposal.votesLoaded ? (
                <div className={`bg-[#dbf8d4] border border-[#639b55] py-0.5 rounded-md text-sm font-medium flex justify-center items-center w-32 ${
                  props === "arbitrum"
                    ? proposal.status === "executed" || proposal.status === "succeeded"
                      ? 'text-[#639b55] border-[#639b55] bg-[#dbf8d4]'
                      : 'bg-[#fa989a] text-[#e13b15] border-[#e13b15]'
                    : proposal.support1Weight! > proposal.support0Weight!
                    ? 'text-[#639b55] border-[#639b55] bg-[#dbf8d4]'
                    : 'bg-[#fa989a] text-[#e13b15] border-[#e13b15]'
                }`}>
                  {props === "arbitrum"
                    ? `${formatWeight(Number(proposal.support1Weight))} FOR`
                    : proposal.support1Weight! > proposal.support0Weight!
                    ? `${formatWeight(proposal.support1Weight!)} FOR`
                    : `${formatWeight(proposal.support0Weight!)} AGAINST`}
                </div>
              ) : (
                <VoteLoader />
              )}

              <div className="rounded-full bg-[#f4d3f9] border border-[#77367a] flex items-center justify-center text-[#77367a] text-xs h-fit py-0.5 font-medium px-2">
                {new Date() > new Date(proposal.blockTimestamp * 1000 + 7 * 24 * 60 * 60 * 1000) ? 'Closed' : 'Active'}
              </div>
            </div>
          </div>
        ))}

        {displayedProposals.length < allProposals.length && (
          <div className="flex items-center justify-center">
            <button onClick={loadMoreProposals} className="bg-blue-shade-100 text-white py-2 px-4 w-fit rounded-lg font-medium">View More</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Proposals;