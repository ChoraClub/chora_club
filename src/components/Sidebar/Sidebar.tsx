"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/assets/images/sidebar/favicon.png";
import rocket from "@/assets/images/sidebar/rocket.png";
import office from "@/assets/images/sidebar/office.png";
import wallet from "@/assets/images/sidebar/wallet.png";
import gitbook from "@/assets/images/sidebar/gitbook.png";
import user from "@/assets/images/sidebar/user.png";
import styles from "./sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { Badge, Tooltip } from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

function Sidebar() {
  const router = useRouter();
  const [storedDao, setStoredDao] = useState<string[]>([]);
  const pathname = usePathname();
  const [badgeVisiblity, setBadgeVisibility] = useState<boolean[]>(
    new Array(storedDao.length).fill(true)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const localJsonData = JSON.parse(
        localStorage.getItem("visitedDao") || "{}"
      );

      const localStorageArr: string[] = Object.values(localJsonData);
      // console.log("Values: ", localStorageArr);

      setStoredDao(localStorageArr);
    }, 100);
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
            content="Daos"
            placement="right"
            className="rounded-md bg-opacity-90"
            closeDelay={1}
          >
            <Image
              src={rocket}
              alt={"image"}
              width={40}
              className={`cursor-pointer `}
              onClick={() => router.push("/")}
            ></Image>
          </Tooltip>
          <Tooltip
            content="Office Hours"
            placement="right"
            className="rounded-md bg-opacity-90"
            closeDelay={1}
          >
            <Image
              src={office}
              alt={"image"}
              width={40}
              className={`cursor-pointer `}
              onClick={() => router.push("/office-hours")}
            ></Image>
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
                    <Image
                      key={index}
                      src={data[1]}
                      alt="image"
                      className={`w-10 h-10 rounded-full cursor-pointer ${
                        pathname.includes(`/${data[0]}`)
                          ? "border-white border-[2.5px]"
                          : ""
                      }`}
                      priority={true}
                      onClick={() =>
                        router.push(`/${data[0]}?active=delegatesList`)
                      }
                    ></Image>
                  </Tooltip>
                </Badge>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>

        <div className="flex flex-col items-center gap-y-4 pt-5">
          <Link href={"https://docs.chora.club/"} target="_blank">
            <Image src={gitbook} alt={"image"} width={40} />
          </Link>

          <Image src={wallet} alt={"image"} width={40}></Image>
          <Image src={user} alt={"image"} width={40}></Image>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
