import React, { useEffect, useState } from "react";
import ProposalVoted from "../ComponentUtils/ProposalVoted";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function DelegateVotes({ props }: { props: Type }) {
  return (
    <ProposalVoted
      daoName={props.daoDelegates}
      address={props.individualDelegate}
    />
  );
}

export default DelegateVotes;
