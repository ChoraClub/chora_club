"use client";

import Image from "next/image";
import React from "react";
import logo from "@/assets/images/sidebar/favicon.png";
import rocket from "@/assets/images/sidebar/rocket.png";
import office from "@/assets/images/sidebar/office.png";
import wallet from "@/assets/images/sidebar/wallet.png";
import user from "@/assets/images/sidebar/user.png";
import op from "@/assets/images/daos/op.png";
import arb from "@/assets/images/daos/arbitrum.jpg";
import styles from "./sidebar.module.css";
import { useRouter } from "next/navigation";

function Sidebar() {
  const router = useRouter();

  return (
    <div className="py-6 h-full">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col items-center gap-y-4 pb-5">
          <Image src={logo} alt={"image"} width={40}></Image>
          <Image
            src={rocket}
            alt={"image"}
            width={40}
            className={`cursor-pointer `}
            // onClick={() => router.push("/")}
          ></Image>
          <Image
            src={office}
            alt={"image"}
            width={40}
            className={`cursor-pointer `}
            // onClick={() => router.push("/office-hours")}
          ></Image>
        </div>

        <div
          className={`flex flex-col items-center gap-y-4 py-7 bg-blue-shade-300 rounded-2xl h-svh overflow-y-auto ${styles.scrollbar}`}
        >
          <Image
            src={op}
            alt="image"
            className="w-10 h-10 rounded-full cursor-pointer"
          ></Image>
          <Image
            src={arb}
            alt="image"
            className="w-10 h-10 rounded-full cursor-pointer"
          ></Image>
        </div>

        <div className="flex flex-col items-center gap-y-4 pt-5">
          <Image src={wallet} alt={"image"} width={40}></Image>
          <Image src={user} alt={"image"} width={40}></Image>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
