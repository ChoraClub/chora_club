"use client";
import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import "@rainbow-me/rainbow-button/styles.css";
import { fetchEnsAvatar, getEnsName } from "@/utils/ENSUtils";
import { BiSolidWallet } from "react-icons/bi";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";
import Image from "next/image";
import user from "@/assets/images/user/user2.svg"

function ConnectWalletWithENS() {
  const [displayAddress, setDisplayAddress] = useState<any>();
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const { address } = useAccount();


  useEffect(() => {
    const fetchUserProfile = async () => {
      if (address) {
        try {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("x-wallet-address", address);

          const raw = JSON.stringify({ address: address });

          const requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          const res = await fetch(`/api/profile/${address}`, requestOptions);
          const dbResponse = await res.json();
          console.log("data",dbResponse)

          if (dbResponse.data.length > 0) {
            const profileImage = dbResponse.data[0]?.image;
            setUserProfileImage(profileImage ? `https://gateway.lighthouse.storage/ipfs/${profileImage}` : null);
          }

          const ensData = await fetchEnsAvatar(address);
          setEnsAvatar(ensData?.avatar || null);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [address]);

  useEffect(() => {
    if (address) {
      (async () => {
        const displayName = await getEnsName(address);
        setDisplayAddress(displayName?.ensNameOrAddress);
      })();
    }
  }, [address]);

  const getDisplayImage = () => {
    if (ensAvatar) {
      return ensAvatar;
    } else if (userProfileImage) {
      return userProfileImage;
    } else {
      return user;
    }
    

  };
  
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        // useEffect(() => {
        //   const name = getEnsName(account?.address, account?.displayName);
        //   setDisplayAddress(name);
        // }, []);
        console.log("account: ", account?.address);

        if (account) {
          (async () => {
            // console.log("account in if: ", account?.address);
            const displayName = await getEnsName(account?.address);
            // console.log("display name: ", displayName?.ensNameOrAddress);
            setDisplayAddress(displayName?.ensNameOrAddress);
          })();
        }

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="wallet"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex items-center justify-center text-white bg-blue-shade-200 hover:bg-blue-shade-100 border border-white rounded-full p-2 md:px-5 md:py-4 text-xs md:text-sm font-bold transition-transform transform hover:scale-105"
                  >
                    <BiSolidWallet className="block md:hidden size-5" />
                    <span className="hidden md:block">Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center text-white bg-red-600 hover:bg-red-700 border border-white rounded-lg px-3 py-2 md:px-4 md:py-[5px] font-bold transition-transform transform hover:scale-105 text-xs md:text-sm"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <>
                <div style={{ gap: 12 }} className="hidden lg:flex">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center bg-white border border-white rounded-lg md:pl-[10px] md:pr-2 py-1.5 pl-2 pr-[6px] md:py-2 font-bold text-black shadow-sm transition-transform transform hover:scale-105 text-xs md:text-sm"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 24,
                          height: 24,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 24, height: 24 }}
                          />
                        )}
                      </div>
                    )}
                    {/* {chain.name} */}
                    <svg
                      fill="#000000"
                      height="25px"
                      width="25px"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-168.3 -168.3 666.60 666.60"
                      transform="rotate(180)"
                      stroke="#000000"
                      stroke-width="33.0002"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          id="XMLID_105_"
                          d="M324.001,209.25L173.997,96.75c-5.334-4-12.667-4-18,0L6.001,209.25c-6.627,4.971-7.971,14.373-3,21 c2.947,3.93,7.451,6.001,12.012,6.001c3.131,0,6.29-0.978,8.988-3.001L164.998,127.5l141.003,105.75c6.629,4.972,16.03,3.627,21-3 C331.972,223.623,330.628,214.221,324.001,209.25z"
                        ></path>{" "}
                      </g>
                    </svg>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    // style={{
                    //   display: "flex",
                    //   alignItems: "center",
                    //   color: "black",
                    //   borderRadius: "12px",
                    //   borderColor: "white",
                    //   borderStyle: "solid",
                    //   backgroundColor: "white",
                    //   fontWeight: "bold",
                    //   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    // }}
                    className="flex items-center bg-white border border-white rounded-xl px-3 py-2 sm:px-4 sm:py-2 font-bold text-black shadow-sm transition-transform transform hover:scale-105 text-xs sm:text-sm"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background:
                          "linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))",
                        color: "black",
                        borderRadius: "12px",
                        paddingLeft: "12px",
                        paddingRight: "4px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        margin: "1px",
                      }}
                    >
                      {account.ensAvatar && (
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          <img
                            alt={account.ensAvatar ?? "Chain icon"}
                            src={account.ensAvatar}
                            style={{ width: 24, height: 24 }}
                          />
                        </div>
                      )}
                      {displayAddress}
                      <svg
                        fill="#000000"
                        height="25px"
                        width="25px"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-168.3 -168.3 666.60 666.60"
                        transform="rotate(180)"
                        stroke="#000000"
                        stroke-width="33.0002"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            id="XMLID_105_"
                            d="M324.001,209.25L173.997,96.75c-5.334-4-12.667-4-18,0L6.001,209.25c-6.627,4.971-7.971,14.373-3,21 c2.947,3.93,7.451,6.001,12.012,6.001c3.131,0,6.29-0.978,8.988-3.001L164.998,127.5l141.003,105.75c6.629,4.972,16.03,3.627,21-3 C331.972,223.623,330.628,214.221,324.001,209.25z"
                          ></path>{" "}
                        </g>
                      </svg>
                    </div>
                  </button>
                </div>

                <div className="lg:hidden flex items-center">
                    {/* <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center rounded-full justify-center border-2 border-white font-bold text-black shadow-sm transition-transform transform hover:scale-105 text-xs"
                    >
                      {userProfileImage ? (
                        <Image
                          src={userProfileImage}
                          alt="User Profile"
                          width={30}
                          height={30}
                          className="rounded-full mr-2"
                        />
                      ) : (
                        <Image
                          src={user}
                          alt="User Profile"
                          width={30}
                          height={30}
                          className="rounded-full mr-2"/>
                      )}
                    </button> */}
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center rounded-full justify-center font-bold text-black shadow-sm transition-transform transform hover:scale-105 text-xs"
                    >
                      <Image
                        src={getDisplayImage()}
                        alt="User Avatar"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default ConnectWalletWithENS;
