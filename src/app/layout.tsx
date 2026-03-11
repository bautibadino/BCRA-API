import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bcra-api.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BCRA App | Datos y APIs del Banco Central",
    template: "%s | BCRA App",
  },
  description:
    "Consulta cotizaciones, deudas, tasas y productos bancarios con datos oficiales del Banco Central de la Republica Argentina.",
  applicationName: "BCRA App",
  keywords: [
    "BCRA",
    "Banco Central",
    "cotizacion dolar",
    "deudores BCRA",
    "tasas bancarias",
    "API BCRA",
    "datos economicos Argentina",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "BCRA App",
    title: "BCRA App | Datos y APIs del Banco Central",
    description:
      "Dashboard para explorar datos oficiales del BCRA: cambiarias, monetarias, deudores y transparencia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCRA App | Datos y APIs del Banco Central",
    description:
      "Visualiza indicadores, historicos y consultas oficiales del BCRA en una sola app.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
