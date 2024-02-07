import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pagination } from "@nextui-org/react";
import styles from "../IndividualDelegate/DelegateVotes.module.css";

Chart.register(ArcElement, Tooltip, Legend);

function UserVotes() {
  const proposals = [
    {
      title:
        "Proposal Description Proposal Description Proposal Description Proposal Description",
      status: "For",
    },
    {
      title:
        "Proposal Description2 Proposal Description2 Proposal Description2",
      status: "Against",
    },
    {
      title:
        "Proposal Description3 Proposal Description2 Proposal Description2",
      status: "For",
    },
    {
      title: "Proposal Description4 Proposal Desc Proposal123 Description2",
      status: "Abstain",
    },
    {
      title: "Proposal Description5 Proposal123 Description2 Proposal Desc",
      status: "Against",
    },
    {
      title: "Proposal Description6",
      status: "Abstain",
    },
    {
      title: "Proposal Description7",
      status: "For",
    },
    {
      title: "Proposal Description8",
      status: "For",
    },
    {
      title: "Proposal Description9",
      status: "Against",
    },
    {
      title: "Proposal Description10",
      status: "For",
    },
    {
      title: "Proposal Description11",
      status: "Abstain",
    },
    {
      title: "Proposal Description12",
      status: "Against",
    },
    {
      title: "Proposal Description13",
      status: "Abstain",
    },
    {
      title: "Proposal Description14",
      status: "For",
    },
    {
      title: "Proposal Description15",
      status: "Abstain",
    },
    {
      title: "Proposal Description16",
      status: "Against",
    },
    {
      title: "Proposal Description17",
      status: "Abstain",
    },
  ];

  const data = {
    labels: ["For", "Against", "Abstain"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 9],
        backgroundColor: ["#0033A8", "#6B98FF", "#004DFF"],
        borderWidth: 1,
      },
    ],
  };

  const [allProposals, setAllProposal] = useState(proposals);
  const [currentPage, setCurrentPage] = useState(1);

  const totalData: number = proposals.length;
  const dataPerPage: number = 5;
  const totalPages: number = Math.ceil(totalData / dataPerPage);

  useEffect(() => {
    const offset = (currentPage - 1) * dataPerPage;
    const end = offset + dataPerPage;
    const initialData = proposals.slice(offset, end);
    setAllProposal(initialData);
  }, [currentPage, dataPerPage]);

  return (
    <div className="pt-4">
      <div className="grid grid-cols-5 pe-5 gap-4">
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
            <Doughnut
              data={data}
              width={700}
              height={350}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        <div
          style={{ boxShadow: "0px 4px 11.8px 0px rgba(0, 0, 0, 0.21)" }}
          className="min-h-10 border border-[#D9D9D9] rounded-xl col-span-3 p-7"
        >
          <div className="font-semibold text-blue-shade-200 text-2xl py-2">
            List of Proposals
          </div>

          <div className="h-[23rem]">
            {allProposals.length > 0 ? (
              allProposals.map((proposal, index) => (
                <div className="flex justify-between border border-[#7C7C7C] text-sm px-3 py-2 rounded-lg items-center my-3">
                  <div className="w-3/4">
                    <div className={` ${styles.desc}`}>{proposal.title}</div>
                    <span className="text-xs text-blue-shade-100 underline cursor-pointer">
                      View
                    </span>
                  </div>
                  <div
                    className={`text-white rounded-full px-3 py-[2px] ${
                      proposal.status === "For"
                        ? "bg-[#0033A8]"
                        : proposal.status === "Against"
                        ? "bg-[#6B98FF]"
                        : "bg-[#004DFF]"
                    }`}
                  >
                    {proposal.status}
                  </div>
                </div>
              ))
            ) : (
              <div>No data</div>
            )}
          </div>

          <div className="pt-4 flex items-end bottom-0 justify-center">
            <Pagination
              total={totalPages}
              initialPage={1}
              page={currentPage}
              onChange={setCurrentPage}
              showControls
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserVotes;
