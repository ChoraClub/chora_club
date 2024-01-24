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
        <div className="grid grid-cols-12">
          <div className="col-span-1 bg-blue-shade-100 h-screen mr-4 lg:mr-8">
            <Sidebar />
          </div>
          <div className="col-span-11 p-6">{children}</div>
        </div>
      </NextUIProvider>
    </main>
  );
}
