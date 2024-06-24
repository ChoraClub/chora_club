// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
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
  isDelegate: boolean;
  isSelfDelegate: boolean;
  daoName: string;
}

function UserInfo({
  description,
  onSaveButtonClick,
  isLoading,
  descAvailable,
  isDelegate,
  isSelfDelegate,
  karmaDesc,
  daoName,
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
  const router = useRouter();
  const [isSessionHostedLoading, setSessionHostedLoading] = useState(true);
  const [isSessionAttendedLoading, setSessionAttendedLoading] = useState(true);
  const [isOfficeHoursHostedLoading, setOfficeHoursHostedLoading] =
    useState(true);
  const [isOfficeHourseAttendedLoading, setOfficeHoursAttendedLoading] =
    useState(true);
  const [sessionHostCount, setSessionHostCount] = useState(0);
  const [sessionAttendCount, setSessionAttendCount] = useState(0);
  const [officehoursHostCount, setOfficehoursHostCount] = useState(0);
  const [officehoursAttendCount, setOfficehoursAttendCount] = useState(0);
  let sessionHostingCount = 0;
  let sessionAttendingCount = 0;
  let officehoursHostingCount = 0;
  let officehoursAttendingCount = 0;
  let dao_name = daoName;
  const [activeButton, setActiveButton] = useState("onchain");

  const fetchAttestation = async (buttonType: string) => {
    let sessionHostingCount = 0;
    let sessionAttendingCount = 0;
    let officehoursHostingCount = 0;
    let officehoursAttendingCount = 0;

    setActiveButton(buttonType);
    setSessionHostedLoading(true);
    setSessionAttendedLoading(true);
    setOfficeHoursHostedLoading(true);
    setOfficeHoursAttendedLoading(true);

    if (chain?.name === "Optimism") {
      dao_name = "optimism";
    } else if (chain?.name === "Arbitrum One") {
      dao_name = "arbitrum";
    }

    const host_uid_key =
      buttonType === "onchain" ? "onchain_host_uid" : "uid_host";

    const attendee_uid_key =
      buttonType === "onchain" ? "onchain_uid_attendee" : "attendee_uid";

    const sessionHosted = async () => {
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
            console.log("item uid: ", item[host_uid_key], host_uid_key);
            if (
              item.meeting_status === "Recorded" &&
              item.dao_name === dao_name &&
              item[host_uid_key]
            ) {
              sessionHostingCount++;
            }
            setSessionHostCount(sessionHostingCount);
            setSessionHostedLoading(false);
          });
        } else {
          setSessionHostedLoading(false);
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
              item.dao_name === dao_name &&
              item.attendees.some((attendee: any) => attendee[attendee_uid_key])
            ) {
              sessionAttendingCount++;
            }
            setSessionAttendCount(sessionAttendingCount);
            setSessionAttendedLoading(false);
          });
        } else {
          setSessionAttendedLoading(false);
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
              item.meeting_status === "inactive" &&
              item.dao_name === dao_name &&
              item[host_uid_key]
            ) {
              officehoursHostingCount++;
            }

            // console.log("office hours host count: ", officehoursHostingCount);
            setOfficehoursHostCount(officehoursHostingCount);
            setOfficeHoursHostedLoading(false);
          });
        } else {
          setOfficeHoursHostedLoading(false);
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
              item.meeting_status === "inactive" &&
              item.dao_name === dao_name &&
              item.attendees.some((attendee: any) => attendee[attendee_uid_key])
            ) {
              officehoursAttendingCount++;
            }

            setOfficehoursAttendCount(officehoursAttendingCount);
            setOfficeHoursAttendedLoading(false);
          });
        } else {
          setOfficeHoursAttendedLoading(false);
        }
      } catch (e) {
        console.log("Error: ", e);
      }
    };

    sessionHosted();
    sessionAttended();
    officeHoursHosted();
    officeHoursAttended();
  };

  useEffect(() => {
    if (activeButton === "onchain") {
      fetchAttestation("onchain");
    } else if (activeButton === "offchain") {
      fetchAttestation("offchain");
    }
  }, [activeButton, address, chain]);

  const blocks = [
    {
      number: sessionAttendCount,
      desc: "Sessions attended",
      ref: `/profile/${address}}?active=sessions&session=attended`,
    },
    {
      number: officehoursAttendCount,
      desc: "Office Hours attended",
      ref: `/profile/${address}}?active=officeHours&hours=attended`,
    },
  ];

  if (isDelegate === true || isSelfDelegate === true) {
    blocks.unshift(
      {
        number: sessionHostCount,
        desc: "Sessions hosted",
        ref: `/profile/${address}}?active=sessions&session=hosted`,
      },
      {
        number: officehoursHostCount,
        desc: "Office Hours hosted",
        ref: `/profile/${address}}?active=officeHours&hours=attended`,
      }
    );
  }

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
      <div className="flex w-fit gap-16 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm mb-6">
        <button
          className={`py-2 ${
            activeButton === "onchain"
              ? "text-[#3E3D3D] font-bold"
              : "text-[#7C7C7C]"
          } `}
          onClick={() => fetchAttestation("onchain")}>
          Onchain
        </button>
        <button
          className={`py-2 ${
            activeButton === "offchain"
              ? "text-[#3E3D3D] font-bold"
              : "text-[#7C7C7C]"
          }`}
          onClick={() => fetchAttestation("offchain")}>
          Offchain
        </button>
      </div>
      <div className="grid grid-cols-4 pe-32 gap-10">
        {blocks.length > 0 ? (
          blocks.map((key, index) => (
            <div
              key={index}
              className={`bg-[#3E3D3D] text-white rounded-2xl px-3 py-7 cursor-pointer`}
              onClick={() => router.push(`${key.ref}`)}>
              <div className="font-semibold text-3xl text-center pb-2">
                {isSessionHostedLoading &&
                isSessionAttendedLoading &&
                isOfficeHoursHostedLoading &&
                isOfficeHourseAttendedLoading ? (
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
        ${isEditing ? "outline" : ""}`}>
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
              onClick={handleSaveClick}>
              {loading ? "Saving" : "Save"}
            </button>
          )}

          {!isEditing && (
            <button
              className="bg-blue-shade-100 text-white text-sm py-1 px-4 mt-3 rounded-full font-semibold"
              onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
