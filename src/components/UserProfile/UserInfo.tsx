import React, { ChangeEvent, useState, useEffect } from "react";
import { Oval, RotatingLines } from "react-loader-spinner";
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
  const { address } = useAccount();
  // const address = "0x5e349eca2dc61abcd9dd99ce94d04136151a09ee";
  const { chain, chains } = useNetwork();
  // const [description, setDescription] = useState(
  //   "Type your description here..."
  // );
  const [isEditing, setEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState("");
  const [desc, setDesc] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setDataLoading] = useState(true);
  const [sessionHostCount, setSessionHostCount] = useState(0);
  const [sessionAttendCount, setSessionAttendCount] = useState(0);
  const [officehoursHostCount, setOfficehoursHostCount] = useState(0);
  const [officehoursAttendCount, setOfficehoursAttendCount] = useState(0);
  let sessionHostingCount = 0;
  let sessionAttendingCount = 0;
  let officehoursHostingCount = 0;
  let officehoursAttendingCount = 0;
  let dao_name = "";

  useEffect(() => {
    const sessionHosted = async () => {
      if (chain?.name === "Optimism") {
        dao_name = "optimism";
      } else if (chain?.name === "Arbitrum One") {
        dao_name = "arbitrum";
      }
      try {
        const response = await fetch(`/api/get-meeting/${address}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.success) {
          result.data.forEach((item: any) => {
            if (
              item.meeting_status === "Recorded" &&
              item.dao_name === "optimism" &&
              item.uid_host &&
              chain?.name == "Optimism"
            ) {
              sessionHostingCount++;
            } else if (
              item.meeting_status === "Recorded" &&
              item.dao_name === "arbitrum" &&
              item.uid_host &&
              chain?.name == "Arbitrum One"
            ) {
              sessionHostingCount++;
            }
            // console.log("op host count: ", sessionHostingCount);
            setSessionHostCount(sessionHostingCount);
            setDataLoading(false);
          });
        } else {
          setDataLoading(false);
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    };

    const sessionAttended = async () => {
      try {
        const response = await fetch(`/api/get-session-data/${address}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dao_name: dao_name,
          }),
        });
        const result = await response.json();
        if (result.success) {
          result.data.forEach((item: any) => {
            if (
              item.meeting_status === "Recorded" &&
              item.dao_name === "optimism" &&
              item.uid_attendee &&
              chain?.name == "Optimism"
            ) {
              sessionAttendingCount++;
            } else if (
              item.meeting_status === "Recorded" &&
              item.dao_name === "arbitrum" &&
              item.uid_attendee &&
              chain?.name == "Arbitrum One"
            ) {
              sessionAttendingCount++;
            }
            // console.log("op attended count: ", sessionAttendingCount);
            setSessionAttendCount(sessionAttendingCount);
            setDataLoading(false);
          });
        } else {
          setDataLoading(false);
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    };

    const officeHoursHosted = async () => {
      try {
        const response = await fetch(`/api/get-officehours-address`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: address,
          }),
        });
        const result = await response.json();
        // console.log("office hours result: ", result);
        if (result.length > 0) {
          result.forEach((item: any) => {
            if (
              item.status === "inactive" &&
              item.chain_name === "Optimism" &&
              item.uid_host &&
              chain?.name == "Optimism"
            ) {
              officehoursHostingCount++;
            } else if (
              item.status === "inactive" &&
              item.chain_name === "Arbitrum" &&
              item.uid_host &&
              chain?.name == "Arbitrum One"
            ) {
              officehoursHostingCount++;
            }
            // console.log("office hours host count: ", officehoursHostingCount);
            setOfficehoursHostCount(officehoursHostingCount);
            setDataLoading(false);
          });
        } else {
          setDataLoading(false);
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    };

    const officeHoursAttended = async () => {
      try {
        const response = await fetch(`/api/get-attendee-individual`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attendee_address: address,
          }),
        });
        const result = await response.json();
        // console.log("office hours attended result: ", result);
        if (result.length > 0) {
          result.forEach((item: any) => {
            if (
              item.status === "inactive" &&
              item.chain_name === "Optimism" &&
              item.attendees.some((attendee: any) => attendee.attendee_uid) &&
              chain?.name == "Optimism"
            ) {
              officehoursAttendingCount++;
            } else if (
              item.status === "inactive" &&
              item.chain_name === "Arbitrum" &&
              item.attendees.some((attendee: any) => attendee.attendee_uid) &&
              chain?.name == "Arbitrum One"
            ) {
              officehoursAttendingCount++;
            }
            // console.log("officehours attended: ", officehoursAttendingCount);
            setOfficehoursAttendCount(officehoursAttendingCount);
            setDataLoading(false);
          });
        } else {
          setDataLoading(false);
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    };

    sessionHosted();
    sessionAttended();
    officeHoursHosted();
    officeHoursAttended();
  }, [address, chain]);

  const blocks = [
    {
      number: sessionHostCount,
      desc: "Sessions hosted",
    },
    {
      number: sessionAttendCount,
      desc: "Sessions attended",
    },
    {
      number: officehoursHostCount,
      desc: "Office Hours hosted",
    },
    {
      number: officehoursAttendCount,
      desc: "Office Hours attended",
    },
  ];

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
        {blocks.length > 0 ? (
          blocks.map((key, index) => (
            <div
              key={index}
              className="bg-[#3E3D3D] text-white rounded-2xl px-3 py-7"
            >
              <div className="font-semibold text-3xl text-center pb-2">
                {isDataLoading ? (
                  <div className="flex items-center justify-center">
                    <RotatingLines
                      visible={true}
                      width="36"
                      strokeColor="grey"
                      ariaLabel="oval-loading"
                    />
                  </div>
                ) : (
                  key.number
                )}
              </div>
              <div className="text-center text-sm">{key.desc}</div>
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
