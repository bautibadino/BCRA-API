"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  DollarSign,
  UserSearch,
  Scale,
  Home,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/monetarias", label: "Dashboard Monetario", icon: BarChart3 },
  { href: "/cambiarias", label: "Monitor Cambiario", icon: DollarSign },
  { href: "/deudores", label: "Consulta Crediticia", icon: UserSearch },
  { href: "/transparencia", label: "Comparador Financiero", icon: Scale },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="sticky top-0 z-20 mb-4 rounded-2xl border border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-slate-900">BCRA App</p>
            <p className="text-xs text-slate-500">Herramientas financieras simples</p>
          </div>
          <span className="pill-tag">Mobile</span>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex min-w-max items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-bcra-blue bg-bcra-blue text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <aside className="surface-panel sticky top-4 hidden h-fit max-h-[calc(100vh-2rem)] w-72 shrink-0 self-start overflow-y-auto p-5 md:flex md:flex-col">
        <div className="mb-7 rounded-xl bg-slate-900 px-4 py-4 text-white">
          <h1 className="text-lg font-bold">BCRA App</h1>
          <p className="mt-1 text-xs text-slate-300">API del Banco Central para usuarios reales</p>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-bcra-blue text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">
          <p>Datos oficiales: api.bcra.gob.ar</p>
          <p className="mt-1">
            dev: bautista badino -{" "}
            <a
              href="https://x.com/BadinoBautista"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-bcra-blue hover:underline"
            >
              @BadinoBautista
            </a>
          </p>
        </div>
      </aside>
    </>
  );
}
