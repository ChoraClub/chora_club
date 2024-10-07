import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import React from "react";
import sharp from "sharp";

export const revalidate = false;

export const runtime = "edge";

const size = {
  width: 1000,
  height: 800,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const daoName = searchParams.get("daoName");
  const meetingId = searchParams.get("meetingId");

  const opLogo = await fetch(new URL("../assets/op.png", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  const arbLogo = await fetch(
    new URL("../assets/arb.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  console.log("daoName: ", daoName);
  console.log("meetingId: ", meetingId);

  const main = await fetch(new URL("../assets/nft.png", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  let nftTitle = "";
  let nftLogo: any;
  if (daoName === "optimism") {
    nftTitle = `${meetingId}/OP`;
    nftLogo = opLogo;
  } else if (daoName === "arbitrum") {
    nftTitle = `${meetingId}/ARB`;
    nftLogo = arbLogo;
  }

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: "100%",
          borderRadius: "20%",
        }}
      >
        <img
          // @ts-ignore
          src={main}
          style={{
            position: "absolute",
            zIndex: -1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="background"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "20px",
            marginTop: "30px",
            marginLeft: "100px",
          }}
        >
          <img
            src={nftLogo}
            style={{
              width: "140px",
              height: "140px",
            }}
            alt="NFT Logo"
          />
        </div>
        <div
          style={{
            textAlign: "center",
            color: "white",
            fontSize: "40px",
            maxWidth: "80%",
            marginTop: "210px",
            marginBottom: "auto",
          }}
        >
          Congratulations! 🎉 You&apos;ve watched this session and claimed this
          NFT, marking your knowledge and growth in Web3.
        </div>
        <div
          style={{
            fontFamily: "poppins",
            fontSize: "36px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "103px",
          }}
        >
          {nftTitle}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
  // console.log("imageResponse::", imageResponse);
  return imageResponse;
}
