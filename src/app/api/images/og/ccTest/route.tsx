import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { IMAGE_URL } from "@/config/staticDataUtils";
export const revalidate = 0;

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const address = searchParams.get("address") || "";
  const avatar = searchParams.get("avatar") || "";
  const dao_name = searchParams.get("dao_name") || "";

  let icon = "";

  if (dao_name === "optimism") {
    icon =
      "https://gateway.lighthouse.storage/ipfs/QmXaKNwUxvd4Ksc9R6hd36eBo97e7e7YPDCVuvHwqG4zgQ";
  } else if (dao_name === "arbitrum") {
    icon =
      "https://gateway.lighthouse.storage/ipfs/QmdP6ZkLq4FF8dcvxBs48chqFiXu7Gr8SgPCqMtfr7VA4L";
  }

  const main = await fetch(new URL("../assets/main.jpg", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        <img
          /*@ts-ignore*/
          src={main}
          style={{
            position: "absolute",
            zIndex: -1,
          }}
          alt="background"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "10%",
            paddingLeft: "17%",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            {avatar && (
              <img
                /*@ts-ignore */
                src={avatar}
                alt="Profile"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                }}
              />
            )}
            <img
              /*@ts-ignore */
              src={icon}
              alt="icon"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
              }}
            />
          </div>
          <div
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              width: "420px",
              fontWeight: 600,
            }}
          >
            <div
              style={{
                color: "black",
                fontSize: "32px",
                paddingTop: "30px",
                paddingBottom: "30px",
                display: "flex",
              }}
            >
              You are invited to delegate your Voting Power on
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  padding: "10px 30px",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#0500FF",
                  color: "white",
                  fontSize: "22px",
                  textTransform: "capitalize",
                }}
              >
                {dao_name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignSelf: "center",
                  color: "black",
                  fontSize: "30px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                to
              </div>
              <div
                style={{
                  padding: "10px 30px",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#0500FF",
                  color: "white",
                  fontSize: "22px",
                }}
              >
                {address}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
