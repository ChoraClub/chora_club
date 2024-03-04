import React, { useEffect, useState } from "react";
import {
  Comment,
  Hourglass,
  Oval,
  RotatingLines,
  ThreeDots,
} from "react-loader-spinner";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function DelegateInfo({ props }: { props: Type }) {
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [isDataLoading, setDataLoading] = useState(true);
  const [sessionHostCount, setSessionHostCount] = useState(0);
  const [sessionAttendCount, setSessionAttendCount] = useState(0);
  const [officehoursHostCount, setOfficehoursHostCount] = useState(0);
  const [officehoursAttendCount, setOfficehoursAttendCount] = useState(0);
  let sessionHostingCount = 0;
  let sessionAttendingCount = 0;
  let officehoursHostingCount = 0;
  let officehoursAttendingCount = 0;

  useEffect(() => {
    const sessionHosted = async () => {
      try {
        const response = await fetch(
          `/api/get-meeting/${props.individualDelegate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          result.data.forEach((item: any) => {
            if (
              item.meeting_status === "Recorded" &&
              item.dao_name === "optimism" &&
              item.uid_host &&
              props.daoDelegates == "optimism"
            ) {
              sessionHostingCount++;
            } else if (
              item.meeting_status === "Recorded" &&
              item.dao_name === "arbitrum" &&
              item.uid_host &&
              props.daoDelegates == "arbitrum"
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
        const response = await fetch(
          `/api/get-session-data/${props.individualDelegate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          result.data.forEach((item: any) => {
            if (
              item.meeting_status === "Recorded" &&
              item.dao_name === "optimism" &&
              item.uid_attendee &&
              props.daoDelegates == "optimism"
            ) {
              sessionAttendingCount++;
            } else if (
              item.meeting_status === "Recorded" &&
              item.dao_name === "arbitrum" &&
              item.uid_attendee &&
              props.daoDelegates == "arbitrum"
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
            address: props.individualDelegate,
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
              props.daoDelegates == "optimism"
            ) {
              officehoursHostingCount++;
            } else if (
              item.status === "inactive" &&
              item.chain_name === "Arbitrum" &&
              item.uid_host &&
              props.daoDelegates == "arbitrum"
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
            attendee_address: props.individualDelegate,
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
              props.daoDelegates == "optimism"
            ) {
              officehoursAttendingCount++;
            } else if (
              item.status === "inactive" &&
              item.chain_name === "Arbitrum" &&
              item.attendees.some((attendee: any) => attendee.attendee_uid) &&
              props.daoDelegates == "arbitrum"
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
  }, [props.individualDelegate, props.daoDelegates]);

  const details = [
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
      <div className="grid grid-cols-4 pe-32 gap-10">
        {details.length > 0 ? (
          details.map((key, index) => (
            <div
              key={index}
              className="bg-[#3E3D3D] text-white rounded-2xl px-3 py-5"
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
