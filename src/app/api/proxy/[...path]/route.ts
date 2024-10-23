import { BASE_URL } from "@/config/constants";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "verify-meeting-id",
  // Add more public routes as needed
];

// Helper function to check if the current path should bypass auth
const shouldBypassAuth = (path: string): boolean => {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const method = request.method;
  const searchParams = request.nextUrl.searchParams.toString();
  console.log("path:::", path);
  let requestBody;
  if (["POST", "PUT", "DELETE"].includes(method)) {
    requestBody = await request.json();
  }

  // Get all headers from the incoming request
  const headers = Object.fromEntries(request.headers);
  // console.log("header from incoming request::", headers);

  try {
    const url = `${BASE_URL}/api/${path}${
      searchParams ? `?${searchParams}` : ""
    }`;
    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
        "x-api-key": `${process.env.CHORA_CLUB_API_KEY}`,
        "Content-Type": "application/json",
      },
      ...(requestBody && { body: JSON.stringify(requestBody) }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API request failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
