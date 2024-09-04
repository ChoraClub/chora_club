import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFonts from "next/font/local";
import "./globals.css";
// import { NextUIProvider } from "@nextui-org/react";
import SidebarMain from "@/components/MainSidebar/SidebarMain";
import RootProviders from "./providers/root-providers";
import HuddleContextProvider from "@/context/HuddleContextProvider";
import { useEffect } from "react";
import FeedbackTile from "@/components/ComponentUtils/FeedbackTile";
import Script from "next/script";
import ProgressBarProvider from "@/components/ProgressBarProvider/ProgressBarProvider";
import MobileResponsiveMessage from "@/components/MobileResponsiveMessage/MobileResponsiveMessage";
import { GoogleTagManager } from "@next/third-parties/google";
import SidebarMainMobile from "@/components/MainSidebar/SidebarMainMobile";
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
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
       (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W5684W77');
          `,
          }}
        ></script> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="YRKGm8yZxOeOoTPDzshMBCC7SQq2FyEi";;analytics.SNIPPET_VERSION="5.2.0";
  analytics.load("YRKGm8yZxOeOoTPDzshMBCC7SQq2FyEi");
  analytics.page();
  }}();`,
          }}
        ></script>
      </head>
      <body className={`${quanty.variable} ${poppins.variable}`}>
        {/* <noscript
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
        /> */}
        <ProgressBarProvider>
          <RootProviders>
            <HuddleContextProvider>
              <div className="flex">
                <div className="hidden lg:block fixed w-[6%] bg-blue-shade-100 h-screen z-10">
                  <SidebarMain />
                </div>
                <div className="lg:hidden fixed z-10 w-full bg-white border border-b-0">
                  <SidebarMainMobile />
                </div>
                <div className="w-[100%] lg:w-[94%] ml-auto mt-[78px] sm:mt-[64px] lg:mt-0">
                  <FeedbackTile />
                  <div>{children}</div>
                </div>
              </div>
              {/* <div className="lg:block hidden">
                <div className="flex">
                  <div className="fixed w-[6%] bg-blue-shade-100 h-screen ">
                    <SidebarMain />
                  </div>
                  <div className="w-full md:w-[94%] ml-auto">
                    <FeedbackTile />
                    <div>{children}</div>
                  </div>
                </div>
              </div>
              <div className="lg:hidden w-full h-screen flex items-center justify-center">
                <MobileResponsiveMessage />
              </div> */}
            </HuddleContextProvider>
          </RootProviders>
        </ProgressBarProvider>
      </body>
      <GoogleTagManager gtmId="GTM-5KX3QH8T" />
    </html>
  );
}
