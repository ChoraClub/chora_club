import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const allowedOrigins = [
  process.env.NEXT_PUBLIC_LOCAL_BASE_URL!,
  process.env.NEXT_PUBLIC_HOSTED_BASE_URL!,
  process.env.NEXT_PUBLIC_MIDDLEWARE_BASE_URL!,
  process.env.NEXT_PUBLIC_LOCAL_MEETING_APP_URL!,
  process.env.NEXT_PUBLIC_HOSTED_MEETING_APP_URL!,
].filter(Boolean);

const routeConfig = {
  proxy: {
    // Routes that need full authentication (token + wallet)
    authenticated: [
      // ... add other routes that need authentication
    ],
    // Routes that only need API key
    apiKeyOnly: [
      // ... add other routes that only need API key
    ],
    // Public routes that need no authentication
    public: [
      // ... add other public routes
    ],
  },
};

export async function middleware(request: NextRequest) {
  // console.log("Request in APP Middleware:::", request);
  const origin = request.nextUrl.origin;
  const pathname = request.nextUrl.pathname;
  const apiKey = request.headers.get("x-api-key");

  // CORS check
  if (!origin || !allowedOrigins.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ error: "Unknown origin request. Forbidden" }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Referrer-Policy": "strict-origin",
        },
      }
    );
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, x-wallet-address, x-api-key",
        "Referrer-Policy": "strict-origin",
      },
    });
  }

  const routeName = pathname.split("/").pop() || "";
  const isProxyRoute = pathname.startsWith("/api/proxy/");

  if (isProxyRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401 }
      );
    }

    const walletAddress = request.headers.get("x-wallet-address");
    const userAddress = token.sub;

    if (walletAddress && userAddress !== walletAddress) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid wallet address" }),
        { status: 403 }
      );
    }
  } else {
    if (!apiKey || apiKey !== process.env.CHORA_CLUB_API_KEY) {
      return new NextResponse(
        JSON.stringify({ error: "Direct API access not allowed" }),
        { status: 403 }
      );
    }
  }

  const response = NextResponse.next();
  setCorsHeaders(response, origin);
  return response;
}

function setCorsHeaders(response: NextResponse, origin: string | null) {
  response.headers.set("Access-Control-Allow-Origin", origin || "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-wallet-address, x-api-key"
  );
  response.headers.set("Referrer-Policy", "strict-origin");
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
