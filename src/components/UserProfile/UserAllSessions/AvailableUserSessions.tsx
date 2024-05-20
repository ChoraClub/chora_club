import React from "react";
import { data15, data30, data45 } from "./data";
import { ImBin } from "react-icons/im";
import { FaPencil } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

function TimeSlotTable({ title, data }: {title: any, data:any}) {
  const handleButtonClick = () => {
    toast("Coming soon 🚀");
  };

  return (
    <>
      <p className="text-gray-700 font-semibold my-2">{title}:</p>
      <table className="w-full table-auto text-sm">
        {data.map((item:any, index: number) => (
          <tr
            key={index}
            className={`${index % 2 === 0 ? "bg-[#D9D9D945]" : "bg-white"} row`}
          >
            <td className="px-4 py-2">{index + 1}.</td>
            <td className="px-4 py-2">{item.date}</td>
            <td className="px-4 py-2">
              {item.startTime} to {item.endTime}
            </td>
            <td className="px-4 py-2">
              <div className="buttons inline-flex">
                <button
                  className="mr-2 cursor-pointer"
                  onClick={handleButtonClick}
                >
                  <FaPencil className="text-blue-600" />
                </button>
                <button className="cursor-pointer" onClick={handleButtonClick}>
                  <ImBin className="text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </table>
    </>
  );
}

function AvailableUserSessions() {
  return (
    <div
      style={{ boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)" }}
      className="max-w-lg mt-2 p-8 bg-white rounded-2xl h-fit"
    >
      <h1 className="text-black font-semibold text-2xl">
        Scheduled Available Time
      </h1>

      {data15.length > 0 || data30.length > 0 || data45.length > 0 ? (
        <>
          {data15.length > 0 && (
            <TimeSlotTable title="15 Minutes" data={data15} />
          )}
          {data30.length > 0 && (
            <TimeSlotTable title="30 Minutes" data={data30} />
          )}
          {data45.length > 0 && (
            <TimeSlotTable title="45 Minutes" data={data45} />
          )}
          <Toaster
            toastOptions={{
              style: {
                fontSize: "14px",
                backgroundColor: "#3E3D3D",
                color: "#fff",
                boxShadow: "none",
                borderRadius: "50px",
                padding: "3px 5px",
              },
            }}
          />
        </>
      ) : (
        <p className="mt-5">No Scheduled Available Time</p>
      )}
    </div>
  );
}

export default AvailableUserSessions;
