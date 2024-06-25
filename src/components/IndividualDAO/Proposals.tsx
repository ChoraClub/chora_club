"use client";
import { useRouter } from "next/navigation";
import style from "./Proposals.module.css";
import Image from "next/image";
import opLogo from "@/assets/images/daos/op.png";
import { LuDot } from "react-icons/lu";
import user from "@/assets/images/daos/user1.png";
import chain from "@/assets/images/daos/chain.png";
import { Tooltip } from "@nextui-org/react";

function Proposals({ props }: { props: string }) {
  const router = useRouter();

  const handleClick = (index: any) => {
    router.push(`/${props}/Proposals/${index}`);
  };

  return (
    <>
      <div className=" mr-16 rounded-[2rem] mt-4">
        {Array.from({ length: 5 }).map((_, index) => (
          // <Link href={`/proposals/${index}`} key={index}>
          <div
            key={index}
            className="flex p-4 text-lg mb-2 gap-5 bg-gray-100 hover:bg-gray-50 rounded-3xl transition-shadow duration-300 ease-in-out shadow-lg cursor-pointer items-center"
            onClick={() => handleClick(index)}
          >
            <div className="flex basis-1/2">
              <Image src={opLogo} alt="" className="size-10 mx-5 " />
              <div>
                <p className="text-base font-medium">
                  Election of STEP Program Management Lorem ipsum dolor sit amet{" "}
                </p>
                <div className="flex gap-1">
                  <Image src={user} alt="" className="size-4" />
                  <p className="flex text-xs font-normal items-center">
                    {" "}
                    0xBb4c...4adE31 <LuDot /> Created At 10 May 2025
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-around items-center basis-1/2">
              <Tooltip
                showArrow
                content={<div className="font-poppins">OnChain</div>}
                placement="bottom"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                <div>
                  <Image src={chain} alt="" className="size-8 " />
                </div>
              </Tooltip>

              <div className="text-base font-medium">1500 Voters</div>

              <div className="rounded-full bg-[#dbf8d4] border border-[#639b55] flex items-end justify-center text-[#639b55] text-xs h-fit  py-0.5 font-medium px-2">
                SUCCEED
              </div>
              {/* <div className='rounded-full bg-[#fad2d2] border border-[#b25d5d] flex items-center justify-center text-[#b25d5d] text-xs h-fit  py-0.5 font-medium px-2'>DEFEATED</div> */}

              <div className="bg-[#dbf8d4] border border-[#639b55] py-0.5 px-2 text-[#639b55] rounded-md text-sm font-medium flex justify-center items-center">
                33.5M For
              </div>
              {/* <div className='bg-[#fad2d2] border border-[#b25d5d] py-0.5 px-2 text-[#b25d5d] rounded-md text-sm font-medium flex justify-center items-center'>33.5M Against</div> */}

              {/* <div className='rounded-full bg-[#dbf8d4] border border-[#639b55] flex items-center justify-center text-[#639b55] text-xs h-fit  py-0.5 font-medium px-2'>ACTIVE</div> */}
              <div className="rounded-full bg-[#f4d3f9] border border-[#77367a] flex items-center justify-center text-[#77367a] text-xs h-fit  py-0.5 font-medium px-2">
                CLOSED
              </div>
            </div>
          </div>
          // </Link>
        ))}
      </div>
    </>
  );
}

export default Proposals;
