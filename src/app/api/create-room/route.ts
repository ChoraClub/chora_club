import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const response = await fetch(
      "https://api.huddle01.com/api/v1/create-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Test Room",
          // hostWallets: ["0xB351a70dD6E5282A8c84edCbCd5A955469b9b032"],
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
        cache: "no-store",
      }
    );

    // if (!response.ok) {
    //   throw new Error("Failed to fetch");
    // }

    const result = await response.json();
    // console.log(result);
    const { roomId } = await result.data;
    // console.log(roomId);
    // Return the found documents
    return NextResponse.json({ success: true, data: roomId }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving data in create-room:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
