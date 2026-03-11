import { BarChart3, DollarSign, UserSearch, Scale, Sparkles } from "lucide-react";
import Link from "next/link";

const modules = [
  {
    href: "/deudores",
    icon: UserSearch,
    title: "Consulta Crediticia",
    description: "Chequeá deudas y alertas por CUIT/CUIL en pocos pasos.",
    color: "from-amber-100 to-orange-50 border-amber-200",
    priority: true,
  },
  {
    href: "/transparencia",
    icon: Scale,
    title: "Comparador Financiero",
    description: "Compará productos y costos entre bancos sin tecnicismos.",
    color: "from-emerald-100 to-teal-50 border-emerald-200",
    priority: true,
  },
  {
    href: "/monetarias",
    icon: BarChart3,
    title: "Dashboard Monetario",
    description: "Variables macro, tasas y series oficiales del BCRA.",
    color: "from-blue-100 to-sky-50 border-blue-200",
  },
  {
    href: "/cambiarias",
    icon: DollarSign,
    title: "Monitor Cambiario",
    description: "Cotizaciones al día e histórico por moneda.",
    color: "from-cyan-100 to-blue-50 border-cyan-200",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <div className="surface-panel mb-6 overflow-hidden rounded-3xl">
        <div className="bg-gradient-to-r from-slate-900 via-bcra-blue to-slate-800 p-5 text-white md:p-8">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Sparkles size={14} />
            Hecho para el usuario comun
          </p>
          <h1 className="text-2xl font-bold md:text-4xl">Tu panel BCRA simple y claro</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
            Elegi una herramienta y resolvelo rapido: situacion crediticia personal,
            comparador de bancos y tableros economicos oficiales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {modules.map(({ href, icon: Icon, title, description, color, priority }) => (
          <Link
            key={href}
            href={href}
            className={`group block rounded-2xl border bg-gradient-to-br p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg md:p-6 ${color}`}
          >
            <div className="mb-4 flex items-start justify-between">
              <Icon size={26} className="text-slate-700" />
              {priority && <span className="pill-tag border-amber-300 bg-white/80 text-amber-700">Prioritario</span>}
            </div>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-600">{description}</p>
            <p className="mt-4 text-sm font-medium text-slate-800 group-hover:underline">Abrir modulo</p>
          </Link>
        ))}
      </div>

      <div className="surface-panel mt-8 rounded-2xl p-4 md:p-6">
        <h3 className="mb-3 font-semibold text-slate-900">APIs consumidas</h3>
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5 md:gap-3 md:text-sm">
          {[
            "Central de Deudores v1.0",
            "Cheques Denunciados v1.0",
            "Estadísticas Cambiarias v1.0",
            "Monetarias v4.0",
            "Régimen de Transparencia v1.0",
          ].map((api) => (
            <span
              key={api}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-slate-600"
            >
              {api}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
