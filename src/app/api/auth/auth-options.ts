import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { BASE_URL } from "@/config/constants";
import jwt from "jsonwebtoken";

async function AccountCreate(user: any) {
  console.log("wallet come", user);

  const token = jwt.sign(
    {
      address: user,
    },
    process.env.NEXTAUTH_SECRET!, // Make sure to set this in your environment variables
    { expiresIn: "10m" } // Token expires in 1 hour
  );

  console.log("token generated here line number 89:-", token);

  try {
    console.log("user::", user);

    const res = await fetch(`${BASE_URL}/api/auth/accountcreate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wallet-address": user,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address: user,
        isEmailVisible: false,
        createdAt: new Date(),
      }),
    });

    if (res.status === 200) {
      console.log("Account created successfully!");
    } else if (res.status === 409) {
      console.log("Resource already exists!");
    } else {
      console.log("Unexpected response:", await res.text());
    }
  } catch (error) {
    console.error("Error in initial profile:", error);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(BASE_URL as string);
          // console.log("credentials", credentials);
          // console.log("req", req);
          // console.log("siwe", siwe);
          // console.log("nextAuthUrl", nextAuthUrl);
          // console.log("process.env.VERCEL_URL", process.env.VERCEL_URL);
          const secret = process.env.NEXTAUTH_SECRET;
          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            // nonce: await getCsrfToken({ req }),
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          });
          console.log(result);
          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          console.log("error:", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.address = token.sub;
      session.user.name = token.sub;
      AccountCreate(session.address);
      return session;
    },
  },
};
