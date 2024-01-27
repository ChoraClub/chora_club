"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import search from "@/assets/images/daos/search.png";
import user1 from "@/assets/images/daos/user1.png";
import user2 from "@/assets/images/daos/user2.png";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
import { Oval } from "react-loader-spinner";

interface Type {
  name: string;
  address: string;
  value: string;
  img: StaticImageData;
}

function DelegatesList() {
  const dao_info = [
    {
      name: "lindaxie.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "Olimpio.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "aaa.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "bbb.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "ccc.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "ddd.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "eee.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "fff.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "ggg.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "hhh.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "iii.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "jjj.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "kkk.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "lll.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "mmm.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "nnn.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "ooo.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "ppp.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "qqq.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "rrr.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "sss.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "ttt.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "uuu.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "vvv.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "www.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "xxx.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
    {
      name: "yyy.eth",
      address: "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032",
      value: "5.02m",
      img: user1,
    },
    {
      name: "zzz.eth",
      address: "0xA631a70dD6E5282A8c84edCbCd5A955469b9095d",
      value: "3.01m",
      img: user2,
    },
  ];

  const [daoInfo, setDaoInfo] = useState<Array<Type>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 5;
  const [page, setPage] = useState(2);
  const [dataLoading, setDataLoading] = useState(true);
  const [isPageLoading, setPageLoading] = useState(true);

  const handleSearchChange = (query: string) => {
    // setDaoInfo(daoInfo);
    setSearchQuery(query);

    const filtered = dao_info.filter(
      (item) =>
        item.name.toLowerCase().startsWith(query.toLowerCase()) ||
        item.address.startsWith(query)
    );

    console.log("Filtered Data: ", filtered);

    setDaoInfo(filtered);
    window.removeEventListener("scroll", handleScroll);
  };

  const fetchData = () => {
    setDataLoading(false);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    if (start < dao_info.length) {
      console.log("Start: " + start + "End: " + end);

      const additionalData = dao_info.slice(start, end);
      setPage(page + 1);
      console.log("additionalData: ", additionalData);
      setDaoInfo((prevData) => [...prevData, ...additionalData]);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchData();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  useEffect(() => {
    setDataLoading(false);
    setPageLoading(false);
    setDaoInfo(dao_info.slice(0, pageSize));
  }, []);

  return (
    <div>
      <div
        style={{ background: "rgba(238, 237, 237, 0.36)" }}
        className="flex border-[0.5px] border-black w-fit rounded-full my-3 font-poppins"
      >
        <input
          type="text"
          placeholder="Search"
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="pl-5 rounded-full outline-none"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        ></input>
        <span className="flex items-center bg-black rounded-full px-6 py-3">
          <Image src={search} alt="search" width={20} />
        </span>
      </div>

      <div className="grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10 py-8 pe-10 font-poppins">
        {isPageLoading ? (
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        ) : daoInfo.length > 0 ? (
          dataLoading ? (
            <Oval
              visible={true}
              height="80"
              width="80"
              color="#0500FF"
              secondaryColor="#cdccff"
              ariaLabel="oval-loading"
            />
          ) : (
            daoInfo.map((daos, index) => (
              <div
                key={daos.name}
                style={{ boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)" }}
                className="px-5 py-7 rounded-2xl cursor-pointer"
                // onClick={() => handleClick(daos.name, daos.img)}
              >
                <div className="flex justify-center">
                  <Image
                    src={daos.img}
                    alt="Image not found"
                    width={80}
                    className="rounded-full"
                  ></Image>
                </div>

                <div className="text-center">
                  <div className="py-3">
                    <div className="font-semibold">{daos.name}</div>
                    <div className="flex justify-center items-center gap-2 pb-4 pt-2">
                      {daos.address.substring(0, 5)}...
                      {daos.address.substring(daos.address.length - 4)}
                      <Tooltip
                        content="Copy"
                        placement="right"
                        closeDelay={1}
                        showArrow
                      >
                        <span>
                          <IoCopy onClick={() => copy(daos.address)} />
                        </span>
                      </Tooltip>
                    </div>
                    <span className="text-sm border border-[#D9D9D9] py-2 px-2 rounded-lg mt-3">
                      <span className="text-blue-shade-200 font-semibold">
                        {daos.value}
                      </span>
                      Tokens Delegated
                    </span>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          <div className="pl-3 text-lg font-medium">No such user available</div>
        )}
      </div>
    </div>
  );
}

export default DelegatesList;
