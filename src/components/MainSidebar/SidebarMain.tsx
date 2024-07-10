"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/assets/images/daos/CCLogo.png";
// import logo from "@/assets/images/sidebar/favicon.png";
import rocket from "@/assets/images/sidebar/rocket.png";
import sessionIcn from "@/assets/images/sidebar/office.png";
import office from "@/assets/images/sidebar/Office hour (1).png";
import wallet from "@/assets/images/sidebar/wallet.png";
import gitbook from "@/assets/images/sidebar/gitbook.png";
import user from "@/assets/images/sidebar/user.png";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { Badge, Tooltip, VisuallyHidden } from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { ConnectWallet } from "../ConnectWallet/ConnectWallet";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { useRouter } from "next-nprogress-bar";
import ButtonWithCircle from "../Circle/ButtonWithCircle";
import Tour from "reactour";
import "@/components/ConnectWallet/ConnectWalletWithENS";
import "./tour.css";
import Joyride from "react-joyride";
import { title } from "process";
import { Placement } from "react-joyride";
import { Poppins } from "next/font/google";
import { MdImportantDevices } from "react-icons/md";
function Sidebar() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  // const [isClient, setIsClient] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  const tourSteps = [
    {
      target: "body",
      content: (
        <p className="text-black-shade-1000 text-left font-normal text-base font-poppins">
          Let&apos;s take a quick tour of Chora Club.
        </p>
      ),
      disableBeacon: true,
      placement: "center" as Placement,
      title: (
        <h1 className="text-blue-shade-100 text-left font-semibold text-xl font-poppins ml-[10px]">
          WELCOME!
        </h1>
      ),
      locale: {
        skip: <p className="font-poppins font-semibold text-[13px]">Skip</p>,
      },
    },
    {
      target: ".wallet",
      content: (
        <p className="text-black-shade-1000 text-left font-normal text-base font-poppins">
          Connect your wallet to get started.
        </p>
      ),
      disableBeacon: true,
      placement: "bottom" as Placement,
      title: (
        <h1 className="text-blue-shade-100 text-left font-semibold text-xl font-poppins ml-[10px]">
          CONNECT WALLET
        </h1>
      ),
      locale: {
        skip: <p className="font-poppins font-semibold text-[13px]">Skip</p>,
      },
    },
    {
      target: ".dao",
      content: (
        <p className="text-black-shade-1000 text-left font-normal text-base font-poppins">
          Discover all the DAOs listed on our platform.
        </p>
      ),
      disableBeacon: true,
      placement: "bottom" as Placement,
      title: (
        <h1 className="text-blue-shade-100 text-left font-semibold text-xl font-poppins ml-[10px]">
          EXPLORE DAOs
        </h1>
      ),
      locale: {
        skip: <p className="font-poppins font-semibold text-[13px]">Skip</p>,
      },
    },
    {
      target: ".office",
      content: (
        <p className="text-black-shade-1000 text-left font-normal text-base font-poppins">
          View ongoing, upcoming, and recorded office hours taken on Chora Club.
        </p>
      ),
      disableBeacon: true,
      placement: "bottom" as Placement,
      title: (
        <h1 className="text-blue-shade-100 text-left font-semibold text-xl font-poppins ml-[10px]">
          OFFICE HOURS
        </h1>
      ),
      locale: {
        skip: <p className="font-poppins font-semibold text-[13px]">Skip</p>,
      },
    },
    {
      target: ".session",
      content: (
        <p className="text-black-shade-1000 text-left font-normal text-base font-poppins">
          Watch recorded sessions and connect with available delegates.
        </p>
      ),
      disableBeacon: true,
      placement: "bottom" as Placement,
      title: (
        <h1 className="text-blue-shade-100 text-left font-semibold text-xl font-poppins ml-[10px]">
          SESSIONS
        </h1>
      ),
      locale: {
        skip: <p className="font-poppins font-semibold text-[13px]">Skip</p>,
      },
    },
    {
      target: ".gitbook",
      content: (
        <p className="text-black-shade-1000 text-left font-normal text-base font-poppins">
          Access detailed information and feature updates in our Gitbook.
        </p>
      ),
      disableBeacon: true,
      placement: "bottom" as Placement,
      title: (
        <h1 className="text-blue-shade-100 text-left font-semibold text-xl font-poppins ml-[10px]">
          GITBOOK DOC
        </h1>
      ),
      locale: {
        skip: <p className="font-poppins font-semibold text-[13px]">Skip</p>,
      },
    },
    {
      target: "body",
      content: (
        <p className="text-black-shade-1000 text-left font-normal text-base font-poppins">
          You&apos;re all set! Begin your web3 journey now.
        </p>
      ),
      disableBeacon: true,
      placement: "center" as Placement,
      bodyClass: "tour-step-background",
      locale: {
        skip: <p className="font-poppins font-semibold text-[13px]">Skip</p>,
      },
      // title: (
      //   <h1 className="text-blue-shade-100 text-left font-semibold text-xl font-poppins ml-[10px]">
      //     PROFILE
      //   </h1>
      // ),
    },
  ];

  const tourStyles = {
    options: {
      arrowColor: "#0077b6",
      backgroundColor: "#ffffff",
      overlayColor: "rgba(0, 0, 0, 0.6)",
      primaryColor: "#0077b6",
      textColor: "#000000",
      width: 350,
      zIndex: 1000,
      showArrow: false,
    },

    floaterStyles: {
      arrow: {
        display: "none",
      },
    },
    tooltipStyles: {
      color: "#000000",
      fontSize: "16px",
      padding: "20px",
      textAlign: "left !important",
    },
    buttonStyles: {
      primaryButton: {
        backgroundColor: "#004DFF !important", // Next button background color
        color: "#ffffff", // Next button text color
        borderRadius: "20px", // Next button border radius
        padding: "8px 16px", // Next button padding
        fontSize: "14px", // Next button font size
      },
      secondaryButton: {
        backgroundColor: "#ffffff", // Back button background color
        color: "#004DFF", // Back button text color
        borderRadius: "20px", // Back button border radius
        border: "2px solid #004DFF", // Back button border
        padding: "8px 16px", // Back button padding
        fontSize: "14px", // Back button font size
      },
      skipButton: {
        color: "#004DFF", // Skip button text color
        fontSize: "14px", // Skip button font size
        textDecoration: "underline", // Skip button text decoration
      },
    },
    titleStyles: {
      color: "blue !important",
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: "left !important",
    },
    tooltipContentStyles: {
      color: "#808080", // Change the content color to gray
      fontSize: "16px",
      textAlign: "left", // Add this line to align the content to the left
    },
  };

  const router = useRouter();
  const [storedDao, setStoredDao] = useState<string[]>([]);
  const pathname = usePathname();
  const [badgeVisiblity, setBadgeVisibility] = useState<boolean[]>(
    new Array(storedDao.length).fill(true)
  );
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();
  const sessionLoading = status === "loading";

  useEffect(() => {
    // console.log(session, sessionLoading, isConnected);
  }, [session, sessionLoading, isConnected, isPageLoading]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const localJsonData = JSON.parse(
        localStorage.getItem("visitedDao") || "{}"
      );

      const localStorageArr: string[] = Object.values(localJsonData);
      // console.log("Values: ", localStorageArr);

      setStoredDao(localStorageArr);
    }, 100);
    setIsPageLoading(false);
    return () => clearInterval(intervalId);
  }, []);

  const handleBadgeClick = (name: string) => {
    const localData = JSON.parse(localStorage.getItem("visitedDao") || "{}");

    delete localData[name];
    localStorage.setItem("visitedDao", JSON.stringify(localData));

    setStoredDao((prevState) => prevState.filter((item) => item[0] !== name));
    setBadgeVisibility(new Array(storedDao.length).fill(false));

    router.push(`/`);
  };

  const handleMouseOver = (index: number) => {
    const updatedVisibility = [...badgeVisiblity];
    updatedVisibility[index] = true;
    setBadgeVisibility(updatedVisibility);
  };

  const handleMouseOut = (index: number) => {
    const updatedVisibility = [...badgeVisiblity];
    updatedVisibility[index] = false;
    setBadgeVisibility(updatedVisibility);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    localStorage.setItem("tourSeen", JSON.stringify(true));
  };

  useEffect(() => {
    const tourSeen = JSON.parse(localStorage.getItem("tourSeen") || "false");
    setHasSeenTour(tourSeen);
    if (!tourSeen) {
      setIsTourOpen(true);
    }
  }, []);

  return (
    <>
      {!hasSeenTour && (
        <Joyride
          steps={tourSteps}
          run={isTourOpen}
          callback={(data) => {
            const { status } = data;
            const finishedStatuses = ["finished", "skipped"];
            if (finishedStatuses.includes(status)) {
              closeTour();
            }
          }}
          continuous={true}
          showSkipButton={true}
          hideCloseButton
          showProgress
          locale={{
            back: "Back",
            close: "Close",
            last: "Finish",
            next: "Next",
            skip: "Skip",
          }}
          styles={tourStyles}
        />
      )}
      <div className="py-6 h-full">
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col items-center gap-y-4 pb-5">
            <Image
              src={logo}
              alt={"image"}
              width={40}
              className="xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 logo bg-black rounded-full p-1"
            ></Image>
            <Tooltip
              content="DAOs"
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              <Link href={"/"}>
                <Image
                  priority
                  src={rocket}
                  alt={"image"}
                  width={40}
                  className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 dao ${
                    pathname.endsWith(`/`)
                      ? "border-white border-2 rounded-full"
                      : ""
                  }`}
                ></Image>
              </Link>
            </Tooltip>
            <Tooltip
              content="Office Hours"
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              <Link href={"/office-hours?hours=ongoing"}>
                <Image
                  priority
                  src={office}
                  alt={"image"}
                  width={40}
                  className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 office${
                    pathname.includes(`/office-hours`)
                      ? "border-white border-2 rounded-full"
                      : ""
                  }`}
                ></Image>
              </Link>
            </Tooltip>
            <Tooltip
              content="Sessions"
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              <Link href={"/sessions?active=recordedSessions"}>
                <Image
                  priority
                  src={sessionIcn}
                  alt={"image"}
                  width={40}
                  height={40}
                  className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 session ${
                    pathname.includes(`/sessions`)
                      ? "border-white border-2 rounded-full"
                      : ""
                  }`}
                ></Image>
              </Link>
            </Tooltip>
          </div>
          <div className="h-full">
            <div
              className={`flex flex-col items-center gap-y-4 py-7 h-full bg-blue-shade-300 rounded-2xl overflow-y-auto ${styles.scrollbar}`}
            >
              {storedDao ? (
                storedDao.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseOut={() => handleMouseOut(index)}
                  >
                    <Badge
                      isInvisible={!badgeVisiblity[index]}
                      content={<IoClose />}
                      className="p-[0.1rem] cursor-pointer border-blue-shade-300"
                      color="danger"
                      size="sm"
                      onClick={() => handleBadgeClick(data[0])}
                    >
                      <Tooltip
                        content={<div className="capitalize">{data[0]}</div>}
                        placement="right"
                        className="rounded-md bg-opacity-90"
                        closeDelay={1}
                      >
                        <Link href={`/${data[0]}?active=about`}>
                          <Image
                            key={index}
                            src={data[1]}
                            width={80}
                            height={80}
                            alt="image"
                            className={`w-10 h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full cursor-pointer ${
                              pathname.includes(`/${data[0]}`)
                                ? "border-white border-[2.5px]"
                                : ""
                            }`}
                            priority={true}
                          ></Image>
                        </Link>
                      </Tooltip>
                    </Badge>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-4 pt-5">
            <Tooltip
              content={<div className="capitalize">Git Book</div>}
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              <Link href={"https://docs.chora.club/"} target="_blank">
                <Image
                  src={gitbook}
                  alt={"image"}
                  width={40}
                  className="xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 gitbook"
                />
              </Link>
            </Tooltip>

            {!isConnected && !session ? (
              <Tooltip
                content={<div className="capitalize">Wallet</div>}
                placement="right"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                {isPageLoading || sessionLoading ? (
                  <Image
                    src={user}
                    alt={"image"}
                    width={40}
                    className="cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 "
                  />
                ) : (
                  <ConnectWallet />
                )}
              </Tooltip>
            ) : (
              <Tooltip
                content={<div className="capitalize">Profile</div>}
                placement="right"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                <Image
                  src={user}
                  alt={"image"}
                  width={40}
                  className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 profile`}
                  onClick={() => router.push(`/profile/${address}?active=info`)}
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
