import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { BASE_URL } from "@/config/constants";
import jwt from "jsonwebtoken";

async function AccountCreate(user: any, token: any, referrer: string | null) {
  try {
    // const referrer = sessionStorage.getItem("referrer");
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
        referrer: referrer,
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

          const referrerMatch = siwe.statement?.match(/\(Referrer: (.*?)\)$/);
          const referrer = referrerMatch ? referrerMatch[1] : null;
          // console.log("referrer: ", referrer);

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
              referrer: referrer,
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
    async jwt({ token, account, user }) {
      if (account) {
        // Create a new JWT access token
        const accessToken = jwt.sign(
          {
            sub: token.sub, // Use the user's address as the subject
            address: token.sub,
          },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "10m" } // Token expires in 1 hour, adjust as needed
        );

        // Add the access token to the token object
        // console.log("Access token", accessToken);

        AccountCreate(token.sub, accessToken, (user as any).referrer);
        token.accessToken = accessToken;
        token.referrer = (user as any).referrer;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.address = token.sub;
      session.user.name = token.sub;
      return session;
    },
  },
};
