"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import search from "@/assets/images/daos/search.png";
import user1 from "@/assets/images/daos/user1.png";
import user2 from "@/assets/images/daos/user2.png";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import { Pagination, Tooltip } from "@nextui-org/react";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const [isPageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const totalData: number = dao_info.length;
  const dataPerPage: number = 10;
  const totalPages: number = Math.ceil(totalData / dataPerPage);

  const fetchData = () => {
    const offset = (currentPage - 1) * dataPerPage;
    const end = offset + dataPerPage;
    const initialData = dao_info.slice(offset, end);
    setDaoInfo(initialData);
  };

  const handleSearchChange = (query: string) => {
    // setDaoInfo(daoInfo);
    setSearchQuery(query);

    const filtered = dao_info.filter(
      (item) =>
        item.name.toLowerCase().startsWith(query.toLowerCase()) ||
        item.address.startsWith(query)
    );

    // console.log("Filtered Data: ", filtered);

    if (query.length > 0 && filtered.length > 0) {
      setDaoInfo(filtered);
    } else {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
    setPageLoading(false);
  }, [currentPage, dataPerPage]);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Copied");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
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
          <span className="flex items-center bg-black rounded-full px-5 py-2">
            <Image src={search} alt="search" width={20} />
          </span>
        </div>

        <div className="pe-10">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
          />
        </div>
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
                className="px-5 py-7 rounded-2xl"
              >
                <div className="flex justify-center cursor-pointer" onClick={() => router.push(`/daos/optimism/${daos.name}`)}>
                  <Image
                    src={daos.img}
                    alt="Image not found"
                    width={80}
                    className="rounded-full"
                  ></Image>
                </div>

                <div className="text-center">
                  <div className="py-3">
                    <div
                      className="font-semibold cursor-pointer"
                      onClick={() => router.push(`/daos/optimism/${daos.name}`)}
                    >
                      {daos.name}
                    </div>
                    <div className="flex justify-center items-center gap-2 pb-4 pt-2">
                      {daos.address.substring(0, 5)}...
                      {daos.address.substring(daos.address.length - 4)}
                      <Tooltip
                        content="Copy"
                        placement="right"
                        closeDelay={1}
                        showArrow
                      >
                        <span className="cursor-pointer">
                          <IoCopy onClick={() => handleCopy(daos.address)} />
                        </span>
                      </Tooltip>
                    </div>
                    <div className="text-sm border border-[#D9D9D9] py-2 px-2 rounded-lg">
                      <span className="text-blue-shade-200 font-semibold">
                        {daos.value} &nbsp;
                      </span>
                      Tokens Delegated
                    </div>
                  </div>
                </div>
                <Toaster
                  toastOptions={{
                    style: {
                      fontSize: "14px",
                      backgroundColor: "#0238B3",
                      color: "#fff",
                      boxShadow: "none",
                      borderRadius: "50px",
                      padding: "3px 5px",
                    },
                  }}
                />
              </div>
            ))
          )
        ) : (
          <div className="col-span-12 flex flex-col justify-center items-center">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DelegatesList;
