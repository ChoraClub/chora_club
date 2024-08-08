// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import React, { useEffect, useState } from "react";
import {
  Comment,
  Hourglass,
  Oval,
  RotatingLines,
  ThreeDots,
} from "react-loader-spinner";
import styles from "./DelegateInfo.module.css";
import { marked } from "marked";
import { useAccount } from "wagmi";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function DelegateInfo({ props, desc }: { props: Type; desc: string }) {
  const [karmaDescription, setKarmaDescription] = useState<string>();
  const [opAgoraDescription, setOpAgoraDescription] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [isDataLoading, setDataLoading] = useState(true);
  const router = useRouter();
  const [sessionHostCount, setSessionHostCount] = useState(0);
  const [sessionAttendCount, setSessionAttendCount] = useState(0);
  const [officehoursHostCount, setOfficehoursHostCount] = useState(0);
  const [officehoursAttendCount, setOfficehoursAttendCount] = useState(0);
  const [isSessionHostedLoading, setSessionHostedLoading] = useState(true);
  const [isSessionAttendedLoading, setSessionAttendedLoading] = useState(true);
  const [isOfficeHoursHostedLoading, setOfficeHoursHostedLoading] =
    useState(true);
  const [isOfficeHoursAttendedLoading, setOfficeHoursAttendedLoading] =
    useState(true);
  const [activeButton, setActiveButton] = useState("onchain");
  const [loadingOpAgora, setLoadingOpAgora] = useState(false);
  const [loadingKarma, setLoadingKarma] = useState(false);
  const [convertedDescription, setConvertedDescription] = useState<string>("");
  const { address } = useAccount();

  useEffect(() => {
    if (activeButton === "onchain") {
      fetchAttestation("onchain");
    } else if (activeButton === "offchain") {
      fetchAttestation("offchain");
    }
  }, [activeButton, props.individualDelegate, props.daoDelegates]);

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

    const host_uid_key =
      buttonType === "onchain" ? "onchain_host_uid" : "uid_host";

    const attendee_uid_key =
      buttonType === "onchain" ? "onchain_uid_attendee" : "attendee_uid";

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
              item.dao_name === props.daoDelegates &&
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
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        const response = await fetch(
          `/api/get-session-data/${props.individualDelegate}`,
          {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
              dao_name: props.daoDelegates,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          result.data.forEach((item: any) => {
            if (
              item.meeting_status === "Recorded" &&
              item.dao_name === props.daoDelegates &&
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
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        const response = await fetch(`/api/get-officehours-address`, {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            address: props.individualDelegate,
          }),
        });
        const result = await response.json();
        // console.log("office hours result: ", result);
        if (result.length > 0) {
          result.forEach((item: any) => {
            if (
              item.meeting_status === "inactive" &&
              item.dao_name === props.daoDelegates &&
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
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        const response = await fetch(`/api/get-attendee-individual`, {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            attendee_address: props.individualDelegate,
          }),
        });
        const result = await response.json();
        // console.log("office hours attended result: ", result);
        if (result.length > 0) {
          result.forEach((item: any) => {
            if (
              item.meeting_status === "inactive" &&
              item.dao_name === props.daoDelegates &&
              item.attendees.some((attendee: any) => attendee[attendee_uid_key])
            ) {
              officehoursAttendingCount++;
            }
            // console.log("officehours attended: ", officehoursAttendingCount);
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

  const details = [
    {
      number: sessionHostCount,
      desc: "Sessions hosted",
      ref: `/${props.daoDelegates}/${props.individualDelegate}?active=delegatesSession&session=hosted`,
    },
    {
      number: sessionAttendCount,
      desc: "Sessions attended",
      ref: `/${props.daoDelegates}/${props.individualDelegate}?active=delegatesSession&session=attended`,
    },
    {
      number: officehoursHostCount,
      desc: "Office Hours hosted",
      ref: `/${props.daoDelegates}/${props.individualDelegate}?active=officeHours&hours=hosted`,
    },
    {
      number: officehoursAttendCount,
      desc: "Office Hours attended",
      ref: `/${props.daoDelegates}/${props.individualDelegate}?active=officeHours&hours=attended`,
    },
  ];

  const renderParagraphs = (text: string) => {
    return text
      .split("\n")
      .filter((paragraph) => paragraph.trim() !== "")
      .map((paragraph, index) => (
        <p key={index} className="mb-3">
          {paragraph}
        </p>
      ));
  };

  const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
    let html = await marked.parse(markdown);

    // Replace <pre> tags with custom styled divs
    html = html.replace(/<pre>([\s\S]*?)<\/pre>/g, (match, content) => {
      return `<div class="${styles.preFormatted}">${content}</div>`;
    });

    return html;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (props.daoDelegates === "arbitrum") {
        try {
          setLoadingKarma(true);
          setLoading(true);
          const res = await fetch(
            `/api/get-arbitrum-delegatelist?user=${props.individualDelegate}`
          );
          const details = await res.json();
          console.log("Details: ", details);
          console.log("Desc: ", details.delegate.statement.statement);
          // setKarmaDescription(details.delegate.statement.statement);
          const statementHtml = await convertMarkdownToHtml(
            details.delegate.statement.statement
          );
          setKarmaDescription(details.delegate.statement.statement);
          setConvertedDescription(statementHtml);
          setLoadingKarma(false);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoadingKarma(false);
          setLoading(false);
        }
        setLoading(false);
      } else {
        try {
          setLoading(true);
          setLoadingOpAgora(true);
          console.log(props.individualDelegate);
          const res = await fetch(
            `/api/get-statement?individualDelegate=${props.individualDelegate}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              // body: JSON.stringify({ individualDelegate: props.individualDelegate }),
            }
          );

          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await res.json();
          const statement = data.statement.payload.delegateStatement;
          console.log("statement", statement);
          // setOpAgoraDescription(statement);
          // setConvertedDescription(convertMarkdownToHtml(statement));
          const statementHtml = await convertMarkdownToHtml(statement);
          setOpAgoraDescription(statement);
          setConvertedDescription(statementHtml);
          setLoadingOpAgora(false);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoadingOpAgora(false);
          setLoading(false);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [props.individualDelegate, props.daoDelegates]);

  console.log("desc from karma: ", karmaDescription);
  console.log("desc from db: ", desc);

  return (
    <div>
      <div className="flex w-fit gap-16 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm mb-6">
        <button
          className={`py-2 ${
            activeButton === "onchain"
              ? "text-[#3E3D3D] font-bold"
              : "text-[#7C7C7C]"
          } `}
          onClick={() => fetchAttestation("onchain")}
        >
          Onchain
        </button>
        <button
          className={`py-2 ${
            activeButton === "offchain"
              ? "text-[#3E3D3D] font-bold"
              : "text-[#7C7C7C]"
          }`}
          onClick={() => fetchAttestation("offchain")}
        >
          Offchain
        </button>
      </div>
      <div className="grid grid-cols-4 pe-32 gap-10">
        {details.length > 0 ? (
          details.map((key, index) => (
            <div
              key={index}
              className="bg-[#3E3D3D] text-white rounded-2xl px-3 py-5 cursor-pointer"
              onClick={() => router.push(`${key.ref}`)}
            >
              <div className="font-semibold text-3xl text-center pb-2">
                {isSessionHostedLoading &&
                isSessionAttendedLoading &&
                isOfficeHoursHostedLoading &&
                isOfficeHoursAttendedLoading ? (
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
          desc && loadingKarma && loadingOpAgora ? "" : "min-h-52"
        }`}
      >
        <div className="flex">
          <h1 className={`text-3xl font-semibold mb-3 ${styles.heading}`}>
            Delegate Statement
          </h1>
        </div>
        {loadingOpAgora || loadingKarma || loading ? (
          <div className="flex pt-6 justify-center">
            <ThreeDots
              visible={true}
              height="60"
              width="60"
              color="#0500FF"
              ariaLabel="oval-loading"
            />
          </div>
        ) : desc !== "" && desc !== null ? (
          desc
        ) : convertedDescription ? (
          <div
            dangerouslySetInnerHTML={{ __html: convertedDescription }}
            className={`${styles.delegateStatement} rounded-xl me-32 py-6 px-7 text-sm`}
          />
        ) : (
          <div className="font-semibold text-base flex justify-center items-center mt-7">
            Delegate has not provided a description
          </div>
        )}
      </div>
    </div>
  );
}

export default DelegateInfo;
