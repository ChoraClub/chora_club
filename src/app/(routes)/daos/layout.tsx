"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <NextUIProvider>
        <div className="flex">
          <div className="fixed w-[6%] bg-blue-shade-100 h-screen mr-4 lg:mr-8 ">
            <Sidebar />
          </div>
          <div className="w-[92%] ml-auto py-4">{children}</div>
        </div>
      </NextUIProvider>
    </main>
  );
}
