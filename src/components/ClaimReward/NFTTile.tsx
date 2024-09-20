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
  };
}

function NFTTile({ nft }: NFTProps) {
  console.log(nft);
  return (
    <div className="border border-[#D9D9D9] sm:rounded-3xl">
      <div className="w-full h-44 sm:rounded-t-3xl bg-black object-cover object-center relative">
        <Image
          src={`https://gateway.lighthouse.storage/ipfs/${nft.thumbnail}`}
          alt={`NFT ${nft.id}`}
          layout="fill"
          objectFit="cover"
          className="sm:rounded-t-3xl"
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
    {nft.id.length > 20 ? `NFT ${nft.id.slice(0, 20)}...` : `NFT ${nft.id}`}
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

  </div>
</div>

    </div>
  );
}

export default NFTTile;
