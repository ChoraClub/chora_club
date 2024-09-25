import React from "react";
import Image from "next/image";
import styles from "../ComponentUtils/RecordedSessionsTile.module.css";
import logo from "@/assets/images/daos/CCLogo.png";
import { RiExternalLinkLine } from "react-icons/ri";
import Link from "next/link";
interface NFTProps {
  nft: {
    id: any;
    thumbnail: any;
    contract: any;
    network: any;
    time: any;
    host: any;
  };
}

function NFTTile({ nft }: NFTProps) {
  const cid = nft.thumbnail.split("ipfs://")[1];
  return (
    <div className="border border-[#D9D9D9] sm:rounded-3xl ">
      <div className="w-full h-56 sm:rounded-t-3xl bg-black object-cover object-center relative">
        <Image
          // src={`https://ipfs.io/ipfs/${cid}`}
          src={`https://gateway.lighthouse.storage/ipfs/${cid}`}
          alt={`NFT ${nft.id}`}
          height={800}
          width={1000}
          // layout="fill"
          // objectFit="cover"
          // priority
          // quality={100}
          className="sm:rounded-t-3xl object-cover w-full h-56"
        />
        <div className="absolute top-2 right-2 bg-black rounded-full">
          <Image src={logo} alt="logo" width={24} height={24} />
        </div>
      </div>
      <div className="px-4 py-2">
        <div
          className={`text-sm sm:text-base font-semibold py-1 ${styles.truncate}`}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
          }}
        >
          <div className="flex items-center">
            <span className="flex-1 min-w-0">
              {nft.id.length > 20
                ? `NFT ${nft.id.slice(0, 20)}...`
                : `NFT ${nft.id}`}
            </span>
            <span className="mx-1 flex-shrink-0">
              <Link
                href={`https://sepolia.arbiscan.io/address/${nft.contract}`}
                target="_blank"
                className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <RiExternalLinkLine />
              </Link>
            </span>
          </div>
          <div className="flex item-center text-xs">
            <span>{nft.network}</span>
            <span className="mx-1">•</span>
            <span>{nft.time}</span>
          </div>
          <div className="text-xs text-gray-500">
            {nft && nft.host ? (
              <>
                Host :{" "}
                <Link
                  href={`/${nft.network}/${nft.host}?active=info`}
                  onClick={(event: any) => {
                    event.stopPropagation();
                  }}
                  className="cursor-pointer hover:text-blue-shade-200 ml-1"
                >
                  <span>
                    {" "}
                    {nft.host.slice(0, 6)}...{nft.host.slice(-4)}
                  </span>
                </Link>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTTile;
