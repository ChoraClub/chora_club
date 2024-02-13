import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

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

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL as string);
          console.log("credentials", credentials);
          console.log("req", req);
          console.log("siwe", siwe);
          console.log("nextAuthUrl", nextAuthUrl);
          console.log("process.env.VERCEL_URL", process.env.VERCEL_URL);
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
};
