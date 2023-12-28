import { Toaster } from "@/components/ui/toaster";

import React, { type ReactNode } from "react";
import NextToploader from "nextjs-toploader";

async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-h-screen min-h-screen min-w-full flex-col bg-background">
      <NextToploader />
      <main className="flex w-full flex-grow">
        {children}
        <Toaster />
      </main>
    </div>
  );
}

export default Layout;
