import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const normalizeOrigin = (url: string) => url?.replace(/\/$/, "");

const allowedOrigins = [
  normalizeOrigin(process.env.NEXT_PUBLIC_LOCAL_BASE_URL!),
  normalizeOrigin(process.env.NEXT_PUBLIC_HOSTED_BASE_URL!),
  normalizeOrigin(process.env.NEXT_PUBLIC_MIDDLEWARE_BASE_URL!),
  normalizeOrigin(process.env.NEXT_PUBLIC_LOCAL_MEETING_APP_URL!),
  normalizeOrigin(process.env.NEXT_PUBLIC_HOSTED_MEETING_APP_URL!),
].filter(Boolean);

const publicApis = ["/api/update-recording-status/:path*", "/api/end-call"];

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Always set CORS headers
  const response = NextResponse.next();
  setCorsHeaders(response, origin);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return response;
  }

  // Check if the API is public
  const isPublicApi = publicApis.some((api: any) =>
    request.nextUrl.pathname.startsWith(api)
  );

  if (!isPublicApi) {
    // For non-public APIs, check authentication
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          ...response.headers,
        },
      });
    }

    // Additional checks for wallet address if needed
    const walletAddress = request.headers.get("x-wallet-address");
    if (walletAddress && token.sub !== walletAddress) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          ...response.headers,
        },
      });
    }
  }

  return response;
}

function setCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && allowedOrigins.includes(normalizeOrigin(origin))) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    response.headers.set(
      "Access-Control-Allow-Origin",
      allowedOrigins[0] || "*"
    );
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-wallet-address"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
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
    "/api/get-attest-data/:path*",
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
    "/api/get-attendee-individual/:path*",
    // "/api/attest-offchain/:path*",
    // "/api/get-availability/:path*",
    // "/api/verify-meeting-id/:path*",
    // "/api/get-dao-sessions/:path*",
    // "/api/images/og/nft/:path",
  ],
};
