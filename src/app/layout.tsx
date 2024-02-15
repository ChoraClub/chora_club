import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFonts from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import SidebarMain from "@/components/MainSidebar/SidebarMain";
import RootProviders from "./providers/root-providers";
import HuddleContextProvider from "@/components/ClientComponents/HuddleContextProvider";

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

export const metadata: Metadata = {
  title: "Chora Club",
  description: "Discover. Learn. Engage.",
  icons: {
    icon: ["/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${quanty.variable} ${poppins.variable}`}>
        <RootProviders>
          <HuddleContextProvider>
            <div className="flex">
              <div className="fixed w-[6%] bg-blue-shade-100 h-screen mr-4 lg:mr-8 ">
                <SidebarMain />
              </div>
              <div className="w-[92%] ml-auto py-4">{children}</div>
            </div>
          </HuddleContextProvider>
        </RootProviders>
      </body>
    </html>
  );
}
