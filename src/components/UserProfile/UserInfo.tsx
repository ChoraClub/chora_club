import { useRouter } from "next-nprogress-bar";
import React, { ChangeEvent, useState, useEffect } from "react";
import { Oval, RotatingLines } from "react-loader-spinner";
import { useAccount } from "wagmi";
// import 'react-quill/dist/quill.snow.css';
// import './quillCustomStyles.css';

import dynamic from "next/dynamic";
import styled from "styled-components";
import rehypeSanitize from "rehype-sanitize";
import { getDaoName } from "@/utils/chainUtils";
import { ICommand, commands } from "@uiw/react-md-editor";
import { getAccessToken } from "@privy-io/react-auth";

const StyledMDEditorWrapper = styled.div`
  .w-md-editor {
    background-color: white !important;
    color: black !important;
  }

  .w-md-editor-text-pre,
  .w-md-editor-text-input,
  .w-md-editor-text {
    color: black !important;
  }

  .wmde-markdown {
    background-color: white !important;
    color: black !important;
  }

  .w-md-editor-toolbar {
    height: auto !important;
    border-radius: 20px 20px 0 0 !important;
    background-color: white !important;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 5px;
  }

  .w-md-editor-toolbar li.active,
  .w-md-editor-toolbar li:hover {
    background-color: #e6e6e6;
  }

  .w-md-editor-toolbar li > button {
    padding: 4px;
  }

  .w-md-editor-toolbar svg {
    width: 18px !important;
    height: 18px !important;
    margin: 0 6px 2px 6px !important;
    color: black !important;
  }

  .w-md-editor {
    border-radius: 15px !important;
  }
  .w-md-editor-content {
    margin: 12px 0 12px 0 !important;
    font-family: "Poppins", sans-serif !important;
  }
  .wmde-markdown {
    font-family: "Poppins", sans-serif !important;
  }
  .wmde-markdown ul {
    list-style-type: disc !important;
    padding-left: 20px !important;
  }

  .wmde-markdown ol {
    list-style-type: decimal !important;
    padding-left: 20px !important;
  }

  @media (max-width: 768px) {
    .w-md-editor-show-live {
      flex-direction: column;
    }

    .w-md-editor-show-live .w-md-editor-input,
    .w-md-editor-show-live .w-md-editor-preview {
      width: 50% !important;
      flex: 1 1 auto !important;
    }

    .w-md-editor-show-live .w-md-editor-input {
      border-bottom: 1px solid #ddd;
    }
  }
  @media (max-width: 1070px) {
    .w-md-editor-toolbar {
      padding: 2px;
    }

    .w-md-editor-toolbar li > button {
      padding: 2px;
    }

    .w-md-editor-toolbar svg {
      width: 14px !important;
      height: 14px !important;
      margin: 0 2px 1px 2px !important;
    }
  }
`;

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface userInfoProps {
  karmaDesc: string;
  description: string;
  isDelegate: boolean;
  isSelfDelegate: boolean;
  onSaveButtonClick: (description?: string) => Promise<void>;
  // descAvailable: boolean;
  daoName: string;
}

function UserInfo({
  karmaDesc,
  description,
  isDelegate,
  isSelfDelegate,
  onSaveButtonClick,
  // descAvailable,
  daoName,
}: userInfoProps) {
  const { address } = useAccount();
  // const address = "0x5e349eca2dc61abcd9dd99ce94d04136151a09ee";
  const { chain } = useAccount();
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
  const [isOfficeHoursAttendedLoading, setOfficeHoursAttendedLoading] =
    useState(true);
  const [sessionHostCount, setSessionHostCount] = useState(0);
  const [sessionAttendCount, setSessionAttendCount] = useState(0);
  const [officehoursHostCount, setOfficehoursHostCount] = useState(0);
  const [officehoursAttendCount, setOfficehoursAttendCount] = useState(0);
  let dao_name = daoName;
  const [activeButton, setActiveButton] = useState("onchain");

  const [originalDesc, setOriginalDesc] = useState(description || karmaDesc);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("document name ", document.title);
    }
  }, []);

  const getCustomCommands = (isMobile: boolean): ICommand[] => {
    const mobileCommands = [
      commands.bold,
      commands.italic,
      commands.link,
      commands.image,
      commands.unorderedListCommand,
      commands.orderedListCommand,
    ];

    const desktopCommands = [
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.link,
      commands.image,
      commands.quote,
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.checkedListCommand,
    ];

    return isMobile ? mobileCommands : desktopCommands;
  };

  // const toolbarOptions = [
  //   ["bold", "italic", "underline", "strike"],
  //   ["blockquote", "code-block"],

  //   [{ header: 1 }, { header: 2 }],
  //   [{ list: "ordered" }, { list: "bullet" }],
  //   [{ script: "sub" }, { script: "super" }],
  //   [{ indent: "-1" }, { indent: "+1" }],
  //   [{ direction: "rtl" }],

  //   [{ size: ["small", false, "large", "huge"] }],
  //   [{ header: [1, 2, 3, 4, 5, 6, false] }],

  //   [{ color: [] }, { background: [] }],
  //   [{ font: [] }],
  //   [{ align: [] }],

  //   ["clean"],

  //   ["link", "image", "video"],
  // ];

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

    const dao_name = getDaoName(chain?.name);

    const host_uid_key =
      buttonType === "onchain" ? "onchain_host_uid" : "uid_host";

    const attendee_uid_key =
      buttonType === "onchain" ? "onchain_uid_attendee" : "attendee_uid";

    const sessionHosted = async () => {
      try {
        const response = await fetch(
          `/api/get-meeting/${address}?dao_name=${dao_name}`,
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
        setSessionHostedLoading(false);
      }
    };

    const sessionAttended = async () => {
      try {
        const token = await getAccessToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        const response = await fetch(`/api/get-session-data/${address}`, {
          method: "POST",
          headers: myHeaders,
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
        const token = await getAccessToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        const response = await fetch(`/api/get-officehours-address`, {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            address: address,
          }),
        });
        const result = await response.json();
        if (result.length > 0) {
          result.forEach((item: any) => {
            if (
              item.meeting_status === "inactive" &&
              item.dao_name === dao_name &&
              item[host_uid_key]
            ) {
              officehoursHostingCount++;
            }

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
        const token = await getAccessToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        const response = await fetch(`/api/get-attendee-individual`, {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            attendee_address: address,
          }),
        });
        const result = await response.json();
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
        setOfficeHoursAttendedLoading(false);
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

  const handleDescChange = (value?: string) => {
    setTempDesc(value || "");
    console.log("Temp Desc", value);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    console.log("Desc", tempDesc);
    await onSaveButtonClick(tempDesc);
    setEditing(false);
    setLoading(false);
  };

  const handleCancelClick = () => {
    setTempDesc(originalDesc);
    setEditing(false);
  };

  useEffect(() => {
    setOriginalDesc(description || karmaDesc);
    setTempDesc(description || karmaDesc);
  }, [description, karmaDesc]);

  return (
    <div className="pt-4">
      <div className="flex w-fit gap-16 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm mb-6 mx-4 xs:mx-0 sm:mx-4 md:mx-16 lg:mx-0">
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
      <div className="grid xs:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 mx-4 xs:mx-0 sm:mx-4 md:mx-16 lg:mx-0">
        {blocks.length > 0 ? (
          blocks.map((key, index) => (
            <div
              key={index}
              className={`bg-[#3E3D3D] text-white rounded-2xl px-3 py-7 cursor-pointer`}
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

      {isSelfDelegate ? (
        <div
          style={{ boxShadow: "0px 4px 30.9px 0px rgba(0, 0, 0, 0.12)" }}
          className={`flex flex-col justify-between min-h-48 rounded-xl my-7 mx-4 xs:mx-0 sm:mx-4 md:mx-16 lg:mx-0 p-6
        ${isEditing ? "outline" : ""}`}
        >
          {/* <ReactQuill
            readOnly={!isEditing}
            value={isEditing ? tempDesc :( description || karmaDesc)}
            onChange={handleDescChange}
            modules={{
              toolbar: toolbarOptions,
            }}
            placeholder={"Type your description here ..."}
          /> */}

          <StyledMDEditorWrapper className="w-full">
            <MDEditor
              value={isEditing ? tempDesc : description || karmaDesc}
              onChange={handleDescChange}
              // preview={isEditing ? "live" : "preview"}
              // height={300}
              preview={isMobile ? (isEditing ? "edit" : "preview") : "live"}
              height={isMobile ? 400 : 300}
              hideToolbar={!isEditing}
              visibleDragbar={false}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
              textareaProps={{
                placeholder: "Type your description here...",
                // style: {maxHeight: "50vh", overflowY: "auto" }
              }}
              // commands={getCustomCommands(isMobile)}
            />
          </StyledMDEditorWrapper>

          <div className="flex justify-end mt-3">
            {isEditing ? (
              <>
                <button
                  className="bg-blue-shade-100 text-white text-sm py-1 px-3 rounded-full font-semibold mr-2"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-shade-100 text-white text-sm py-1 px-3 rounded-full font-semibold"
                  onClick={handleSaveClick}
                >
                  {loading ? "Saving" : "Save"}
                </button>
              </>
            ) : (
              <button
                className="bg-blue-shade-100 text-white text-sm py-1 px-4  rounded-full font-semibold"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default UserInfo;
