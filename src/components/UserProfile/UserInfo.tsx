import React, { useState } from "react";

function UserInfo() {
  const details = [
    {
      number: 10,
      desc: "Sessions hosted",
    },
    {
      number: 15,
      desc: "Office Hours attended",
    },
    {
      number: 2,
      desc: "Sessions missed",
    },
    {
      number: 2,
      desc: "Office Hours hosted",
    },
    {
      number: 20,
      desc: "Office Hours attended",
    },
  ];

  const [data, setData] = useState(details);

  return (
    <div>
      
      <div className="grid grid-cols-5 pe-32 gap-7">
        {data.length > 0 ? (
          data.map((key, index) => (
            <div className="bg-[#3E3D3D] text-white rounded-2xl px-3 py-7">
              <div className="font-semibold text-3xl text-center">
                {key.number}
              </div>
              <div className="text-center text-xs">{key.desc}</div>
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>

      <div
        style={{ boxShadow: "0px 4px 30.9px 0px rgba(0, 0, 0, 0.12)" }}
        className="min-h-48 rounded-xl my-7 me-32 p-3"
      >
        Description
      </div>
    </div>
  );
}

export default UserInfo;
