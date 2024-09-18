import { IoClose } from "react-icons/io5";
import user1 from "@/assets/images/daos/CCLogo2.png";
// import user1 from "@/assets/images/sidebar/favicon.png";
import { FaCalendarDays } from "react-icons/fa6";
import Image from "next/image";
import { IoCopy } from "react-icons/io5";
import { BiSolidBellOff, BiSolidBellRing } from "react-icons/bi";
import { Tooltip } from "@nextui-org/react";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchEnsAvatar } from "@/utils/ENSUtils";
import style from "./FollowingModal.module.css";
import oplogo from "@/assets/images/daos/op.png";
import arbcir from "@/assets/images/daos/arbCir.png";
import { useAccount } from "wagmi";
import { useRouter } from "next-nprogress-bar";

interface FollowingModal {
  userFollowings: any;
  toggleFollowing: any;
  toggleNotification: any;
  setIsFollowingModalOpen: any;
  isLoading: any;
  handleUpdateFollowings: any;
  daoName: string;
}
function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  // const options = { year: "numeric", month: "long" };
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return `Since ${date.toLocaleDateString("en-US", options)}`;
}

function FollowingModal({
  userFollowings,
  toggleFollowing,
  toggleNotification,
  setIsFollowingModalOpen,
  isLoading,
  handleUpdateFollowings,
  daoName,
}: FollowingModal) {
  const [ensNames, setEnsNames] = useState<any>({});
  const [ensAvatars, setEnsAvatars] = useState<any>({});
  const [chainName, setChainName] = useState("");
  const { chain } = useAccount();
  const [activeButton, setActiveButton] = useState("");
  const router = useRouter();
  const [isButtonLoading, setIsButtonLoading] = useState(false); 

  const handleChainChange = async (chain: string) => {
    setActiveButton(chain);
    setIsButtonLoading(true); // Start loading
    await handleUpdateFollowings(chain, 0, 0);
    setIsButtonLoading(false); // Stop loading
    setChainName(chain);
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
    // console.log("user followings", userFollowings)
    // console.log("chain name",chainName)
  };

  const handleRedirect = (address: string) => {
    if (chainName) {
      router.push(`/${chainName}/${address}?active=info`);
    } else {
      console.error("Chain name is undefined");
    }
  };

  useEffect(() => {
    if (chain && chain?.name === "OP Mainnet") {
      handleChainChange("optimism");
    } else if (chain && chain?.name === "Arbitrum One") {
      handleChainChange("arbitrum");
    }
  }, [chain]);

  useEffect(() => {
    const fetchEnsNames = async () => {
      // console.log(" user followings", userFollowings);
      const addresses = userFollowings.map(
        (user: any) => user.follower_address
      );
      const names = await Promise.all(
        addresses.map(async (address: any) => {
          const ensNames = await fetchEnsAvatar(address);
          const ensName = ensNames?.ensName;

          return { address, ensName };
        })
      );
      const ensNameMap: { [address: string]: any } = {};
      names.forEach(({ address, ensName }) => {
        ensNameMap[address] = ensName;
      });
      // console.log("ens name: ", ensNameMap);
      setEnsNames(ensNameMap);
    };

    const fetchEnsAvatars = async () => {
      const addresses = userFollowings.map(
        (user: any) => user.follower_address
      );
      const avatars = await Promise.all(
        addresses.map(async (address: any) => {
          const ensAvatars = await fetchEnsAvatar(address);
          const avatar = ensAvatars?.avatar;

          return { address, avatar };
        })
      );
      const ensAvatarMap: { [address: string]: any } = {};
      avatars.forEach(({ address, avatar }) => {
        ensAvatarMap[address] = avatar;
      });
      //   console.log("ens name: ", ensNameMap);
      setEnsAvatars(ensAvatarMap);
    };
    if (userFollowings.length > 0) {
      fetchEnsNames();
    }
    if (userFollowings.length > 0) {
      fetchEnsAvatars();
    }
  }, [userFollowings]);
  return (
    <>
      <div
        className="font-poppins z-[70] fixed inset-0 flex items-center justify-center backdrop-blur-md"
        onClick={(event) => {
          event.stopPropagation();
          setIsFollowingModalOpen(false);
        }}
      >
        <div
          className="bg-white rounded-[41px] overflow-hidden shadow-lg w-full max-w-3xl mx-2 xs:mx-4 sm:mx-8 2md:mx-auto"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="relative">
            <div className="flex text-white bg-[#292929] px-4 sm:px-10 items-center justify-between py-7">
              <h2 className="text-lg sm:text-xl font-semibold ">Followings</h2>
              <div
                className="p-1 sm:p-1.5 rounded-full bg-[#F23535] flex items-center justify-center cursor-pointer"
                onClick={() => setIsFollowingModalOpen(false)}
              >
                <IoClose className=" text-white w-4 h-4 sm:w-5 sm:h-5 " />
              </div>
            </div>
            <div
              className={` max-h-[60vh] overflow-y-auto ${style.customscrollbar}`}
            >
              <div className="flex ml-7 xm:ml-10 mt-5 gap-3 xm:gap-5 ">
                <button
                  className={`border border-[#CCCCCC] px-2 xm:px-4 py-1 rounded-lg text-base xm:text-lg flex w-[125px] xm:w-[141px] items-center justify-center gap-1.5 ${
                    activeButton === "optimism"
                      ? "bg-[#8E8E8E] text-white"
                      : "bg-[#F5F5F5] text-[#3E3D3D]"
                  }`}
                  onClick={() => handleChainChange("optimism")}
                  disabled={isButtonLoading} 
                >
                  {isButtonLoading && activeButton === "optimism" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> // Skeleton Loader
                  ) : (
                    <>
                      <Image src={oplogo} alt="optimism" width={23} />
                      Optimism
                    </>
                  )}
                </button>
                <button
                  className={`border border-[#CCCCCC] px-2 xm:px-4 py-1 w-[125px] xm:w-[141px] rounded-lg text-base xm:text-lg flex items-center justify-center gap-1.5 ${
                    activeButton === "arbitrum"
                      ? "bg-[#8E8E8E] text-white"
                      : "bg-[#F5F5F5] text-[#3E3D3D]"
                  }`}
                  onClick={() => handleChainChange("arbitrum")}
                  disabled={isButtonLoading} 
                >
                  {isButtonLoading && activeButton === "arbitrum" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> // Skeleton Loader
                  ) : (
                    <>
                      <Image src={arbcir} alt="arbitrum" width={23} />
                      Arbitrum
                    </>
                  )}
                </button>
              </div>
              <hr className="border-t border-gray-300 mt-4 sm:my-6 mx-7 xm:mx-10" />
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-shade-200"></div>
                </div>
              ) : userFollowings.length > 0 ? (
                userFollowings.map((user: any, index: any) => (
                  <>
                    <div
                      key={index}
                      className="flex justify-between items-center px-2 py-5 xs:p-5 xm:py-6 xm:px-10"
                    >
                      <div className="flex items-center">
                        <Image
                          src={ensAvatars[user.follower_address] || user1} //add ens avatar
                          alt={user.follower_address}
                          className=" rounded-full mr-2 xs:mr-4 size-8 xm:size-10"
                          width={40}
                          height={40}
                        />
                        <div className="gap-1 flex flex-col">
                          <div className="flex gap-0.5 xs:gap-2 items-center">
                            <div
                              className="font-semibold text-sm xs:text-base hover:text-blue-shade-100 cursor-pointer"
                              onClick={() =>
                                handleRedirect(user.follower_address)
                              }
                            >
                              {/* {user.follower_address.slice(0, 6)}...  */}
                              {/* {user.follower_address.slice(-4)} */}
                              {ensNames[user.follower_address] ||
                                user.follower_address.slice(0, 6) +
                                  "..." +
                                  user.follower_address.slice(-4)}
                            </div>
                            <IoCopy
                              className="size-3 xs:size-4 hover:text-blue-shade-100 cursor-pointer"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleCopy(`${user.follower_address}`);
                              }}
                            />
                          </div>
                          <div className="flex gap-1 items-center">
                            <FaCalendarDays className="size-3" />
                            <p className="text-xs xs:text-sm ">
                              {formatDate(user.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 xm:gap-4">
                        <Tooltip
                          content={
                            user.isFollowing
                              ? "Unfollow this delegate to stop receiving their updates."
                              : "Follow this delegate to receive their latest updates."
                          }
                          placement="top"
                          closeDelay={1}
                          showArrow
                        >
                          <button
                            className={`font-semibold rounded-full justify-center text-xs xs:text-sm xm:text-base py-1 xs:py-2 xm:py-[10px] flex items-center w-[80px] xs:w-[90px] xm:w-[127.68px]  ${
                              user.isFollowing
                                ? "bg-white text-blue-shade-100 border border-blue-shade-100 hover:bg-blue-shade-400"
                                : "bg-blue-shade-200 text-white"
                            }`}
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleFollowing(index, user, chainName);
                            }}
                          >
                            {user.isFollowing ? "Unfollow" : "Follow"}
                          </button>
                        </Tooltip>

                        <Tooltip
                          content={
                            user.isNotification
                              ? "Click to mute delegate activity alerts."
                              : "Don't miss out! Click to get alerts on delegate activity."
                          }
                          placement="top"
                          closeDelay={1}
                          showArrow
                        >
                          <div className="text-xs xm:text-sm border-blue-shade-100 text-blue-shade-100 border rounded-full size-8 xs:size-10 xm:size-11 flex items-center justify-center cursor-pointer hover:bg-blue-shade-400">
                            {user.isNotification ? (
                              <BiSolidBellRing
                                className="size-3 xs:size-4 xm:size-5"
                                color="bg-blue-shade-200"
                                size={20}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleNotification(index, user, chainName);
                                }}
                              />
                            ) : (
                              <BiSolidBellOff
                                className="size-4 xm:size-5"
                                color="bg-blue-shade-200"
                                size={20}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleNotification(index, user, chainName);
                                }}
                              />
                            )}
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    {index < userFollowings.length - 1 && (
                      <hr className="border-[#DDDDDD] border-0.5" />
                    )}
                  </>
                ))
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p>No followings found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default FollowingModal;
