import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "BCRA App — API del Banco Central",
  description: "Dashboard completo para las APIs del Banco Central de la República Argentina",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
