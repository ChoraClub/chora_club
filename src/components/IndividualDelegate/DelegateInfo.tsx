import React, { useEffect, useState } from "react";
import { Comment, Hourglass, Oval, ThreeDots } from "react-loader-spinner";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function DelegateInfo({ props }: { props: Type }) {
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
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.karmahq.xyz/api/forum-user/${props.daoDelegates}/delegate-pitch/${props.individualDelegate}`
        );
        const details = await res.json();
        // console.log("Desc: ", details.data.delegatePitch.customFields[1].value);
        setLoading(false);
        setDescription(details.data.delegatePitch.customFields[1].value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-5 pe-32 gap-7">
        {data.length > 0 ? (
          data.map((key, index) => (
            <div
              key={index}
              className="bg-[#3E3D3D] text-white rounded-2xl px-3 py-5"
            >
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
        className={`rounded-xl my-7 me-32 py-6 px-7 text-sm ${
          description ? "" : "min-h-48"
        }`}
      >
        {loading ? (
          <div className="flex pt-6 justify-center">
            <ThreeDots
              visible={true}
              height="60"
              width="60"
              color="#0500FF"
              ariaLabel="oval-loading"
            />
          </div>
        ) : description ? (
          description
        ) : (
          <div className="font-semibold text-base flex justify-center">
            Delegate has not provided a description
          </div>
        )}
      </div>
    </div>
  );
}

export default DelegateInfo;
