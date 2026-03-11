import { BarChart3, DollarSign, UserSearch, Scale } from "lucide-react";
import Link from "next/link";

const modules = [
  {
    href: "/monetarias",
    icon: BarChart3,
    title: "Dashboard Monetario",
    description: "Variables monetarias, reservas, base monetaria, tasas de interés y series estadísticas del BCRA.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    href: "/cambiarias",
    icon: DollarSign,
    title: "Monitor Cambiario",
    description: "Cotizaciones de divisas en tiempo real, históricos y evolución del tipo de cambio.",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    href: "/deudores",
    icon: UserSearch,
    title: "Consulta Crediticia",
    description: "Reporte de deudas por CUIT/CUIL, historial crediticio, cheques rechazados y denunciados.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    href: "/transparencia",
    icon: Scale,
    title: "Comparador Financiero",
    description: "Comparar plazos fijos, préstamos, tarjetas de crédito y paquetes de productos entre entidades.",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">BCRA App</h1>
        <p className="text-gray-500 mt-2">
          Dashboard integrado con las 5 APIs del Banco Central de la República Argentina.
          19 endpoints, datos en tiempo real, cache inteligente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(({ href, icon: Icon, title, description, color }) => (
          <Link
            key={href}
            href={href}
            className={`block border rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 ${color}`}
          >
            <Icon size={28} className="mb-3" />
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-sm opacity-80">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">APIs Consumidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          {[
            "Central de Deudores v1.0",
            "Cheques Denunciados v1.0",
            "Estadísticas Cambiarias v1.0",
            "Monetarias v4.0",
            "Régimen de Transparencia v1.0",
          ].map((api) => (
            <span
              key={api}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center text-gray-600"
            >
              {api}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
