import { isAddress } from "viem";
import { cache } from "react";
import { truncateAddress } from "./text";
import { ethers } from "ethers";

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
  const fetchedEnsName = await getEnsName(address);
  // const karmaEnsName = details.data.delegate?.ensName;
  const ensName = fetchedEnsName?.ensName;
  return ensName ? ensName : truncateAddress(address);
}

export async function getMetaProfileImage() {}

export async function fetchEnsAvatar(address: string) {
  try {
    // Reverse lookup the ENS name from the address
    // console.log("provider: ", provider);
    const ensName = await provider.lookupAddress(address);
    // console.log("ensName: ", ensName);
    const displayName = address?.slice(0, 4) + "..." + address?.slice(-4);

    const ensNameOrAddress = ensName ? ensName : displayName;
    // console.log("ensNameOrAddress: ", ensNameOrAddress);

    if (!ensName) {
      // console.log(`No ENS name found for address ${address}`);
      return;
    }

    // console.log(`ENS name for address ${address}: ${ensName}`);

    // Get the resolver for the ENS name
    const resolver = await provider.getResolver(ensName);
    if (!resolver) {
      console.log(`No resolver found for ${ensName}`);
      return;
    }

    // Fetch various ENS details
    const resolvedAddress = await resolver.getAddress();
    const avatar = await resolver.getAvatar();
    const contentHash = await resolver.getContentHash();
    const email = await resolver.getText("email");
    const url = await resolver.getText("url");
    const description = await resolver.getText("description");
    const notice = await resolver.getText("notice");
    const keywords = await resolver.getText("keywords");
    const discord = await resolver.getText("com.discord");
    const github = await resolver.getText("com.github");
    const reddit = await resolver.getText("com.reddit");
    const twitter = await resolver.getText("com.twitter");
    const supportsWildcard = await resolver.supportsWildcard();
    // console.log("ensName", ensName);
    return { avatar, ensName, ensNameOrAddress };
  } catch (error) {
    console.error(`Error fetching ENS details for address ${address}:`, error);
    return null;
  }
}

export async function getEnsName(address: string) {
  try {
    const ensName = await provider.lookupAddress(address);
    // console.log("ensName: ", ensName);
    const displayName = address?.slice(0, 4) + "..." + address?.slice(-4);

    const ensNameOrAddress = ensName ? ensName : displayName;
    console.log("ensNameOrAddress: ", ensNameOrAddress);

    return { ensNameOrAddress, ensName };
  } catch (e) {
    console.log("Error: ", e);
  }
}
