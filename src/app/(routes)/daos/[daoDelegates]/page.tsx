import React from "react";

function page({ params }: { params: { daoDelegates: string } }) {
  return <div className="text-2xl capitalize">Dao: {params.daoDelegates}</div>;
}

export default page;
