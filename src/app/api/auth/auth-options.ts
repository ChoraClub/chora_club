import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { BASE_URL } from "@/config/constants";

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
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (user.id) {
          myHeaders.append("x-wallet-address", user.id);
        }

        const raw = JSON.stringify({
          address: user.id,
          isEmailVisible: false,
        });

        const requestOptions: any = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        console.log(requestOptions);
        const res = await fetch(
          `${BASE_URL}/api/auth/accountcreate`,
          requestOptions
        );
        // console.log("Response:-", res);
        if (res.status === 200) {
          console.log("Account created succesfully!");
        } else if (res.status == 409) {
          console.log("Resource already exist!");
        }
      } catch (error) {
        console.error("Error in initial profile:", error);
      }
    },
  },
};
