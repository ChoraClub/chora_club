"use client";
import { IoClose, IoMenu } from "react-icons/io5";
import React, { useState , useRef, useEffect} from "react";
import Link from "next/link";
import { HiArrowSmLeft } from "react-icons/hi";
import { IoIosRocket, IoMdNotifications } from "react-icons/io";
import { SiGitbook } from "react-icons/si";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaBusinessTime, FaUser } from "react-icons/fa6";
import { BiSolidMessageSquareAdd, BiSolidWallet } from "react-icons/bi";
import { FiArrowUpRight } from "react-icons/fi";
import {useSidebar} from "../../app/hooks/useSidebar"
import { Badge, Tooltip, VisuallyHidden } from "@nextui-org/react";
import Image from "next/image";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ConnectWallet } from "../ConnectWallet/ConnectWallet";
import cclogo from "@/assets/images/daos/CCLogo.png"


const SidebarMainMobile = () => {  
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
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
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    
  const sessionLoading = status === "loading";
    
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSidebarClick = (event: React.MouseEvent) => {
    // Prevent the click event from propagating to parent elements
    event.stopPropagation();
    toggleSidebar();
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 flex items-center w-full border-b-1 p-1 bg-white">

      <div
        className="bg-blue-shade-200 text-white text-lg font-bold p-1.5 rounded-full cursor-pointer my-4 mx-4"
        onClick={toggleSidebar}
        >
        <IoMenu className="size-6"/>
      </div>
      <div className="border border-l-0 h-16"></div>
      <Link className="ml-4 text-black font-semibold text-[32px] font-poppins flex items-center" href={"https://chora.club/"}>Chora <span className="text-blue-shade-200">Club</span></Link>
        </div>

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-full font-poppins sm:w-72 bg-blue-shade-200 text-white transform z-10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        onClick={handleSidebarClick}
      >
        <div className="">
          <div className="flex absolute top-4 left-4 items-center">
          <button
            className=" text-white border-white border rounded-full p-1.5"
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
          >
            <HiArrowSmLeft className="size-6" />
          </button>
        <Link className="ml-5 text-black font-semibold text-[32px] font-poppins" href={"https://chora.club/"}>Chora <span className="text-white">Club</span></Link>
        </div>
      
          <nav className="mt-20 mr-6">
            <ul className="">
              <li>
                <Link href="/" className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IoIosRocket className="size-5 mr-4" />
                      <span>Explore DAOs</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
                <div className="h-[0.1px] w-full bg-white"></div>
              </li>
              <li>
                <Link
                  href={"/office-hours?hours=ongoing"}
                  className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaBusinessTime className="size-5 mr-4" />
                      <span>Office Hours</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
                <div className="h-[0.1px] w-full bg-white"></div>
              </li>
              <li>
                <Link
                  href={"/sessions?active=recordedSessions"}
                  className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <PiUsersThreeFill className="size-5 mr-4" />
                      <span>Sessions</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
                <div className="h-[0.1px] w-full bg-white"></div>
              </li>
              <li>
                <Link
                  href={"/invite"}
                  className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BiSolidMessageSquareAdd className="size-5 mr-4" />
                      <span>Invite</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
                <div className="h-[0.1px] w-full bg-white"></div>
              </li>
              <li>
                <Link
                  href={"/notifications?active=all"}
                  className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IoMdNotifications className="size-5 mr-4" />
                      <span>Notification</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
                <div className="h-[0.1px] w-full bg-white"></div>
              </li>
              <li>
                <Link
                  href={"https://docs.chora.club/"}
                  target="_blank"
                  className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <SiGitbook className="size-5 mr-4" />
                      <span>Git Book</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
                <div className="h-[0.1px] w-full bg-white"></div>
              </li>
              
                {/* <Link href="#" className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BiSolidWallet className="size-5 mr-4" />
                      <span>Wallet</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                </Link> */}
                {!isConnected && !session ? (
                    isPageLoading || sessionLoading ? (
                        <li>
                        <div className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100">
                        <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaUser className="size-5 mr-4" />
                      <span>Profile</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                  </div>
                  </li>
                ):(
                    <li>                    
                        <ConnectWallet />
                    </li>
                )
            ):(
                <li>
                    <Link href={`/profile/${address}?active=info`} className="block py-4 pl-6 sm:py-5 hover:bg-blue-shade-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaUser className="size-5 mr-4" />
                      <span>Profile</span>
                    </div>
                    <FiArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
                </li>
                    )}
             
            </ul>
          </nav>
          {storedDao.length>0 && (
            <>
          <div className=" flex flex-col w-[90%] gap-2 absolute bottom-4 mx-[5%] ">
          <h1 className="text-white font-semibold text-lg">Recently Viewed DAOs</h1>
          <div className="flex items-center gap-4 rounded-xl bg-blue-shade-300 p-4">
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
                        placement="bottom"
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
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarMainMobile;
