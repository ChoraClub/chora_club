import { AccessToken, Role } from "@huddle01/server-sdk/auth";

export const dynamic = "force-dynamic";

const createToken = async (roomId: string, role: string) => {
  const accessToken = new AccessToken({
    apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    roomId: roomId as string,
    role: role,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });

  const token = await accessToken.toJwt();

  return token;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return new Response("Missing roomId", { status: 400 });
  }

  let token: string;

  try {
    const response = await fetch(
      `https://api.huddle01.com/api/v1/live-meeting/preview-peers?roomId=${roomId}`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    const { previewPeers } = data;

    token = await createToken(
      roomId,
      previewPeers.length > 0 ? Role.LISTENER : Role.HOST
    );
  } catch (error) {
    token = await createToken(roomId, Role.HOST);
  }

  return new Response(token, { status: 200 });
}
