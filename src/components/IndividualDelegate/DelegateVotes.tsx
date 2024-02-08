import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pagination } from "@nextui-org/react";
import styles from "./DelegateVotes.module.css";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client";
import { Oval } from "react-loader-spinner";
import { count } from "console";

Chart.register(ArcElement, Tooltip, Legend);

function DelegateVotes({ props }: { props: string }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [graphData, setGraphData] = useState<any>([]);
  const [pageData, setPageData] = useState<any>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [openDesc, setOpenDesc] = useState<boolean[]>([]);
  const [supportCounts, setSupportCounts] = useState({ 0: 0, 1: 0, 2: 0 });

  const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/show-karma/dao-onchain-voting-optimism",
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    const fetchGraphData = async () => {
      const gqdata = await client.query({
        query: gql`
          query Votes($address: String!) {
            votes(
              orderBy: timestamp
              orderDirection: desc
              where: { user: $address, organization: "optimism.eth" }
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
        `,
        variables: { address: props },
      });
      console.log("use graphql: ", gqdata);
      setGraphData(gqdata.data.votes);

      const counts = gqdata.data.votes.reduce(
        (acc: any, curr: any) => {
          const support = curr.support;
          acc[support] = (acc[support] || 0) + 1;
          return acc;
        },
        { 0: 0, 1: 0, 2: 0 }
      );
      console.log("Counts: ", counts);

      setSupportCounts(counts);
    };
    fetchGraphData();
  }, [props]);

  const totalData: number = graphData.length;
  const dataPerPage: number = 5;
  const totalPages: number = Math.ceil(totalData / dataPerPage);

  useEffect(() => {
    const fetchPageData = async () => {
      const offset = (currentPage - 1) * dataPerPage;
      const end = offset + dataPerPage;
      const initialData = await graphData.slice(offset, end);
      console.log("initial data: ", initialData);
      setPageData(initialData);
    };
    fetchPageData();
    setIsPageLoading(false);
  }, [currentPage, graphData]);


  const chartData = {
    labels: ["For", "Against", "Abstain"],
    datasets: [
      {
        label: "# of Votes",
        data: [supportCounts[0], supportCounts[1], supportCounts[2]],
        backgroundColor: ["#0033A8", "#6B98FF", "#004DFF"],
        borderWidth: 1,
      },
    ],
  };

  console.log("Graph data: ", graphData);

  return (
    <div className="grid grid-cols-5 pe-5 gap-4 pb-6">
      <div className="col-span-2 space-y-4">
        <div className="flex bg-[#3E3D3D] text-white py-6 px-10 rounded-xl">
          <div>
            <div className="font-semibold text-xl">14</div>
            <div className="text-sm"> Proposals Voted</div>
          </div>
          <div className="border-[0.5px] border-[#8E8E8E] mx-4 my-1"></div>
          <div className="ps-2">
            <div className="font-semibold text-xl">
              2.56k <span className="text-sm font-normal">delegates</span>
            </div>
            <div className="text-sm"> Proposals Voted</div>
          </div>
        </div>

        <div
          style={{ boxShadow: "0px 4px 15.1px 0px rgba(0, 0, 0, 0.17)" }}
          className="p-10 rounded-xl"
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
          ) : (
            <Doughnut
              data={chartData}
              width={700}
              height={350}
              options={{
                maintainAspectRatio: false,
              }}
            />
          )}
        </div>
      </div>
      <div
        style={{ boxShadow: "0px 4px 11.8px 0px rgba(0, 0, 0, 0.21)" }}
        className="min-h-10 border border-[#D9D9D9] rounded-xl col-span-3 p-7"
      >
        <div className="font-semibold text-blue-shade-200 text-2xl py-2">
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
          ) : pageData.length > 0 ? (
            pageData.map((proposal: any, index: number) => (
              <div
                key={index}
                className={`flex justify-between border border-[#7C7C7C] text-sm px-3 py-2 rounded-lg items-center my-3 `}
              >
                <div className="w-4/5">
                  <div className={` ${openDesc[index] ? "" : styles.desc}`}>
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
                    proposal.support === 0
                      ? "bg-[#0033A8]"
                      : proposal.support === 1
                      ? "bg-[#6B98FF]"
                      : "bg-[#004DFF]"
                  }`}
                >
                  {proposal.support === 0
                    ? "For"
                    : proposal.support === 1
                    ? "Against"
                    : "Abstain"}
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

        <div className="pt-4 flex items-end bottom-0 justify-center">
          <Pagination
            color="primary"
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
          />
        </div>
      </div>
    </div>
  );
}

export default DelegateVotes;
