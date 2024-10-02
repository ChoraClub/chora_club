import { isAddress } from "viem";
import { cache } from "react";
import { truncateAddress } from "./text";
import { ethers } from "ethers";
import { getEnsAvatar } from "@wagmi/core";
import { getEnsName } from "@wagmi/core";
import { config } from "./config";
import { normalize } from "viem/ens";
import { mainnet } from "@wagmi/core/chains";

const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ENS_RPC_PROVIDER
);

export async function resolveENSProfileImage(
  address: string
): Promise<string | null> {
  const lowerCaseAddress = address.toLowerCase();

  // Return unless the address is a valid ENS name.
  // Basic detection for strings that start with 0x
  const pattern = /^0x[a-fA-F0-9]+/;
  if (pattern.test(address)) {
    return null;
  }

  try {
    return lowerCaseAddress;
  } catch (error) {
    console.error("ENS Avatar error", error);
    return null;
  }
}

export async function processAddressOrEnsName(addressOrENSName: string) {
  // Assume resolved ens name
  if (!isAddress(addressOrENSName)) {
    return addressOrENSName;
  }

  try {
    return truncateAddress(addressOrENSName);
  } catch (error) {
    console.error("Error in reverse resolving ENS name:", error);
    return null;
  }
}

export async function getMetaAddressOrEnsName(
  daoName: string,
  address: string
) {
  // const res = await fetch(
  //   `https://api.karmahq.xyz/api/dao/find-delegate?dao=${daoName}&user=${address}`
  // );
  // const details = await res.json();
  const fetchedEnsName = await fetchEnsName(address);
  // const karmaEnsName = details.data.delegate?.ensName;
  const ensName = fetchedEnsName?.ensName;
  return ensName ? ensName : truncateAddress(address);
}

export async function getMetaProfileImage() {}

export async function fetchEnsAvatar(address: any) {
  try {
    const ensName = await getEnsName(config, {
      address,
      chainId: mainnet.id,
    });
    const avatar = await getEnsAvatar(config, {
      assetGatewayUrls: {
        ipfs: "https://cloudflare-ipfs.com",
      },
      gatewayUrls: ["https://cloudflare-ipfs.com"],
      name: normalize(ensName?.toString() || ""),
      chainId: mainnet.id,
      // universalResolverAddress: "0x74E20Bd2A1fE0cdbe45b9A1d89cb7e0a45b36376",
    });
    return { avatar, ensName };
  } catch (error) {
    const truncatedAddress = truncateAddress(address);
    console.error(`Error fetching ENS details for address ${address}:`, error);
    return { avatar: null, ensName: truncatedAddress };
  }
}

export async function fetchEnsName(address: any) {
  try {
    const ensName = await getEnsName(config, {
      address,
      chainId: mainnet.id,
    });
    console.log("ensName: ", ensName);
    const displayName = address?.slice(0, 4) + "..." + address?.slice(-4);

    const ensNameOrAddress = ensName ? ensName : displayName;
    // console.log("ensNameOrAddress: ", ensNameOrAddress);

    return { ensNameOrAddress, ensName };
  } catch (e) {
    console.log("Error in fetchEnsName ", e);
    const truncatedAddress = truncateAddress(address);
    return { ensNameOrAddress: truncatedAddress, ensName: truncatedAddress };
  }
}
