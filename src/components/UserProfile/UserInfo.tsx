import React, { ChangeEvent, useState } from "react";

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
  const [description, setDescription] = useState(
    "Type your description here..."
  );
  const [isEditing, setEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState("");

  const handleDescChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTempDesc(event.target.innerText);
  };

  const handleSaveClick = () => {
    setDescription(tempDesc);
    setEditing(false);
  };

  return (
    <div className="pt-4">
      <div className="grid grid-cols-5 pe-32 gap-7">
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
        className={`flex flex-col justify-between min-h-48 rounded-xl my-7 me-32 p-3 ${
          isEditing ? "outline" : ""
        }`}
      >
        <div
          contentEditable={isEditing}
          className="outline-none"
          onInput={handleDescChange}
        >
          {description || "Type your description here..."}
        </div>
        <div className="flex justify-end">
          {isEditing && (
            <button
              className="bg-blue-shade-100 text-white text-sm py-1 px-3 rounded-full font-semibold"
              onClick={handleSaveClick}
            >
              Save
            </button>
          )}
          {!isEditing && (
            <button
              className="bg-blue-shade-100 text-white text-sm py-1 px-4 rounded-full font-semibold"
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
