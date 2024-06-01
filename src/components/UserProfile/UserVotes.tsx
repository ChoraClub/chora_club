import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pagination } from "@nextui-org/react";
import { cacheExchange, createClient, fetchExchange, gql } from "urql/core";
import styles from "../IndividualDelegate/DelegateVotes.module.css";
import { Oval } from "react-loader-spinner";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import VotedOnOptions from "@/assets/images/votedOnOption.png";
import Image from "next/image";
import { Tooltip as NextUITooltip } from "@nextui-org/react";
Chart.register(ArcElement, Tooltip, Legend);

function UserVotes({ daoName }: { daoName: string }) {
  const { address } = useAccount(); 
  const { chain, chains } = useNetwork();
  const [first, setFirst] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [graphData, setGraphData] = useState<any>([]);
  const [pageData, setPageData] = useState<any>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [openDesc, setOpenDesc] = useState<boolean[]>([]);
  const [supportCounts, setSupportCounts] = useState({ 0: 0, 1: 0, 2: 0 });
  const [clientURL, setClientURL] = useState<string>("");
  const [client, setClient] = useState<any>(null);
  const [dataToShow, setDataToShow] = useState<any>([]);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (daoName === "arbitrum") {
          setIsPageLoading(true);
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
          };

          const response = await fetch(
            `/api/get-dao-details/arbitrum`,
            requestOptions
          );
          const result = await response.json();

          console.log(
            "dao-details",
            result.data[0].api_links.subgraph.past_votes
          );
          setClientURL(result.data[0].api_links.subgraph.past_votes);
        
          setIsPageLoading(false);
        }
      } catch (error) {
        console.error(error);
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [daoName]);

  useEffect(() => {
    if (clientURL) {
      const newClient = createClient({
        url: clientURL,
        exchanges: [cacheExchange, fetchExchange],
      });
      setClient(newClient);
    }
  }, [clientURL]);

  const op_client = createClient({
    url: "https://api.studio.thegraph.com/query/68573/v6_proxy/version/latest",
    exchanges: [cacheExchange, fetchExchange],
  });


  const opQuery = (first: any, skip: any) => gql`
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

  const fetchProposalDescriptions = async (first = 100, skip = 0) => {
    if (daoName === "optimism") {
      const proposalIdsResult: any = await op_client.query(opQuery(first, skip), { address: address });
      // console.log("result", proposalIdsResult);

      const voteCasts = proposalIdsResult.data.voteCasts || [];
      const voteCastWithParamsCollection = proposalIdsResult.data.voteCastWithParams_collection || [];

      // Combine the data
      const combinedData = [...voteCasts, ...voteCastWithParamsCollection];

      // Sort combined data by blockTimestamp in descending order
      combinedData.sort((a: any, b: any) => b.blockTimestamp - a.blockTimestamp);
      // console.log(combinedData)
      const proposalIds = combinedData.map((voteCast: any) => voteCast);


      // console.log("Id", proposalIds);

      const descriptionsPromises = proposalIds.map((proposalId: any) => {
        // console.log("proposalId...", proposalId);
        return op_client.query(opDescription, { proposalId: proposalId.proposalId.toString() }).toPromise();
      });

      // console.log("descriptionsPromises", descriptionsPromises);

      const descriptionsResults = await Promise.all(descriptionsPromises);
      // console.log("descriptionsResults", descriptionsResults);
      const FinalResult = descriptionsResults
        .flatMap((result: any, index: any) =>
          Object.values(result.data)
            .flat()
            .filter((d: any) => d.description)
            .map((d: any) => ({
              proposalId: proposalIds[index],
              proposal: { description: d.description, },
              support: proposalIds[index].support
            }))
        )
        .filter((item: any) => item.proposal.description.length > 0);

      // console.log("FinalResult", FinalResult);
      setPageData(FinalResult);
      setIsPageLoading(false);
      setGraphData(FinalResult);
      setFirst(true);

      // return FinalResult;
    }
  };
  useEffect(() => {
    fetchProposalDescriptions();
  }, [daoName]);
  ;


  useEffect(() => {
    const fetchGraphDataAr = async () => {
      if (client && daoName === "arbitrum") {
        try {
          setIsPageLoading(true);
          const query = gql`
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

          const gqdata: any = await client.query(query, {
            address: address,
          });
          // console.log("url",clientURL)
          // console.log("Urql: ", gqdata.data.votes);
          const fetchedVotes = gqdata.data.votes;
          setGraphData(fetchedVotes);
          setPageData(fetchedVotes);
          // console.log("Graph Data: ", graphData);
         
          // console.log("Page Data: ", pageData);
          setFirst(true);
          setIsPageLoading(false);
        } catch (error) {
          console.error(error);
          setIsPageLoading(false);
        }
      }
    };

    fetchGraphDataAr();
  }, [client, daoName, address]);

  
  useEffect(() => {

    const fetchGraphData = async () => {
      // if (daoName == "optimism") {
        const op_counts = pageData.reduce(
          (acc: any, curr: any) => {
            // console.log("curr", curr.proposalId.params.length)
            const support = (curr.proposalId && curr.proposalId.params && curr.proposalId.params.length > 2) ? 1 : curr.support;
            // console.log(support)
            acc[support] = (acc[support] || 0) + 1;
            return acc;
          },
          { 0: 0, 1: 0, 2: 0, 3: 0 }
        );
        // console.log("op_counts", op_counts)
        // console.log("pageData", pageData)
        // setGraphData(pageData);
        setSupportCounts(op_counts);
        // setFirst(true);
      // } else {

      //   // setGraphData([]);
      //   setFirst(false);
      // }
    };

    fetchGraphData();
  }, [pageData]);

  const totalData: number = graphData.length;
  const dataPerPage: number = 5;
  const totalPages: number = Math.ceil(totalData / dataPerPage);

  useEffect(() => {
    const fetchPageData = async () => {

      const offset = (currentPage - 1) * dataPerPage;
      const end = offset + dataPerPage;
      const initialData = await graphData.slice(offset, end);
      // console.log("initial data: ", initialData);
      setDataToShow(initialData);
      console.log("data to show: ", dataToShow);
      // if (initialData) {
      setIsPageLoading(false);
      // }
    };
    if (first) {
      fetchPageData();
    }
    setOpenDesc(new Array(pageData.length).fill(false));
  }, [currentPage, graphData]);

  const chartData = {
    labels: [`For: ${supportCounts[1]} votes`, `Against: ${supportCounts[0]} votes`, `Absatin: ${supportCounts[2]} votes`],
    datasets: [
      {
        label: "# of Votes",
        data: [supportCounts[1], supportCounts[0], supportCounts[2]],
        backgroundColor: ["#0033A8", "#6B98FF", "#004DFF"],
        borderWidth: 1,
      },
    ],
  };
  function formatNumber(num: any) {

    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B'; // Billion
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M'; // Million
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'k'; // Thousand
    } else {
      return num.toFixed(1); // Less than a thousand
    }
  }
  return (
    <div className="pt-4">
      <div className="grid grid-cols-5 pe-5 gap-4 pb-6">
        <div
          style={{ boxShadow: "0px 4px 15.1px 0px rgba(0, 0, 0, 0.17)" }}
          className="col-span-2 space-y-4 p-10 rounded-xl"
        >
          {isPageLoading ? (
            <div className="flex pt-6 justify-center">
              <Oval
                visible={true}
                height="40"
                width="40"
                color="#0500FF"
                secondaryColor="#cdccff"
                ariaLabel="oval-loading"
              />
            </div>
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
              Sorry, you have not submitted any on chain votes!
            </div>
          )}
        </div>
        <div
          style={{ boxShadow: "0px 4px 11.8px 0px rgba(0, 0, 0, 0.21)" }}
          className="min-h-10 rounded-xl col-span-3 p-7"
        >
          <div className="font-semibold text-blue-shade-200 text-2xl py-2 ">
            List of Proposals
          </div>

          <div className={`h-[23rem] overflow-y-auto ${styles.scrollbar}`}>
            {isPageLoading ? (
              <div className="flex pt-6 justify-center">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="#0500FF"
                  secondaryColor="#cdccff"
                  ariaLabel="oval-loading"
                />
              </div>
            ) : first && !isPageLoading && pageData.length > 0 ? (
              dataToShow.map((proposal: any, index: number) => (
                <div
                  key={index}
                  className={`flex justify-between border border-[#7C7C7C] text-sm px-3 py-2 rounded-lg items-center my-3 `}
                >
                  <div className="w-3/4 break-words">
                    <div className={`${openDesc[index] ? "" : styles.desc}`}>
                      {proposal.proposal.description}
                    </div>
                    <span
                      className="text-xs text-blue-shade-100 underline cursor-pointer"
                      onClick={() => {
                        const newOpenDesc = [...openDesc];
                        newOpenDesc[index] = !newOpenDesc[index];
                        setOpenDesc(newOpenDesc);
                      }}
                    >
                      {openDesc[index] ? "Close" : "View"}
                    </span>
                  </div>
                  <div
                    className={`text-white rounded-full px-2 py-[2px] w-[70px] me-1 text-center flex justify-center align-center
                    ${daoName ==="optimism" && proposal.proposalId && proposal.proposalId.params && proposal.proposalId.params.length > 2
                        ? "" // You can use a different background color for this condition
                        : 
                        proposal.support === 1
                          ? "bg-[#0033A8]"
                          : proposal.support === 0
                            ? "bg-[#6B98FF]"
                            : "bg-[#004DFF]"
                      }`}
                  >
                    <NextUITooltip
                      content="Voted on options"
                      isDisabled={!(proposal.proposalId && proposal.proposalId.params && proposal.proposalId.params.length > 2)}
                    >
                      {
                       proposal.proposalId&& proposal.proposalId.params && proposal.proposalId.params.length > 2
                          ? <Image className="flex justify-center items-center" src={VotedOnOptions} alt="Voted on options" />
                          : proposal.support === 1
                            ? "For"
                            : proposal.support === 0
                              ? "Against"
                              : "Abstain"
                      }
                    </NextUITooltip>
                  </div>
                  <NextUITooltip content="Votes">
                    {daoName === "optimism" && proposal.proposalId && (
                      <div className="text-white rounded-full px-3 py-[2px] bg-[#FF0000]">
                        {formatNumber(proposal.proposalId.weight / 1e18)}
                      </div>
                    )}
                  </NextUITooltip>

                  {daoName === "optimism"&& proposal.proposalId && (
                    <div className="px-3 py-[2px] text-xl">
                      <a
                        href={`https://optimistic.etherscan.io/tx/${proposal.proposalId.transactionHash}`}
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
              <div className="pt-4 flex items-center flex-col justify-center">
                <div className="text-3xl">☹️</div>
                <div>Oops, no data available</div>
              </div>
            )}
          </div>

          {isPageLoading ? (
            ""
          ) : (
            <div
              className={`pt-4 flex items-end bottom-0 justify-center ${graphData.length == 0 ? "hidden" : ""
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
    </div>
  );
}

export default UserVotes;
