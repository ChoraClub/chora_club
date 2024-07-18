import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
// import { getWalletAddress } from "@/libs/authmiddleware";

export async function middleware(request: NextRequest) {
  console.log("Middleware run!");
  // console.log(request);
  const WalletAddress = request.headers.get("x-wallet-address");

  console.log(WalletAddress);

  if (!["POST", "PUT", "DELETE"].includes(request.method)) {
    // For other methods, allow the request to proceed without additional checks
    return NextResponse.next();
  }

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log(token);

  if (!token) {
    // If there's no token, the user is not authenticated
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extract the user address from the token
  const UserAddress = token.sub;
  console.log(UserAddress);

  console.log("Requested Address:", WalletAddress);

  if (UserAddress !== WalletAddress) {
    // If the user's address doesn't match the requested profile address
    console.log(
      `Forbidden access attempt: User ${UserAddress} tried to access profile of ${WalletAddress}`
    );
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If everything is okay, continue to the API route
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/profile/:path*"],
};
