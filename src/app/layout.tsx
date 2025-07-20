import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Calendar App",
  description: "A simple calendar application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-foreground font-sans antialiased overflow-hidden">
        <div className="grid h-screen grid-cols-[1fr_auto]">
          {/* Left: Header + Main */}
          <div className="flex flex-col h-full overflow-hidden">
            <header className="border-b px-4 py-2 shrink-0">
              <Header />
            </header>
            <main className="flex-1 overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto">{children}</div>
            </main>
          </div>

          {/* Right: Sidebar manages its own state */}
          <Sidebar />
        </div>
      </body>
    </html>
  );
}
