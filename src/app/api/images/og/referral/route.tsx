import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import React from "react";

export const revalidate = false;

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const logo = await fetch(
    new URL("../assets/CCLogo.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const inviteeName = searchParams.get("inviteeName") || "Invitee";
  const inviteeAvatarUrl = searchParams.get("inviteeAvatar");

  console.log("inviteeName: ", inviteeName);
  console.log("inviteeAvatarUrl: ", inviteeAvatarUrl);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #3a7bd5, #3a6073)", // Light to medium blue gradient
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            height: "80%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "25px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            padding: "40px",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              padding: "10px",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <img
              /*@ts-ignore */
              src={inviteeAvatarUrl}
              width={100}
              height={100}
              alt="Invitee Avatar"
              style={{
                borderRadius: "50%",
                width: "150px",
                height: "150px",
                objectFit: "cover",
                border: "2px solid #3a6073",
              }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              fontWeight: "600",
              marginBottom: "20px",
              fontSize: "28px",
              color: "#f0f8ff",
            }}
          >
            You&apos;ve been invited to create on Chora Club by
          </div>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "40px",
              marginBottom: "30px",
              color: "#e0f7ff",
            }}
          >
            {inviteeName}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              /*@ts-ignore */
              src={logo}
              alt="Chora Club Logo"
              style={{ width: "80px", height: "80px" }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
