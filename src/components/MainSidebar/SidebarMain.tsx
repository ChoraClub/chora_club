"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import logo from "@/assets/images/daos/CCLogo.png";
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
import { IoMdNotifications } from "react-icons/io";
import dummy from "@/assets/images/daos/user2.png";

import { Poppins } from "next/font/google";
import { MdImportantDevices } from "react-icons/md";
import NotificationIconComponent from "../Notification/NotificationIconComponent";
import { IoIosRocket } from "react-icons/io";
import { FaBusinessTime, FaUser } from "react-icons/fa6";
import { SiGitbook, SiGoogleclassroom } from "react-icons/si";
import { PiUsersThreeFill } from "react-icons/pi";
import {useSidebar} from "../../app/hooks/useSidebar"
import { BiSolidMessageSquareAdd } from "react-icons/bi";
// import { useMediaQuery } from 'next/media-query';

function Sidebar() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  // const [isClient, setIsClient] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const {
    storedDao,
    handleMouseOver,
    handleMouseOut,
    handleBadgeClick,
    badgeVisiblity,
    isPageLoading,
    session,
    status,
    address,
    isConnected,
  } = useSidebar();
  const [isLgScreen, setIsLgScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsLgScreen(mediaQuery.matches);
    const handleMediaQueryChange = () => {
      setIsLgScreen(mediaQuery.matches);
    };
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);


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
  const pathname = usePathname();
  const sessionLoading = status === "loading";
  useEffect(() => {
    // console.log(session, sessionLoading, isConnected);
  }, [session, sessionLoading, isConnected, isPageLoading]);
  
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
      {isLgScreen && !hasSeenTour && (
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
            <Link href={"https://chora.club/"} target="_blank">
              <Image
                src={logo}
                alt={"image"}
                width={40}
                className="xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 logo bg-black rounded-full p-1"
              ></Image>
            </Link>
            <Tooltip
              // content="DAOs"
              content={<div className={`${styles.customTooltip}`}>DAOs</div>}
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              {/* <Link href={"/"}> */}
              <Link
                href={"/"}
                className={`dao cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center border border-white bg-blue-shade-800 w-10 h-10 ${
                  styles.icon3d
                } ${
                  pathname.endsWith(`/`)
                    ? "border-white border-2 rounded-full"
                    : ""
                }`}
              >
                <IoIosRocket
                  className={`size-5 text-white ${styles.iconInner}`}
                />
              </Link>
              {/* </Link> */}
            </Tooltip>
            <Tooltip
              content={
                <div className={`${styles.customTooltip}`}>Office Hours</div>
              }
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              {/* <Link href={"/office-hours?hours=ongoing"}> */}
              <Link
                href={"/office-hours?hours=ongoing"}
                className={`office cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center border border-white bg-blue-shade-800 w-10 h-10 ${
                  styles.icon3d
                } ${
                  pathname.includes(`/office-hours`)
                    ? "border-white border-2 rounded-full"
                    : ""
                }`}
              >
                <FaBusinessTime
                  className={`size-5 text-white ${styles.iconInner}`}
                />
              </Link>
              {/* </Link> */}
            </Tooltip>
            <Tooltip
              content={
                <div className={`${styles.customTooltip}`}>Sessions</div>
              }
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              {/* <Link href={"/sessions?active=recordedSessions"}> */}
              <Link
                href={"/sessions?active=recordedSessions"}
                className={`session cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center border border-white bg-blue-shade-800 w-10 h-10 ${
                  styles.icon3d
                } ${
                  pathname.includes(`/sessions`)
                    ? "border-white border-2 rounded-full"
                    : ""
                }`}
              >
                <PiUsersThreeFill
                  className={`size-5 text-white ${styles.iconInner}`}
                />
              </Link>
              {/* </Link> */}
            </Tooltip>
            <Tooltip
              content={<div className={`${styles.customTooltip}`}>Invite</div>}
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              {/* <Link href={"/sessions?active=recordedSessions"}> */}
              <Link
                href={"/invite"}
                className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center border border-white bg-blue-shade-800 w-10 h-10 ${
                  styles.icon3d
                } ${
                  pathname.includes(`/invite`)
                    ? "border-white border-2 rounded-full"
                    : ""
                }`}
              >
                <BiSolidMessageSquareAdd
                  className={`size-5 text-white ${styles.iconInner}`}
                />
              </Link>
              {/* </Link> */}
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
                        content={
                          <div className={`${styles.customTooltip} capitalize`}>
                            {data[0]}
                          </div>
                        }
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
                              styles.icon3d
                            } ${
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
            <NotificationIconComponent />
            <Tooltip
              content={
                <div className={`${styles.customTooltip}`}>Git Book</div>
              }
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              {/* <Link href={"https://docs.chora.club/"} target="_blank"> */}
              <Link
                href={"https://docs.chora.club/"}
                target="_blank"
                className={`gitbook cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center bg-white w-10 h-10 ${styles.icon3d} ${styles.whiteBg}`}
              >
                <SiGitbook
                  className={`size-5 text-blue-shade-200 ${styles.iconInner}`}
                />
              </Link>
              {/* </Link> */}
            </Tooltip>

            {!isConnected && !session ? (
              <Tooltip
                content={
                  <div className={`${styles.customTooltip}`}>Wallet</div>
                }
                placement="right"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                {isPageLoading || sessionLoading ? (
                  <div
                    className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center bg-white w-10 h-10 ${styles.icon3d} ${styles.whiteBg}`}
                  >
                    <FaUser
                      className={`size-5 text-blue-shade-200 ${styles.iconInner}`}
                    />
                  </div>
                ) : (
                  <ConnectWallet />
                )}
              </Tooltip>
            ) : (
              <Tooltip
                content={
                  <div className={`${styles.customTooltip}`}>Profile</div>
                }
                placement="right"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                <div
                  className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center bg-white w-10 h-10 ${styles.icon3d} ${styles.whiteBg}`}
                  onClick={() => router.push(`/profile/${address}?active=info`)}
                >
                  <FaUser
                    className={`size-5 text-blue-shade-200 ${styles.iconInner}`}
                  />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
