"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/assets/images/sidebar/favicon.png";
import rocket from "@/assets/images/sidebar/rocket.png";
import sessionIcn from "@/assets/images/sidebar/office.png";
import office from "@/assets/images/sidebar/Office hour (1).png";
import wallet from "@/assets/images/sidebar/wallet.png";
import gitbook from "@/assets/images/sidebar/gitbook.png";
import user from "@/assets/images/sidebar/user.png";
import styles from "./sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { Badge, Tooltip } from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { ConnectWallet } from "../ConnectWallet/ConnectWallet";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";

function Sidebar() {
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

  return (
    <div className="py-6 h-full">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col items-center gap-y-4 pb-5">
          <Image src={logo} alt={"image"} width={40}></Image>
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
                className={`cursor-pointer ${
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
                className={`cursor-pointer  ${
                  pathname.includes(`/office-hours`)
                    ? "border-white border-2 rounded-full"
                    : ""
                }`}
              ></Image>
            </Link>
          </Tooltip>
          <Tooltip
            content="Available Delegates"
            placement="right"
            className="rounded-md bg-opacity-90"
            closeDelay={1}
          >
            <Link href={"/available-delegates"}>
              <Image
                priority
                src={sessionIcn}
                alt={"image"}
                width={40}
                height={40}
                className={`cursor-pointer  ${
                  pathname.includes(`/available-delegates`)
                    ? "border-white border-2 rounded-full"
                    : ""
                }`}
              ></Image>
            </Link>
          </Tooltip>
        </div>

        <div
          className={`flex flex-col items-center gap-y-4 py-7 bg-blue-shade-300 rounded-2xl h-svh overflow-y-auto ${styles.scrollbar}`}
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
                    <Link href={`/${data[0]}?active=delegatesList`}>
                      <Image
                        key={index}
                        src={data[1]}
                        width={80}
                        height={80}
                        alt="image"
                        className={`w-10 h-10 rounded-full cursor-pointer ${
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

        <div className="flex flex-col items-center gap-y-4 pt-5">
          <Tooltip
            content={<div className="capitalize">Git Book</div>}
            placement="right"
            className="rounded-md bg-opacity-90"
            closeDelay={1}
          >
            <Link href={"https://docs.chora.club/"} target="_blank">
              <Image src={gitbook} alt={"image"} width={40} />
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
                  className="cursor-pointer"
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
                className={`cursor-pointer`}
                onClick={() => router.push(`/profile/${address}?active=info`)}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
