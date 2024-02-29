import React, { ChangeEvent, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";

interface userInfoProps {
  description: string;
  onSaveButtonClick: (description?: string) => Promise<void>;
  isLoading: boolean;
  descAvailable: boolean;
  karmaDesc: string;
}

function UserInfo({
  description,
  onSaveButtonClick,
  isLoading,
  descAvailable,
  karmaDesc,
}: userInfoProps) {
  useEffect(() => {
    const sessionHosted = {};
  }, []);

  const details = [
    {
      number: 10,
      desc: "Sessions hosted",
    },
    {
      number: 15,
      desc: "Sessions attended",
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

  //  const { address } = useAccount();
  const address = "0x5e349eca2dc61abcd9dd99ce94d04136151a09ee";
  const { chain, chains } = useNetwork();
  const [data, setData] = useState(details);
  // const [description, setDescription] = useState(
  //   "Type your description here..."
  // );
  const [isEditing, setEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState("");
  const [desc, setDesc] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleDescChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTempDesc(event.target.value);
    console.log("Temp Desc", event.target.value);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    console.log("Desc", tempDesc);
    await onSaveButtonClick(tempDesc);
    setEditing(false);
    setLoading(false);
  };

  return (
    <div className="pt-4">
      <div className="grid grid-cols-4 pe-32 gap-10">
        {data.length > 0 ? (
          data.map((key, index) => (
            <div
              key={index}
              className="bg-[#3E3D3D] text-white rounded-2xl px-3 py-7"
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
        className={`flex flex-col justify-between min-h-48 rounded-xl my-7 me-32 p-3 
        ${isEditing ? "outline" : ""}`}
      >
        <textarea
          readOnly={!isEditing}
          className="outline-none min-h-48"
          onChange={handleDescChange}
          value={isEditing ? tempDesc : description || karmaDesc}
          placeholder={"Type your description here..."}
          // style={{height:"200px",width:"250px"}}
        />

        <div className="flex justify-end">
          {isEditing && (
            <button
              className="bg-blue-shade-100 text-white text-sm py-1 px-3 rounded-full font-semibold"
              onClick={handleSaveClick}
            >
              {loading ? "Saving" : "Save"}
            </button>
          )}

          {!isEditing && (
            <button
              className="bg-blue-shade-100 text-white text-sm py-1 px-4 mt-3 rounded-full font-semibold"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
