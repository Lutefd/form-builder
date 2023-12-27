import { Toaster } from "@/components/ui/toaster";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import React, { type ReactNode } from "react";

async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex max-h-screen min-h-screen min-w-full flex-col bg-background">
      <main className="flex w-full flex-grow">
        {children}
        <Toaster />
      </main>
    </div>
  );
}

export default Layout;
