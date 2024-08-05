import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { BASE_URL } from "./config/constants";

const allowedOrigins = [BASE_URL];

export async function middleware(request: NextRequest) {
  // console.log("Request Body line number 7 :- ", request);

  const origin = request.nextUrl.origin;

  console.log("Origin request come from :-", origin);

  if (!allowedOrigins.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ error: "Unknown origin request come Forbidden" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const walletAddress = request.headers.get("x-wallet-address");

  console.log(
    "Appened headers wallet address line number 10 :-",
    walletAddress
  );

  if (!["POST", "PUT", "DELETE"].includes(request.method)) {
    // For other methods, allow the request to proceed without additional checks
    return NextResponse.next();
  }

  console.log("Upcoming request method line number 20 :-", request.method);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Token generated using nextauth line number 27 :-", token);

  if (!token) {
    // If there's no token, the user is not authenticated
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extract the user address from the token
  const UserAddress = token.sub;

  console.log(
    "Exracted user address from token line number 41 :- ",
    UserAddress
  );

  console.log("Requested Address:", walletAddress);

  if (UserAddress !== walletAddress) {
    // If the user's address doesn't match the requested profile address
    console.log(
      `Forbidden access attempt: By user with address :- ${UserAddress}`
    );
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    console.log(
      `Processed further to calling API to user with wallet address :- ${walletAddress} `
    );
    return new NextResponse(JSON.stringify({ message: "Accepted" }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If everything is okay, continue to the API route
  // return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/api/attest-onchain/:path*",
    "/api/book-slot/:path*",
    "/api/delegate-follow/:path*",
    "/api/edit-office-hours/:path*",
    "/api/end-call/:path*",
    "/api/update-attestation-uid/:path*",
    "/api/update-meeting-status/:path*",
    "/api/update-office-hours/:path*",
    "/api/update-recorded-session/:path*",
    "/api/update-recording-status/:path*",
    "/api/update-session-attendees/:path*",
    "/api/update-video-uri/:path*",
    "/api/verify-meeting-id/:path*",
    "/api/get-attest-data/:path*",
    "/api/get-availability/:path*",
    "/api/get-host/:path*",
    "/api/get-meeting/:path*",
    "/api/get-officehours-address/:path*",
    "/api/get-sessions/:path*",
    "/api/get-specific-officehours/:path*",
    "/api/new-token/:path*",
    "/api/notifications/:path*",
    "/api/office-hours/:path*",
    "/api/profile/:path*",
    "/api/report-session/:path*",
    "/api/search-officehours/:path*",
    "/api/search-session/:path*",
    "/api/store-availability/:path*",
    "/api/submit-vote/:path*",
  ],
};
