"use client";
import React, { useEffect, useState } from "react";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arb.png";
import Image from "next/image";
import { HiGift } from "react-icons/hi";
import { gql } from "urql";
import { nft_client } from "@/config/staticDataUtils";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { Address, formatEther, parseEther } from "viem";
import {
  protocolRewardsABI,
  protocolRewardsAddress,
} from "chora-protocol-deployments";
import { fetchEnsNameAndAvatar } from "@/utils/ENSUtils";
import { truncateAddress } from "@/utils/text";
import { useConnection } from "@/app/hooks/useConnection";
import Link from "next/link";
import { Gift, Loader2 } from "lucide-react";

interface Reward {
  platform: string;
  amount: string;
  value: string;
  logo: any;
}

const REWARD_QUERY = gql`
  query MyQuery($address: String!) {
    rewardsPerUsers(where: { address: $address }) {
      address
      amount
      id
      withdrawn
    }
  }
`;

function TotalRewards() {
  const {
    isConnected: isUserConnected,
    isSessionLoading,
    isPageLoading,
    isReady,
  } = useConnection();
  const [totalRewards, setTotalRewards] = useState<any>({
    amount: "0.0",
    value: "$0.0",
  });
  const { address } = useAccount();
  const chainId = useChainId();
  const [claimableRewards, setClaimableRewards] = useState<Reward[]>([]);
  const [ethToUsdConversionRate, setEthToUsdConversionRate] = useState(0);
  const [displayEnsName, setDisplayEnsName] = useState<any>();
  const {
    data: hash,
    writeContract,
    isPending,
    isError,
    writeContractAsync,
  } = useWriteContract();
  const [claimingReward, setClaimingReward] = useState<boolean>(false);

  const nonZeroRewards = claimableRewards.filter(
    (reward) => parseFloat(reward.amount) > 0
  );

  const fetchReward = async () => {
    const data = await nft_client
      .query(REWARD_QUERY, { address: address })
      .toPromise();
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const coingeckoData = await response.json();
    // console.log("here data is ", data, coingeckoData.ethereum.usd);
    setEthToUsdConversionRate(coingeckoData.ethereum.usd);
    if (data.data.rewardsPerUsers.length < 1) {
      setTotalRewards({ amount: "0.0 ", value: "$0.0" });
      return;
    }
    const total =
      data?.data.rewardsPerUsers?.map((reward: any) => ({
        amount: (reward.amount / 10 ** 18).toFixed(5),
        value: `$${(
          (reward.amount * coingeckoData.ethereum.usd) /
          10 ** 18
        ).toFixed(2)}`,
      })) || [];
    setTotalRewards(total[0]);
    // console.log("total reward", total)
    const Rewards =
      data?.data.rewardsPerUsers?.map((reward: any) => ({
        platform: reward.id, // Use the ID or some other property for platform
        amount: ((reward.amount - reward.withdrawn) / 10 ** 18).toFixed(5),
        value: `$${(
          (reward.amount * coingeckoData.ethereum.usd) /
          10 ** 18
        ).toFixed(2)}`,
        logo: reward.id.includes("op") ? oplogo : arblogo, // Example condition to set logo
      })) || [];
    setClaimableRewards(Rewards);
    // console.log(claimableRewards);
  };
  useEffect(() => {
    if (address) {
      fetchReward();

      const fetchEnsName = async () => {
        const ensName = await fetchEnsNameAndAvatar(address);
        const truncatedAddress = truncateAddress(address);
        setDisplayEnsName(
          ensName?.ensName ? ensName.ensName : truncatedAddress
        );
      };
      fetchEnsName();
    }
  }, [address]);

  const { data: accountBalance, isLoading } = useReadContract({
    abi: protocolRewardsABI,
    address:
      protocolRewardsAddress[chainId as keyof typeof protocolRewardsAddress],
    functionName: "balanceOf",
    args: [address as Address],
  });

  const recipient = address;
  const withdrawAmount = BigInt(accountBalance || 0) / BigInt(2);

  // withdraw amount is half of the balance
  const rewardBalanceInETH: any = Number(
    formatEther(accountBalance || BigInt(0))
  ).toFixed(5);
  const rewardBalanceInUSD: any = (
    rewardBalanceInETH * ethToUsdConversionRate
  ).toFixed(2);

  // async function submit() {
  //   // write to the withdraw function on the ProtocolRewards contract
  //   if (!recipient) {
  //     console.error("Recipient address is undefined.");
  //     return;
  //   }
  //   writeContract({
  //     abi: protocolRewardsABI,
  //     address:
  //       protocolRewardsAddress[chainId as keyof typeof protocolRewardsAddress],
  //     functionName: "withdraw",
  //     args: [recipient!, withdrawAmount],
  //   });
  // }
  async function handleClaim() {
    if (!recipient) {
      console.error("Recipient address is undefined.");
      return;
    }
    setClaimingReward(true);

    console.log("setClaimingReward(true);");
    try {
      const result = await writeContractAsync({
        abi: protocolRewardsABI,
        address:
          protocolRewardsAddress[
            chainId as keyof typeof protocolRewardsAddress
          ],
        functionName: "withdraw",
        args: [recipient!, withdrawAmount],
      });
      console.log("result:::", result);

      await fetchReward();
    } catch (error) {
      console.error("Error claiming reward:", error);
      setClaimingReward(false);
    } finally {
      setClaimingReward(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 font-poppins">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold flex items-center mb-4">
              <Gift className="mr-2" size={24} />
              Total Rewards
            </h2>
            <div className="mt-4">
              <span className="text-4xl font-extrabold">
                {totalRewards?.amount} ETH
              </span>
              <p className="text-lg opacity-80 mt-2">
                ≈ {totalRewards?.value} USD
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Claim Rewards</h2>
            {nonZeroRewards.length > 0 ? (
              <div className="space-y-4">
                {nonZeroRewards.map((reward, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <Image
                          src={reward.logo}
                          alt="logo"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <span className="font-medium">{displayEnsName}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {rewardBalanceInETH} ETH
                      </div>
                      <div className="text-sm text-gray-500">
                        ≈ ${rewardBalanceInUSD} USD
                      </div>
                    </div>
                    <button
                      onClick={handleClaim}
                      disabled={claimingReward === true}
                      className={`bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-w-[100px] ${
                        claimingReward === true
                          ? "opacity-75 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {claimingReward === true ? (
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      ) : (
                        "Claim"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <HiGift size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No rewards available to claim at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={"https://docs.chora.club/earn-rewards/mint-referral-reward"}
          target="_blank"
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
        >
          Learn more about Referral Rewards
        </Link>
      </div>
    </>
  );
}

export default TotalRewards;
