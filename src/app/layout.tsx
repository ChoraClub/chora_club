import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFonts from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${quanty.variable} ${poppins.variable}`}>
        <div className="grid grid-cols-12">
          <div className="col-span-1 bg-blue-shade-100 h-screen mr-8">
            {/* <NextUIProvider> */}
            <Sidebar />
            {/* </NextUIProvider> */}
          </div>
          <div className="col-span-11 p-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
