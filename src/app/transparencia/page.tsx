"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Filter, Landmark } from "lucide-react";
import { useFetch, formatCurrency } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";

type ProductType = "plazos-fijos" | "personales" | "hipotecarios" | "prendarios" | "tarjetas" | "cajas-ahorro" | "paquetes";
type FieldKind = "text" | "percent" | "currency";

interface ProductField {
  key: string;
  label: string;
  kind: FieldKind;
}

const PRODUCT_TABS: { id: ProductType; label: string }[] = [
  { id: "plazos-fijos", label: "Plazos Fijos" },
  { id: "personales", label: "Prestamos Personales" },
  { id: "hipotecarios", label: "Prestamos Hipotecarios" },
  { id: "prendarios", label: "Prestamos Prendarios" },
  { id: "tarjetas", label: "Tarjetas" },
  { id: "cajas-ahorro", label: "Cajas de Ahorro" },
  { id: "paquetes", label: "Paquetes" },
];

const FIELD_CONFIG: Record<ProductType, ProductField[]> = {
  "plazos-fijos": [
    { key: "tasaEfectivaAnualMinima", label: "TEA min", kind: "percent" },
    { key: "montoMinimoInvertir", label: "Monto min", kind: "currency" },
    { key: "plazoMinimoInvertirDias", label: "Plazo min (dias)", kind: "text" },
    { key: "canalConstitucion", label: "Canal", kind: "text" },
  ],
  personales: [
    { key: "tasaEfectivaAnualMaxima", label: "TEA max", kind: "percent" },
    { key: "costoFinancieroEfectivoTotalMaximo", label: "CFT max", kind: "percent" },
    { key: "montoMaximoOtorgable", label: "Monto max", kind: "currency" },
    { key: "ingresoMinimoMensual", label: "Ingreso min", kind: "currency" },
  ],
  hipotecarios: [
    { key: "tasaEfectivaAnualMaxima", label: "TEA max", kind: "percent" },
    { key: "costoFinancieroEfectivoTotalMaximo", label: "CFT max", kind: "percent" },
    { key: "montoMaximoOtorgable", label: "Monto max", kind: "currency" },
    { key: "plazoMaximoOtorgable", label: "Plazo max", kind: "text" },
  ],
  prendarios: [
    { key: "tasaEfectivaAnualMaxima", label: "TEA max", kind: "percent" },
    { key: "costoFinancieroEfectivoTotalMaximo", label: "CFT max", kind: "percent" },
    { key: "montoMaximoOtorgable", label: "Monto max", kind: "currency" },
    { key: "plazoMaximoOtorgable", label: "Plazo max", kind: "text" },
  ],
  tarjetas: [
    { key: "tasaEfectivaAnualMaximaFinanciacion", label: "TEA financiacion", kind: "percent" },
    { key: "tasaEfectivaAnualMaximaAdelantoEfectivo", label: "TEA adelanto", kind: "percent" },
    { key: "comisionMaximaAdministracionMantenimiento", label: "Comision mant", kind: "currency" },
    { key: "ingresoMinimoMensual", label: "Ingreso min", kind: "currency" },
  ],
  "cajas-ahorro": [
    { key: "fechaInformacion", label: "Fecha", kind: "text" },
    { key: "procesoSimplificadoDebidaDiligencia", label: "Proc. simplificado", kind: "text" },
    { key: "codigoEntidad", label: "Codigo", kind: "text" },
    { key: "moneda", label: "Moneda", kind: "text" },
  ],
  paquetes: [
    { key: "comisionMaximaMantenimiento", label: "Comision mant", kind: "currency" },
    { key: "ingresoMinimoMensual", label: "Ingreso min", kind: "currency" },
    { key: "segmento", label: "Segmento", kind: "text" },
    { key: "productosIntegrantes", label: "Incluye", kind: "text" },
  ],
};

function formatField(value: any, kind: FieldKind) {
  if (value == null || value === "") return "-";
  if (kind === "currency") return `$ ${formatCurrency(Number(value), 0)}`;
  if (kind === "percent") return `${value}%`;
  return String(value);
}

export default function TransparenciaPage() {
  const [selectedType, setSelectedType] = useState<ProductType>("plazos-fijos");
  const [sortBy, setSortBy] = useState<string>("descripcionEntidad");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [query, setQuery] = useState("");

  const { data, loading, error } = useFetch<any>(`/api/transparencia?tipo=${selectedType}`);
  const results = data?.results || [];
  const fields = FIELD_CONFIG[selectedType];

  const filteredResults = useMemo(() => {
    if (!query) return results;
    const q = query.toLowerCase();
    return results.filter((item: any) => {
      const entidad = String(item.descripcionEntidad || "").toLowerCase();
      const nombre = String(item.nombreCorto || item.nombreCompleto || "").toLowerCase();
      return entidad.includes(q) || nombre.includes(q);
    });
  }, [results, query]);

  const sortedResults = useMemo(() => {
    if (!sortBy) return filteredResults;
    return [...filteredResults].sort((a: any, b: any) => {
      const va = a[sortBy] ?? "";
      const vb = b[sortBy] ?? "";
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [filteredResults, sortBy, sortDir]);

  function onSort(field: string) {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(field);
    setSortDir("asc");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 animate-fade-in">
      <section className="surface-panel rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-700 p-5 text-white md:p-7">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-emerald-100">Consulta prioritaria</p>
        <h1 className="text-2xl font-bold md:text-3xl">Comparador Financiero</h1>
        <p className="mt-2 max-w-3xl text-sm text-emerald-100">
          Compara bancos en un lenguaje claro y elige mejor. Vista optimizada para telefono y uso cotidiano.
        </p>
      </section>

      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          {PRODUCT_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                setSelectedType(id);
                setSortBy("descripcionEntidad");
                setSortDir("asc");
              }}
              className={`rounded-full border px-3 py-2 text-xs font-semibold md:text-sm ${
                selectedType === id
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
            <Landmark size={14} />
            {sortedResults.length} productos disponibles
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar por banco o producto"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm md:max-w-xs"
          />
        </div>
      </Card>

      {loading && <LoadingSpinner text="Cargando productos..." />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (
        <>
          <Card title="Comparacion rapida (mobile)">
            <div className="space-y-3 md:hidden">
              {sortedResults.slice(0, 40).map((r: any, i: number) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{r.descripcionEntidad || "Entidad"}</p>
                  <p className="text-xs text-slate-500">{r.nombreCorto || r.nombreCompleto || "Producto"}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    {fields.slice(0, 3).map((field) => (
                      <div key={`${i}-${field.key}`} className="rounded-lg bg-white px-2 py-1.5">
                        <p className="text-slate-500">{field.label}</p>
                        <p className="font-semibold text-slate-800">{formatField(r[field.key], field.kind)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-3 py-2 font-medium text-slate-500">
                      <button onClick={() => onSort("descripcionEntidad")} className="inline-flex items-center gap-1 hover:text-slate-800">
                        Entidad
                        <ArrowDownUp size={13} />
                      </button>
                    </th>
                    <th className="px-3 py-2 font-medium text-slate-500">
                      <button onClick={() => onSort("nombreCorto")} className="inline-flex items-center gap-1 hover:text-slate-800">
                        Producto
                        <Filter size={13} />
                      </button>
                    </th>
                    {fields.map((field) => (
                      <th key={field.key} className="px-3 py-2 font-medium text-slate-500">
                        <button onClick={() => onSort(field.key)} className="inline-flex items-center gap-1 hover:text-slate-800">
                          {field.label}
                          <ArrowDownUp size={13} />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="px-3 py-2.5 font-medium text-slate-800">{r.descripcionEntidad || "-"}</td>
                      <td className="px-3 py-2.5 text-slate-600">{r.nombreCorto || r.nombreCompleto || "-"}</td>
                      {fields.map((field) => (
                        <td key={`${i}-${field.key}`} className="px-3 py-2.5 text-slate-600">
                          {formatField(r[field.key], field.kind)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
