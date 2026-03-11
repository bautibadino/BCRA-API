import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "BCRA App — API del Banco Central",
  description: "Dashboard completo para las APIs del Banco Central de la República Argentina",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={dmSans.className}>
        <div className="min-h-screen md:flex">
          <Sidebar />
          <main className="flex-1 px-4 pb-24 pt-4 md:overflow-auto md:p-8 md:pb-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
