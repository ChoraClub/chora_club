import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { BASE_URL } from "@/config/constants";

// const signInUser = async ({ user }: any) => {
//   try {
//     console.log("user::", user);
//     // console.log("user.id::", user.id);

//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     if (user) {
//       myHeaders.append("x-wallet-address", user);
//     }

//     const raw = JSON.stringify({
//       address: user,
//       isEmailVisible: false,
//       createdAt: new Date(),
//     });

//     const requestOptions: any = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };
//     console.log(requestOptions);
//     const res = await fetch(
//       `${BASE_URL}/api/auth/accountcreate`,
//       requestOptions
//     );
//     // console.log("Response:-", res);
//     if (res.status === 200) {
//       console.log("Account created succesfully!");
//     } else if (res.status == 409) {
//       console.log("Resource already exist!");
//     }
//   } catch (error) {
//     console.error("Error in initial profile:", error);
//   }
// };

const signInUser = async ({ user }: any) => {
  try {
    console.log("user::", user);

    const res = await fetch(`${BASE_URL}/api/auth/accountcreate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wallet-address": user,
      },
      body: JSON.stringify({
        address: user,
        isEmailVisible: false,
        createdAt: new Date(),
      }),
      credentials: "include", // This is important to include cookies
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
};

async function call(user: any) {
  console.log("wallet come", user);

  try {
    console.log("user::", user);

    const res = await fetch(`${BASE_URL}/api/auth/accountcreate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wallet-address": user,
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

// Delay the call function for 15 seconds (15000 milliseconds)
setTimeout(call, 30000);

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
      call(session.address);
      return session;
    },
  },
};
