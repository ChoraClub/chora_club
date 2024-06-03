import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ProposalVoted from "../utils/ProposalVoted";


function UserVotes({ daoName }: { daoName: string }) {
  const { address } = useAccount();
  return (
    <ProposalVoted daoName={daoName} address={address} />
  );
}

export default UserVotes;
