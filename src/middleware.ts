import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const normalizeOrigin = (url: string) => url.replace(/\/$/, "");

const allowedOrigins = [
  normalizeOrigin(process.env.NEXT_PUBLIC_LOCAL_BASE_URL!),
  normalizeOrigin(process.env.NEXT_PUBLIC_HOSTED_BASE_URL!),
  normalizeOrigin(process.env.NEXT_PUBLIC_MIDDLEWARE_BASE_URL!),
];

export async function middleware(request: NextRequest) {
  // console.log("Request Body :- ", request);

  // const origin = request.nextUrl.origin;
  const origin = normalizeOrigin(request.nextUrl.origin);

  // console.log("allowed Origin", allowedOrigins);
  // console.log("Origin from request", origin);

  // if (!allowedOrigins?.includes(origin)) {
  //   return new NextResponse(
  //     JSON.stringify({ error: "Unknown origin request come Forbidden" }),
  //     {
  //       status: 403,
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  // }

  if (!allowedOrigins.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ error: "Unknown origin request. Forbidden" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const walletAddress = request.headers.get("x-wallet-address");

  // console.log("Append headers wallet address:-", walletAddress);

  if (!["POST", "PUT", "DELETE"].includes(request.method)) {
    // For other methods, allow the request to proceed without additional checks
    return NextResponse.next();
  }

  // console.log("Upcoming request method:-", request.method);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log("Token generated using nextauth:-", token);

  if (!token) {
    // If there's no token, the user is not authenticated
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extract the user address from the token
  const UserAddress = token.sub;

  // console.log("Exracted user address from token:- ", UserAddress);

  // console.log("Requested Address:", walletAddress);

  if (UserAddress !== walletAddress) {
    // If the user's address doesn't match the requested profile address
    console.log(
      `Forbidden access attempt: By user with address :- ${UserAddress}`
    );
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  //  else {
  //   console.log(
  //     `Processed further to calling API to user with wallet address :- ${walletAddress} `
  //   );
  //   return new NextResponse(JSON.stringify({ message: "Accepted" }), {
  //     status: 202,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  // If everything is okay, continue to the API route
  return NextResponse.next();
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
    // "/api/verify-meeting-id/:path*",
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
    "/api/get-session-data/:path*",
    // "/api/attest-offchain/:path*",
    "/api/get-attendee-individual/:path*",
    "/api/get-dao-sessions/:path*",
  ],
};
