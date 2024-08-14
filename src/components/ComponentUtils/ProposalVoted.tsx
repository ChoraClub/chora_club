import { cacheExchange, createClient, fetchExchange, gql } from "urql/core";
import React, { use, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pagination } from "@nextui-org/react";
import styles from "../IndividualDelegate/DelegateVotes.module.css";
import { Oval } from "react-loader-spinner";
import Image from "next/image";
import VotedOnOptions from "@/assets/images/votedOnOption.png";
import { Tooltip as NextUITooltip } from "@nextui-org/react";
import ProposalVotedLeftSkeletonLoader from "../SkeletonLoader/ProposalVotedLeftSkeletonLoader";
import ProposalVotedRightSkeletonLoader from "../SkeletonLoader/ProposalVotedRightSkeletonLoader";
import { useRouter } from "next/navigation";
Chart.register(ArcElement, Tooltip, Legend);

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

const op_client = createClient({
  url: "https://api.studio.thegraph.com/query/68573/v6_proxy/version/latest",
  exchanges: [cacheExchange, fetchExchange],
});

const arb_client = createClient({
  url: "https://api.studio.thegraph.com/query/68573/arbitrum_proposals/v0.0.4",
  exchanges: [cacheExchange, fetchExchange],
});

const arbDescription = gql`
query MyQuery($proposalId: String!) {
proposalCreateds(where: {proposalId:$proposalId} 
    orderBy: blockTimestamp
    orderDirection: desc) {
  description
}
}`

const VoterQuery = (first: any, skip: any) => gql`
  query MyQuery($address: String!) {
    voteCasts(
      where: { voter: $address}
      orderDirection: desc
      orderBy: blockTimestamp
      first: ${first}
      skip: ${skip}
    ) {
      proposalId
      reason
      support
      weight
      transactionHash
      blockTimestamp
    }
  
    voteCastWithParams_collection(
      where: {voter: $address}
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      proposalId
      reason
      support
      weight
      transactionHash
      blockTimestamp
      params
    }
  }
  `;
const opDescription = gql`
  query MyDescriptionQuery($proposalId: String!) {
    proposalCreated1S(where: { proposalId: $proposalId }) {
      description
    }
    proposalCreated2S(where: { proposalId: $proposalId }) {
      description
    }
    proposalCreated3S(where: { proposalId: $proposalId }) {
      description
    }
    proposalCreateds(where: { proposalId: $proposalId }) {
      description
    }
  }
`;

const arbQuery = gql`
  query Votes($address: String!) {
    votes(
      orderBy: timestamp
      orderDirection: desc
      where: { user: $address, organization: "arbitrum.eth" }
    ) {
      id
      proposal {
        id
        description
        timestamp
      }
      organization {
        id
      }
      solution
      timestamp
      support
    }
  }
`;

export const fetchProposalDescriptions = async (
  first: any,
  skip: any,
  daoName: any,
  address: any
) => {
  let proposalIdsResult: any;
  if (daoName === "optimism") {
     proposalIdsResult= await op_client.query(VoterQuery(first, skip), {
      address: address,
    });
}
    else if (daoName === "arbitrum") {
      proposalIdsResult= await arb_client.query(VoterQuery(first, skip), {
        address: address,
      });

    }

    const voteCasts = proposalIdsResult.data.voteCasts || [];
    const voteCastWithParamsCollection =
      proposalIdsResult.data.voteCastWithParams_collection || [];

    // Combine the data
    const combinedData = [...voteCasts, ...voteCastWithParamsCollection];

    // Sort combined data by blockTimestamp in descending order
    combinedData.sort((a: any, b: any) => b.blockTimestamp - a.blockTimestamp);
   
    const proposalIds = combinedData.map((voteCast: any) => voteCast);

let descriptionsPromises;
let descriptionsResults:any;
if(daoName === "optimism"){
     descriptionsPromises = proposalIds.map((proposalId: any) => {
      
      return op_client
        .query(opDescription, { proposalId: proposalId.proposalId.toString() })
        .toPromise();
    });
    descriptionsResults = await Promise.all(descriptionsPromises) || [];

  }else if(daoName === "arbitrum"){
    descriptionsPromises = proposalIds.map((proposalId: any) => {
    
      return arb_client
        .query(arbDescription, { proposalId: proposalId.proposalId.toString() })
        .toPromise();
    });
    descriptionsResults = await Promise.all(descriptionsPromises) || [];
  }
  
    const FinalResult = descriptionsResults
      .flatMap((result:any, index:any) =>
        Object.values(result.data)
          .flat()
          .filter((d: any) => d.description)
          .map((d: any) => ({
            proposalId: proposalIds[index],
            proposal: { description: d.description },
            support: proposalIds[index].support,
          }))
      )
      .filter((item:any) => item.proposal.description.length > 0);

    return FinalResult;

};

export const fetchGraphData = async (daoName: any, pageData: any) => {
  if (daoName == "optimism") {
    const op_counts = pageData.reduce(
      (acc: any, curr: any) => {
        const support =
          curr.proposalId.params && curr.proposalId.params.length > 2
            ? 1
            : curr.support;
        acc[support] = (acc[support] || 0) + 1;
        return acc;
      },
      { 0: 0, 1: 0, 2: 0 }
    );

    return op_counts;
    // setFirst(true);
  } else if (daoName == "arbitrum") {
    const arb_counts = pageData.reduce(
      (acc: any, curr: any) => {
        const support = curr.support;
        acc[support] = (acc[support] || 0) + 1;
        return acc;
      },
      { 0: 0, 1: 0, 2: 0 }
    );

    return arb_counts;
  } else {
    return { 0: 0, 1: 0, 2: 0 };
  }
};
export function formatNumber(num: any) {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B"; // Billion
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M"; // Million
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "k"; // Thousand
  } else {
    return num.toFixed(1); // Less than a thousand
  }
}

function ProposalVoted({ daoName, address }: any) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataToShow, setDataToShow] = useState<any>([]);
  const [first, setFirst] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<any>([]);
  const [pageData, setPageData] = useState<any>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [openDesc, setOpenDesc] = useState<boolean[]>([]);
  const [supportCounts, setSupportCounts] = useState({ 0: 0, 1: 0, 2: 0 });
const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalResult = await fetchProposalDescriptions(
          1000,
          0,
          daoName,
          address
        );

        setPageData(finalResult);
        setGraphData(finalResult);
        setIsPageLoading(false);
        setFirst(true);
      } catch (error) {
        console.error("Error fetching proposal descriptions:", error);
      }
    };

    fetchData();
  }, [daoName]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const counts = await fetchGraphData(daoName, pageData);
        setSupportCounts(counts);
      } catch (error) {
        console.error("Error fetching proposal descriptions:", error);
      }
    };

    fetchData();
  }, [pageData]);

  const totalData: number = graphData.length;
  const dataPerPage: number = 5;
  const totalPages: number = Math.ceil(totalData / dataPerPage);

  useEffect(() => {
    const fetchPageData = async () => {
      const offset = (currentPage - 1) * dataPerPage;
      const end = offset + dataPerPage;
      const initialData = await graphData.slice(offset, end);
      setDataToShow(initialData);
      setIsPageLoading(false);
    };
    if (first) {
      fetchPageData();
    }
    setOpenDesc(new Array(pageData.length).fill(false));
  }, [currentPage, graphData]);

  const chartData = {
    labels: [
      `For: ${supportCounts[1]} votes`,
      `Against: ${supportCounts[0]} votes`,
      `Abstain: ${supportCounts[2]} votes`,
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [supportCounts[1], supportCounts[0], supportCounts[2]],
        backgroundColor: ["#0033A8", "#6B98FF", "#004DFF"],
        borderWidth: 1,
      },
    ],
  };

  const filterDescription = (description:any) => {
    return description.replace(/#/g, '').trim();
  };

  return (
    <>
      <div className="grid grid-cols-5 pe-5 gap-4 pb-6">
        <div
          style={{ boxShadow: "0px 4px 15.1px 0px rgba(0, 0, 0, 0.17)" }}
          className="col-span-2 space-y-4 p-10 rounded-xl"
        >
          {isPageLoading ? (
            <ProposalVotedLeftSkeletonLoader />
          ) : first && !isPageLoading && pageData.length > 0 ? (
            <Doughnut
              data={chartData}
              width={700}
              height={350}
              options={{
                maintainAspectRatio: false,
              }}
            />
          ) : (
            <div className="flex text-center font-semibold h-full">
              Delegate has not submitted any on chain votes!
            </div>
          )}
        </div>
        <div
          style={{ boxShadow: "0px 4px 11.8px 0px rgba(0, 0, 0, 0.21)" }}
          className="min-h-10 rounded-xl col-span-3 p-7"
        >
          <div className="font-semibold text-blue-shade-200 text-2xl py-2 ">
            Voted Proposals
          </div>

          <div className={`h-[23rem] overflow-y-auto ${styles.scrollbar}`}>
            {isPageLoading ? (
              <ProposalVotedRightSkeletonLoader />
            ) : first && !isPageLoading && pageData.length > 0 ? (
              dataToShow.map((proposal: any, index: number) => (
                <div
                  key={index}
                  className={`flex justify-between border border-[#7C7C7C] text-sm px-3 py-2 rounded-lg items-center my-3 `}
                >
                  <div className="w-3/4 break-words">
                    <div className={`${openDesc[index] ? "" : styles.desc}`}>
                      {filterDescription(proposal.proposal.description)}
                    </div>
                    <span
                      className="text-xs text-blue-shade-100 underline cursor-pointer"
                      onClick={() => {
                        router.push(`/${daoName}/proposals/${proposal.proposalId.proposalId}`);
                      }}
                    >
                      view
                    </span>
                  </div>
                  <div
                    className={`text-white rounded-full px-3 py-[2px] w-[70px] me-1 text-center flex justify-center align-center ${
                      proposal.proposalId &&
                      proposal.proposalId.params &&
                      proposal.proposalId.params.length > 2
                        ? "" 
                        : proposal.support === 1
                        ? "bg-[#0033A8]"
                        : proposal.support === 0
                        ? "bg-[#6B98FF]"
                        : "bg-[#004DFF]"
                    }`}
                  >
                    <NextUITooltip
                      content="Voted on options"
                      isDisabled={
                        !(
                          proposal.proposalId &&
                          proposal.proposalId.params &&
                          proposal.proposalId.params.length > 2
                        )
                      }
                    >
                      {proposal.proposalId &&
                      proposal.proposalId.params &&
                      proposal.proposalId.params.length > 2 ? (
                        <Image
                          className="flex justify-center items-center"
                          src={VotedOnOptions}
                          alt="Voted on options"
                        />
                      ) : proposal.support === 1 ? (
                        "For"
                      ) : proposal.support === 0 ? (
                        "Against"
                      ) : (
                        "Abstain"
                      )}
                    </NextUITooltip>
                  </div>
                  <NextUITooltip content="Votes">
                    { proposal.proposalId && (
                      <div className="text-white rounded-full px-3 py-[2px] bg-[#FF0000]">
                        {formatNumber(proposal.proposalId.weight / 1e18)}
                      </div>
                    )}
                  </NextUITooltip>
                  { proposal.proposalId && (
                    <div className="px-3 py-[2px] text-xl">
                      <a
                        href={daoName==="optimism"?`https://optimistic.etherscan.io/tx/${proposal.proposalId.transactionHash}`:`https://arbiscan.io/tx/${proposal.proposalId.transactionHash}`}
                        target="_blank"
                        className="cursor-pointer"
                      >
                        ↗
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="pt-10 flex items-center flex-col justify-center">
                <div className="text-5xl">☹️</div>
                <div className="pt-4 font-semibold text-lg">
                Oops, no data available!
                </div>
              </div>
            )}
          </div>

          {isPageLoading ? (
            ""
          ) : (
            <div
              className={`pt-4 flex items-end bottom-0 justify-center ${
                graphData.length == 0 ? "hidden" : ""
              }`}
            >
              <Pagination
                color="primary"
                total={totalPages}
                initialPage={1}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProposalVoted;
