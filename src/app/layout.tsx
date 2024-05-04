"use client";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFonts from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import SidebarMain from "@/components/MainSidebar/SidebarMain";
import RootProviders from "./providers/root-providers";
import HuddleContextProvider from "@/components/ClientComponents/HuddleContextProvider";
import { useEffect } from "react";
import FeedbackTile from "@/components/utils/FeedbackTile";
import Script from "next/script";
import ButtonWithCircle from "@/components/Circle/ButtonWithCircle";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const quanty = localFonts({
  src: [
    {
      path: "../assets/fonts/quanty.ttf",
    },
  ],
  variable: "--font-quanty",
});

// export const metadata: Metadata = {
//   title: "Chora Club",
//   description: "Discover. Learn. Engage.",
//   icons: {
//     icon: ["/favicon.png"],
//   },
// };
export const metadata: Metadata = {
  metadataBase: new URL("https://app.chora.club/"),
  title: "Chora Club",
  description: "Discover. Learn. Engage.",
  icons: {
    icon: ["/favicon.png"],
  },
  openGraph: {
    title: "Chora Club",
    description: "Discover. Learn. Engage.",
    url: "https://app.chora.club/",
    siteName: "Chora Club",
    images: [
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmZmWxpdhQZnag8HZtwZPLR5wtK2jjfgsTBMpNpmijtZ5x",
        width: 800,
        height: 600,
        alt: "img",
      },
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmZmWxpdhQZnag8HZtwZPLR5wtK2jjfgsTBMpNpmijtZ5x",
        width: 1800,
        height: 1600,
        alt: "img",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
       (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W5684W77');
          `,
          }}
        ></script>
      </head>
      <body className={`${quanty.variable} ${poppins.variable}`}>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W5684W77"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        `,
          }}
        />
        <RootProviders>
          <HuddleContextProvider>
            {/* <ButtonWithCircle> */}
            <div className="flex">
              <div className="fixed w-[6%] bg-blue-shade-100 h-screen mr-4 lg:mr-8 ">
                <SidebarMain />
              </div>
              <div className="w-[94%] ml-auto">
                <FeedbackTile />
                <div>{children}</div>
              </div>
            </div>
            {/* </ButtonWithCircle> */}
          </HuddleContextProvider>
        </RootProviders>
      </body>
    </html>
  );
}
