"use client";
import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import "@rainbow-me/rainbow-button/styles.css";
import { fetchEnsAvatar, getEnsName } from "@/utils/ENSUtils";

function ConnectWalletWithENS() {
  const [displayAddress, setDisplayAddress] = useState<any>();

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
            console.log("account in if: ", account?.address);
            const displayName = await getEnsName(account?.address);
            console.log("display name: ", displayName?.ensNameOrAddress);
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:"center",
                      color: "white",
                      borderRadius: "9999px",
                      borderColor: "white",
                      borderStyle: "solid",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingTop: "16px",
                      paddingBottom: "16px",
                      backgroundColor: "#0500FF",
                      fontWeight: "bold",
                    }}
                    className="hover:scale-105 hover:transition-all hover:ease-in-out text-sm"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                      borderRadius: "6px",
                      borderColor: "white",
                      borderStyle: "solid",
                      paddingLeft: "10px",
                      paddingRight: "12px",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      backgroundColor: "#ff494a",
                      fontWeight: "bold",
                    }}
                    className="hover:scale-105 hover:transition-all hover:ease-in-out"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      borderRadius: "12px",
                      borderColor: "white",
                      borderStyle: "solid",
                      paddingLeft: "10px",
                      paddingRight: "8px",
                      paddingTop: "7px",
                      paddingBottom: "7px",
                      backgroundColor: "white",
                      fontWeight: "bold",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                    type="button"
                    className="hover:scale-105 hover:transition-all hover:ease-in-out"
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      borderRadius: "12px",
                      borderColor: "white",
                      borderStyle: "solid",
                      backgroundColor: "white",
                      fontWeight: "bold",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                    className="hover:scale-105 hover:transition-all hover:ease-in-out"
                  >
                    <div
                      style={{
                        display: "flex",
                        paddingRight: "10px",
                        paddingLeft: "12px",
                      }}
                    >
                      {account.displayBalance
                        ? ` ${account.displayBalance}`
                        : ""}
                    </div>

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
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default ConnectWalletWithENS;
