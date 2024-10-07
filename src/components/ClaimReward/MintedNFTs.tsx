"use client";
import React, { useEffect, useState } from "react";
import { gql } from "urql";
import { nft_client } from "@/config/staticDataUtils";
import NFTTile from "./NFTTile";
import { getRelativeTime } from "../../utils/getRelativeTime";
import { getTimestampFromBlock } from "../../utils/getTimestampFromBlock";
import { useAccount } from "wagmi";
import { useConnection } from "@/app/hooks/useConnection";
import { CustomDropdown } from "./CustomDropdown";
import toast from "react-hot-toast";

const MINTED_NFTS = gql`
  query MyQuery($address: String!) {
    token1155Holders(
      orderBy: lastUpdatedBlock
      orderDirection: desc
      where: { user: $address }
    ) {
      balance
      user
      lastUpdatedBlock
      tokenAndContract {
        metadata {
          image
          name
          rawJson
        }
        txn {
          network
        }
        address
      }
    }
  }
`;

function MintedNFTs() {
  const { address } = useAccount();
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      fetchNFTs();
    }
  }, [address]);

  const fetchNFTs = async () => {
    try {
      setDataLoading(true);
      const result = await nft_client
        .query(MINTED_NFTS, { address: address })
        .toPromise();

      const nfts = await Promise.all(
        result?.data.token1155Holders?.map(async (nft: any) => {
          // Check if tokenAndContract and metadata exist and are not null
          if (!nft?.tokenAndContract?.metadata?.rawJson) {
            console.warn("Missing metadata for NFT:", nft);
            return null; // Skip this NFT if metadata or rawJson is missing
          }

          const jsondata = JSON.parse(nft.tokenAndContract.metadata.rawJson);

          // Get timestamp from block number
          const timestamp = await getTimestampFromBlock(nft.lastUpdatedBlock);

          return {
            id: nft.tokenAndContract.metadata.name || "Unknown",
            thumbnail: nft.tokenAndContract.metadata.image || "",
            balance: nft.balance,
            contract: nft.tokenAndContract.address,
            network: nft.tokenAndContract.txn.network,
            // Get the relative time using the fetched timestamp
            time: getRelativeTime(timestamp),
            host: jsondata?.attributes?.[0]?.value,
          };
        }) || []
      );

      // Filter out any null results in case of missing data
      const validNfts = nfts.filter((nft) => nft !== null);

      setMintedNFTs(validNfts);
      setDataLoading(false);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setDataLoading(false);
    }
  };

  const handleSelectChange = (selectedOption: string) => {
    console.log(`Selected chain: ${selectedOption}`);
    if (selectedOption === "Optimism" || selectedOption === "Arbitrum") {
      toast("Coming soon!");
    }
  };

  return (
    <div className="bg-gray-50 hover:bg-gray-100 transition duration-300 rounded-lg shadow-md p-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Minted NFTs</h2>
        <CustomDropdown
          options={["Optimism", "Arbitrum", "Arbitrum Sepolia"]}
          onChange={handleSelectChange}
        />
      </div>

      {dataLoading ? (
        <>Loading...</>
      ) : mintedNFTs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-10 py-8 font-poppins">
            {mintedNFTs.map((nft) => (
              <NFTTile
                key={nft.id}
                nft={{
                  id: nft.id,
                  thumbnail: nft.thumbnail, // Ensure correct property
                  contract: nft.contract,
                  network: nft.network,
                  time: nft.time,
                  host: nft.host,
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>No NFTs minted yet. Start creating your collection!</p>
        </div>
      )}
    </div>
  );
}

export default MintedNFTs;
