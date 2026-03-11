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
    <aside className="w-64 bg-bcra-dark min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-white font-bold text-lg">BCRA App</h1>
        <p className="text-gray-400 text-xs mt-1">API del Banco Central</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-4 mt-4 px-2">
        <p className="text-gray-500 text-xs">
          Datos: api.bcra.gob.ar
        </p>
      </div>
    </aside>
  );
}
