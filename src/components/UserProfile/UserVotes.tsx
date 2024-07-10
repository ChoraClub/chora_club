import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ProposalVoted from "../ComponentUtils/ProposalVoted";

function UserVotes({ daoName }: { daoName: string }) {
  const { address } = useAccount();
  return <ProposalVoted daoName={daoName} address={address} />;
}

export default UserVotes;
