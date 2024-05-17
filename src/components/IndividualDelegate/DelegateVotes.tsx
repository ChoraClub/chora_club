import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pagination } from "@nextui-org/react";
import styles from "./DelegateVotes.module.css";
import { cacheExchange, createClient, fetchExchange, gql } from "urql/core";
import { Oval } from "react-loader-spinner";
import { count } from "console";

Chart.register(ArcElement, Tooltip, Legend);

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function DelegateVotes({ props }: { props: Type }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<any>([]);
  const [pageData, setPageData] = useState<any>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [openDesc, setOpenDesc] = useState<boolean[]>([]);
  const [supportCounts, setSupportCounts] = useState({ 0: 0, 1: 0, 2: 0 });

  const [clientURL, setClientURL] = useState<string>("");
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions: RequestInit = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          `/api/get-dao-details/${props.daoDelegates}`,
          requestOptions
        );
        const result = await response.json();

        // console.log(
        //   "dao-details",
        //   result.data[0].api_links.subgraph.past_votes
        // );
        setClientURL(result.data[0].api_links.subgraph.past_votes);
        setIsPageLoading(false);
      } catch (error) {
        console.error(error);
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [props.daoDelegates, props.individualDelegate]);

  useEffect(() => {
    if (clientURL) {
      const newClient = createClient({
        url: clientURL,
        exchanges: [cacheExchange, fetchExchange],
      });
      setClient(newClient);
    }
  }, [clientURL]);

  useEffect(() => {
    const fetchGraphData = async () => {
      if (client && props.daoDelegates) {
        try {
          setIsPageLoading(true);
          const query = gql`
            query Votes($address: String!) {
              votes(
                orderBy: timestamp
                orderDirection: desc
                where: { user: $address, organization: "${props.daoDelegates}.eth" }
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
            address: props.individualDelegate,
          });
          console.log("Urql: ", gqdata.data.votes);
          setGraphData(gqdata.data.votes);

          const op_counts = gqdata.data.votes.reduce(
            (acc: any, curr: any) => {
              const support = curr.support;
              acc[support] = (acc[support] || 0) + 1;
              return acc;
            },
            { 0: 0, 1: 0, 2: 0 }
          );
          setSupportCounts(op_counts);
          setFirst(true);
          setIsPageLoading(false);
        } catch (error) {
          console.error(error);
          setIsPageLoading(false);
        }
      } else {
        setGraphData([]);
        setFirst(false);
      }
    };

    fetchGraphData();
  }, [client, props.daoDelegates, props.individualDelegate]);

  const totalData: number = graphData.length;
  const dataPerPage: number = 5;
  const totalPages: number = Math.ceil(totalData / dataPerPage);

  useEffect(() => {
    const fetchPageData = async () => {
      const offset = (currentPage - 1) * dataPerPage;
      const end = offset + dataPerPage;
      const initialData = await graphData.slice(offset, end);
      // console.log("initial data: ", initialData);
      setPageData(initialData);
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
    labels: ["For", "Against", "Other"],
    datasets: [
      {
        label: "# of Votes",
        data: [supportCounts[1], supportCounts[0], supportCounts[2]],
        backgroundColor: ["#0033A8", "#6B98FF", "#004DFF"],
        borderWidth: 1,
      },
    ],
  };

  // console.log("Graph data: ", graphData);

  return (
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
            Delegate has not submitted any on chain votes!
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
            pageData.map((proposal: any, index: number) => (
              <div
                key={index}
                className={`flex justify-between border border-[#7C7C7C] text-sm px-3 py-2 rounded-lg items-center my-3 `}
              >
                <div className="w-4/5 break-words">
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
                  className={`text-white rounded-full px-3 py-[2px] ${
                    proposal.support === 1
                      ? "bg-[#0033A8]"
                      : proposal.support === 0
                      ? "bg-[#6B98FF]"
                      : "bg-[#004DFF]"
                  }`}
                >
                  {proposal.support === 1
                    ? "For"
                    : proposal.support === 0
                    ? "Against"
                    : "Other"}
                </div>
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
  );
}

export default DelegateVotes;
