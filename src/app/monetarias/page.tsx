"use client";

import { useState, useMemo } from "react";
import { useFetch, formatCurrency, formatDate } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";
import type { MonetariasResponse, DatosMonetariaResponse } from "@/types/bcra";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Variables populares para mostrar por defecto
const VARIABLES_DESTACADAS = [
  { id: 1, label: "Reservas Internacionales" },
  { id: 15, label: "Tasa de Política Monetaria" },
  { id: 4, label: "Base Monetaria" },
  { id: 5, label: "Depósitos en Pesos" },
];

export default function MonetariasPage() {
  const [selectedVar, setSelectedVar] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({
    desde: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hasta: new Date().toISOString().split("T")[0],
  });

  // Catálogo de variables
  const { data: catalogData, loading: catalogLoading, error: catalogError } =
    useFetch<MonetariasResponse>("/api/monetarias?Limit=500");

  // Datos de la variable seleccionada
  const dataUrl = `/api/monetarias/datos?id=${selectedVar}&desde=${dateRange.desde}&hasta=${dateRange.hasta}&limit=500`;
  const { data: varData, loading: varLoading, error: varError } =
    useFetch<DatosMonetariaResponse>(dataUrl);

  // Info de la variable seleccionada
  const selectedInfo = useMemo(
    () => catalogData?.results?.find((v) => v.idVariable === selectedVar),
    [catalogData, selectedVar]
  );

  // Datos para el gráfico
  const chartData = useMemo(() => {
    if (!varData?.results?.[0]?.detalle) return [];
    return varData.results[0].detalle.map((d) => ({
      fecha: d.fecha,
      valor: d.valor,
      label: formatDate(d.fecha),
    }));
  }, [varData]);

  // Filtrar catálogo
  const filteredVars = useMemo(() => {
    if (!catalogData?.results) return [];
    if (!search) return catalogData.results.slice(0, 50);
    const s = search.toLowerCase();
    return catalogData.results.filter(
      (v) =>
        v.descripcion?.toLowerCase().includes(s) ||
        v.categoria?.toLowerCase().includes(s)
    );
  }, [catalogData, search]);

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Monetario</h1>
        <p className="text-gray-500 mt-1">
          Estadísticas monetarias y series del Informe Monetario Diario — API v4.0
        </p>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {VARIABLES_DESTACADAS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelectedVar(id)}
            className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
              selectedVar === id
                ? "bg-bcra-blue text-white border-bcra-blue"
                : "bg-white text-gray-700 border-gray-200 hover:border-bcra-blue"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo: selector de variables */}
        <Card title="Variables" className="lg:col-span-1 max-h-[600px] overflow-hidden flex flex-col">
          <input
            type="text"
            placeholder="Buscar variable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-bcra-blue"
          />

          {catalogLoading && <LoadingSpinner text="Cargando catálogo..." />}
          {catalogError && <ErrorAlert message={catalogError} />}

          <div className="overflow-y-auto flex-1 space-y-1">
            {filteredVars.map((v) => (
              <button
                key={v.idVariable}
                onClick={() => setSelectedVar(v.idVariable)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                  selectedVar === v.idVariable
                    ? "bg-blue-50 text-bcra-blue font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-gray-400 mr-1">#{v.idVariable}</span>
                {v.descripcion}
                {v.ultValorInformado != null && (
                  <span className="block text-gray-400 mt-0.5">
                    Último: {formatCurrency(v.ultValorInformado)} ({v.ultFechaInformada})
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Panel derecho: gráfico y detalles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info de la variable */}
          {selectedInfo && (
            <Card>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">Variable</span>
                  <span className="font-semibold">{selectedInfo.descripcion}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Categoría</span>
                  <span>{selectedInfo.categoria || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Periodicidad</span>
                  <span>{selectedInfo.periodicidad || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Moneda</span>
                  <span>{selectedInfo.moneda || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Último valor</span>
                  <span className="font-bold text-lg">
                    {selectedInfo.ultValorInformado != null
                      ? formatCurrency(selectedInfo.ultValorInformado)
                      : "—"}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Rango de fechas */}
          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={dateRange.desde}
              onChange={(e) => setDateRange((r) => ({ ...r, desde: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-gray-400">a</span>
            <input
              type="date"
              value={dateRange.hasta}
              onChange={(e) => setDateRange((r) => ({ ...r, hasta: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Gráfico */}
          <Card title="Evolución Temporal">
            {varLoading && <LoadingSpinner text="Cargando datos..." />}
            {varError && <ErrorAlert message={varError} />}
            {!varLoading && !varError && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Valor"]}
                    labelFormatter={(label: string) => `Fecha: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#003366"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {!varLoading && !varError && chartData.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">
                No hay datos para el rango seleccionado
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
