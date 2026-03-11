"use client";

import { useState, useMemo } from "react";
import { useFetch, formatCurrency } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";
import type {
  PlazoFijoResponse,
  PrestamoPersonalResponse,
  PrestamoHipotecarioResponse,
  TarjetaCreditoResponse,
} from "@/types/bcra";

type ProductType = "plazos-fijos" | "personales" | "hipotecarios" | "prendarios" | "tarjetas" | "cajas-ahorro" | "paquetes";

const PRODUCT_TABS: { id: ProductType; label: string }[] = [
  { id: "plazos-fijos", label: "Plazos Fijos" },
  { id: "personales", label: "Préstamos Personales" },
  { id: "hipotecarios", label: "Préstamos Hipotecarios" },
  { id: "prendarios", label: "Préstamos Prendarios" },
  { id: "tarjetas", label: "Tarjetas de Crédito" },
  { id: "cajas-ahorro", label: "Cajas de Ahorro" },
  { id: "paquetes", label: "Paquetes" },
];

export default function TransparenciaPage() {
  const [selectedType, setSelectedType] = useState<ProductType>("plazos-fijos");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const url = `/api/transparencia?tipo=${selectedType}`;
  const { data, loading, error } = useFetch<any>(url);

  const results = data?.results || [];

  // Sorting
  const sortedResults = useMemo(() => {
    if (!sortBy || !results.length) return results;
    return [...results].sort((a: any, b: any) => {
      const va = a[sortBy] ?? 0;
      const vb = b[sortBy] ?? 0;
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return sortDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [results, sortBy, sortDir]);

  function handleSort(field: string) {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  }

  function SortHeader({ field, label }: { field: string; label: string }) {
    return (
      <th
        className="py-2 px-3 text-gray-500 font-medium cursor-pointer hover:text-bcra-blue select-none"
        onClick={() => handleSort(field)}
      >
        {label}
        {sortBy === field && (
          <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
        )}
      </th>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Comparador Financiero</h1>
        <p className="text-gray-500 mt-1">
          Régimen de Transparencia v1.0 — Compará productos entre entidades
        </p>
      </div>

      {/* Tabs de producto */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRODUCT_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setSelectedType(id); setSortBy(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === id
                ? "bg-bcra-blue text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-bcra-blue"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner text="Cargando productos..." />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {sortedResults.length} productos encontrados
            </p>
          </div>

          <div className="overflow-x-auto">
            {/* Tabla dinámica según el tipo de producto */}
            {selectedType === "plazos-fijos" && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <SortHeader field="descripcionEntidad" label="Entidad" />
                    <SortHeader field="nombreCorto" label="Producto" />
                    <SortHeader field="denominacion" label="Moneda" />
                    <SortHeader field="tasaEfectivaAnualMinima" label="TEA Mín." />
                    <SortHeader field="montoMinimoInvertir" label="Monto Mín." />
                    <SortHeader field="plazoMinimoInvertirDias" label="Plazo Mín. (días)" />
                    <th className="py-2 px-3 text-gray-500 font-medium">Canal</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-medium">{r.descripcionEntidad}</td>
                      <td className="py-2.5 px-3">{r.nombreCorto || r.nombreCompleto}</td>
                      <td className="py-2.5 px-3">{r.denominacion || "—"}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-green-600">
                        {r.tasaEfectivaAnualMinima != null ? `${r.tasaEfectivaAnualMinima}%` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {r.montoMinimoInvertir != null ? `$ ${formatCurrency(r.montoMinimoInvertir, 0)}` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">{r.plazoMinimoInvertirDias || "—"}</td>
                      <td className="py-2.5 px-3 text-gray-500">{r.canalConstitucion || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {(selectedType === "personales" || selectedType === "hipotecarios" || selectedType === "prendarios") && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <SortHeader field="descripcionEntidad" label="Entidad" />
                    <SortHeader field="nombreCorto" label="Producto" />
                    <SortHeader field="tasaEfectivaAnualMaxima" label="TEA Máx." />
                    <SortHeader field="costoFinancieroEfectivoTotalMaximo" label="CFT Máx." />
                    <SortHeader field="montoMaximoOtorgable" label="Monto Máx." />
                    <SortHeader field="plazoMaximoOtorgable" label="Plazo Máx. (meses)" />
                    <SortHeader field="ingresoMinimoMensual" label="Ingreso Mín." />
                    <th className="py-2 px-3 text-gray-500 font-medium">Tipo Tasa</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-medium">{r.descripcionEntidad}</td>
                      <td className="py-2.5 px-3">{r.nombreCorto || r.nombreCompleto}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-red-600">
                        {r.tasaEfectivaAnualMaxima != null ? `${r.tasaEfectivaAnualMaxima}%` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {r.costoFinancieroEfectivoTotalMaximo != null
                          ? `${r.costoFinancieroEfectivoTotalMaximo}%`
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {r.montoMaximoOtorgable != null
                          ? `$ ${formatCurrency(r.montoMaximoOtorgable, 0)}`
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">{r.plazoMaximoOtorgable || "—"}</td>
                      <td className="py-2.5 px-3 text-right">
                        {r.ingresoMinimoMensual != null
                          ? `$ ${formatCurrency(r.ingresoMinimoMensual, 0)}`
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500">{r.tipoTasa || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedType === "tarjetas" && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <SortHeader field="descripcionEntidad" label="Entidad" />
                    <SortHeader field="nombreCorto" label="Tarjeta" />
                    <SortHeader field="tasaEfectivaAnualMaximaFinanciacion" label="TEA Financiación" />
                    <SortHeader field="tasaEfectivaAnualMaximaAdelantoEfectivo" label="TEA Adelanto" />
                    <SortHeader field="comisionMaximaAdministracionMantenimiento" label="Comisión Mant." />
                    <SortHeader field="comisionMaximaRenovacion" label="Comisión Renov." />
                    <SortHeader field="ingresoMinimoMensual" label="Ingreso Mín." />
                    <th className="py-2 px-3 text-gray-500 font-medium">Segmento</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-medium">{r.descripcionEntidad}</td>
                      <td className="py-2.5 px-3">{r.nombreCorto || r.nombreCompleto}</td>
                      <td className="py-2.5 px-3 text-right">
                        {r.tasaEfectivaAnualMaximaFinanciacion != null
                          ? `${r.tasaEfectivaAnualMaximaFinanciacion}%`
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {r.tasaEfectivaAnualMaximaAdelantoEfectivo != null
                          ? `${r.tasaEfectivaAnualMaximaAdelantoEfectivo}%`
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {r.comisionMaximaAdministracionMantenimiento != null
                          ? `$ ${formatCurrency(r.comisionMaximaAdministracionMantenimiento, 0)}`
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {r.comisionMaximaRenovacion != null
                          ? `$ ${formatCurrency(r.comisionMaximaRenovacion, 0)}`
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {r.ingresoMinimoMensual != null
                          ? `$ ${formatCurrency(r.ingresoMinimoMensual, 0)}`
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500">{r.segmento || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {(selectedType === "cajas-ahorro" || selectedType === "paquetes") && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <SortHeader field="descripcionEntidad" label="Entidad" />
                    {selectedType === "paquetes" && (
                      <>
                        <SortHeader field="nombreCorto" label="Paquete" />
                        <SortHeader field="comisionMaximaMantenimiento" label="Comisión Mant." />
                        <SortHeader field="ingresoMinimoMensual" label="Ingreso Mín." />
                        <th className="py-2 px-3 text-gray-500 font-medium">Segmento</th>
                        <th className="py-2 px-3 text-gray-500 font-medium">Productos</th>
                      </>
                    )}
                    {selectedType === "cajas-ahorro" && (
                      <>
                        <th className="py-2 px-3 text-gray-500 font-medium">Fecha Info</th>
                        <th className="py-2 px-3 text-gray-500 font-medium">Proc. Simplificado</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-medium">{r.descripcionEntidad}</td>
                      {selectedType === "paquetes" && (
                        <>
                          <td className="py-2.5 px-3">{r.nombreCorto || r.nombreCompleto}</td>
                          <td className="py-2.5 px-3 text-right">
                            {r.comisionMaximaMantenimiento != null
                              ? `$ ${formatCurrency(r.comisionMaximaMantenimiento, 0)}`
                              : "—"}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {r.ingresoMinimoMensual != null
                              ? `$ ${formatCurrency(r.ingresoMinimoMensual, 0)}`
                              : "—"}
                          </td>
                          <td className="py-2.5 px-3 text-gray-500">{r.segmento || "—"}</td>
                          <td className="py-2.5 px-3 text-gray-500 text-xs max-w-xs truncate">
                            {r.productosIntegrantes || "—"}
                          </td>
                        </>
                      )}
                      {selectedType === "cajas-ahorro" && (
                        <>
                          <td className="py-2.5 px-3 text-gray-500">{r.fechaInformacion || "—"}</td>
                          <td className="py-2.5 px-3">{r.procesoSimplificadoDebidaDiligencia || "—"}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
