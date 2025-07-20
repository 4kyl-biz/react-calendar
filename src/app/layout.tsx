import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "lucide-react";

export const metadata: Metadata = {
  title: "Calendar App",
  description: "A simple calendar application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-foreground font-sans antialiased">
        <div className="grid h-screen grid-cols-[1fr_240px]">
          {/* Left side: header + main */}
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header at top */}
            <header className="border-b px-4 py-2 shrink-0">
              <Header />
            </header>

            {/* Scrollable main content */}
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
          </div>

          {/* Sidebar always on right */}
          <aside className="border-l p-4 h-full overflow-y-auto">
            <Sidebar />
          </aside>
        </div>
      </body>
    </html>
  );
}
