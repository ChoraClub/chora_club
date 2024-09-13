import { BASE_URL } from "@/config/constants";
import { fetchEnsAvatar } from "@/utils/ENSUtils";
import { truncateAddress } from "@/utils/text";

export async function fetchInviteeDetails(userAddress: string) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    caches: "no-store",
    next: { revalidate: 0 },
  };

  const res = await fetch(
    `${BASE_URL}/api/profile/${userAddress}`,
    requestOptions
  );
  const response = await res.json();

  const displayImage = response?.data[0]?.image;
  const displayName = response?.data[0]?.displayName;

  const ensData = await fetchEnsAvatar(userAddress);
  const ensName = ensData?.ensName;
  const ensAvatar = ensData?.avatar;

  const formattedAddr = truncateAddress(userAddress);

  return {
    displayImage,
    displayName,
    ensName,
    ensAvatar,
    formattedAddr,
  };
}
