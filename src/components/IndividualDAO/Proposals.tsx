"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from 'react';
import style from "./Proposals.module.css";
import Image from "next/image";
import opLogo from "@/assets/images/daos/op.png";
import { LuDot } from "react-icons/lu";
import user from "@/assets/images/daos/user1.png";
import chain from "@/assets/images/daos/chain.png";
import { Tooltip } from "@nextui-org/react";
// import { gql, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import {
  Provider,
  cacheExchange,
  createClient,
  fetchExchange,
  gql,
} from "urql";
const client = createClient({
  url: "https://api.studio.thegraph.com/query/68573/v6_proxy/version/latest",
  exchanges: [cacheExchange, fetchExchange],
});

const GET_CANCELED_PROPOSALS = gql`
  query GetCanceledProposals($first: Int!, $skip: Int!) {
    proposalCanceleds(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
      proposalId
      blockTimestamp
    }
  }
`
const GET_PROPOSALS = gql`
  query MyQuery {
    proposalCreated1S(orderDirection: desc, orderBy: blockTimestamp) {
      proposalId
      blockTimestamp
      description
      proposer      
    }
    proposalCreated2S(orderDirection: desc, orderBy: blockTimestamp) {
      proposalId
      blockTimestamp
      description
      proposer
    }
    proposalCreated3S(orderDirection: desc, orderBy: blockTimestamp) {
      proposalId
      blockTimestamp
      description
      proposer
    }
    proposalCreateds(orderDirection: desc, orderBy: blockTimestamp) {
      proposalId
      blockTimestamp
      description
      proposer
    }
  }
`;

const COMBINED_VOTE_QUERY = gql`
  query CombinedVoteQuery($proposalId: String!, $skip1: Int!, $skip2: Int!, $first: Int!) {
    voteCastWithParams: voteCastWithParams_collection(
      where: { proposalId: $proposalId }
      first: $first
      orderBy: blockTimestamp
      orderDirection: desc
      skip: $skip1
    ) {
      voter
      weight
      support
    }
    voteCasts(
      where: { proposalId: $proposalId }
      orderBy: blockTimestamp
      orderDirection: desc
      skip: $skip2
      first: $first
    ) {
      voter
      weight
      support
    }
  }
`;
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

interface VoteCast {
  voter: string;
  weight: string;
  support: number;
}
function Proposals({ props }: { props: string }) {
  const router = useRouter();
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [displayedProposals, setDisplayedProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const proposalsPerPage = 5;
  const [canceledProposals, setCanceledProposals] = useState<any[]>([]);

  const handleClick = (index: any) => {
    router.push(`/${props}/Proposals/${index}`);
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
  const fetchVotes = useCallback(async (proposal: Proposal): Promise<Proposal> => {
    if (proposal.votesLoaded) {
      return proposal;
    }

    let allVotes: VoteCast[] = [];
    let skip1 = 0;
    let skip2 = 0;
    const first = 1000; // Batch size

    try {
      while (true) {
        const { data } = await client.query(COMBINED_VOTE_QUERY, { proposalId: proposal.proposalId, skip1, skip2, first });

        const newVoteCastWithParams = data?.voteCastWithParams || [];
        const newVoteCasts = data?.voteCasts || [];

        if (newVoteCastWithParams.length === 0 && newVoteCasts.length === 0) {
          break;
        }

        allVotes = [...allVotes, ...newVoteCastWithParams, ...newVoteCasts];
        skip1 += newVoteCastWithParams.length;
        skip2 += newVoteCasts.length;
      }

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
  }, []);

  const fetchCanceledProposals = async () => {
    let allProposals: any[] = [];
    let skip = 0;
    let first = 100;
    let shouldContinue = true;

    while (shouldContinue) {
      try {
        const { data } = await client.query(GET_CANCELED_PROPOSALS, {
          first,
          skip,
        });

        const fetchedProposals = data.proposalCanceleds;

        if (fetchedProposals.length === 0) {
          shouldContinue = false;
        } else {
          allProposals = [...allProposals, ...fetchedProposals];
          skip += first;
        }
      } catch (err: any) {
        setError(err.message);
        shouldContinue = false;
      }
    }
    setCanceledProposals(allProposals);
    setLoading(false);
  };

  useEffect(() => {
    fetchCanceledProposals();
  }, []);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const result = await client.query(GET_PROPOSALS, {});
        const {
          proposalCreated1S,
          proposalCreated2S,
          proposalCreated3S,
          proposalCreateds,
        } = result.data;

        const proposals: Proposal[] = [
          ...proposalCreated1S,
          ...proposalCreated2S,
          ...proposalCreated3S,
          ...proposalCreateds,
        ].sort((a, b) => b.blockTimestamp - a.blockTimestamp);

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
  }, []);

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
  }, [displayedProposals, fetchVotes]);

  const loadMoreProposals = useCallback(() => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * proposalsPerPage;
    const endIndex = startIndex + proposalsPerPage;
    const newProposals = allProposals.slice(startIndex, endIndex);
    setDisplayedProposals(prevProposals => [...prevProposals, ...newProposals]);
    setCurrentPage(nextPage);
  }, [allProposals, currentPage, proposalsPerPage]);

  const truncateText = (text: any, wordLimit: any) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };
  const formatDate = (timestamp:any) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    let hours:any = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format and adjust midnight (0) to 12
    hours = String(hours).padStart(2, '0'); // Pad hours with leading zero if necessary
    return `${day} ${month}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };
  
  
  // const formattedDate = formatDate(proposal.blockTimestamp);

  if (loading && displayedProposals.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className=" mr-16 rounded-[2rem] mt-4">
        {displayedProposals.map((proposal: any, index: any) => (
          // <Link href={`/proposals/${index}`} key={index}>

          <div
            key={index}
            className="flex p-4 text-lg mb-2 gap-5 bg-gray-100 hover:bg-gray-50 rounded-3xl transition-shadow duration-300 ease-in-out shadow-lg cursor-pointer items-center"
            onClick={() => handleClick(index)}
          >
            <div className="flex basis-1/2">
              <Image src={opLogo} alt="" className="size-10 mx-5 " />
              <div>
                <p className="text-base font-medium">
                  {truncateText(proposal.description, 7)}
                </p>
                <div className="flex gap-1">
                  <Image src={user} alt="" className="size-4" />
                  <p className="flex text-xs font-normal items-center">
                    {" "}
                    {proposal.proposer} <LuDot />{formatDate(proposal.blockTimestamp)}
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
                  <Image src={chain} alt="" className="size-8 " />
                </div>
              </Tooltip>

              <div
                className={`rounded-full flex items-end justify-center text-xs h-fit py-0.5 font-medium px-2 ${canceledProposals.some((item) => item.proposalId === proposal.proposalId)
                    ? 'bg-red-200 border-red-500 text-red-500'
                    : proposal.support1Weight > proposal.support0Weight
                      ? 'bg-green-200 border-green-600 text-green-600'
                      : 'bg-red-200 border-red-500 text-red-500'
                  }`}
              >
                {canceledProposals.some((item) => item.proposalId === proposal.proposalId) ? (
                  'CANCELLED'
                ) : (
                  proposal.support1Weight > proposal.support0Weight ? 'SUCCEEDED' : 'DEFEATED'
                )}
              </div>
           

              <div className="bg-[#dbf8d4] border border-[#639b55] py-0.5 px-2 text-[#639b55] rounded-md text-sm font-medium flex justify-center items-center">
                {proposal.support1Weight > proposal.support0Weight ? `${formatWeight(proposal.support1Weight)} FOR` : `${formatWeight(proposal.support0Weight)} AGAINST`}
              </div>
          
              <div className="rounded-full bg-[#f4d3f9] border border-[#77367a] flex items-center justify-center text-[#77367a] text-xs h-fit  py-0.5 font-medium px-2">
                {new Date() > new Date(proposal.blockTimestamp * 1000 + 7 * 24 * 60 * 60 * 1000) ? 'closed' : 'active'}
              </div>
            </div>
          </div>
          // </Link>
        ))}

        {displayedProposals.length < allProposals.length && (
          <button onClick={loadMoreProposals}>Load More</button>
        )}
      </div>
    </>
  );
}

export default Proposals;
