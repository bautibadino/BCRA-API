"use client";

import { useState, useMemo } from "react";
import { useFetch, formatCurrency, formatDate } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";
import type {
  DivisaResponse,
  CotizacionDiaResponse,
  CotizacionesHistoricasResponse,
} from "@/types/bcra";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function CambiariasPage() {
  const [selectedMoneda, setSelectedMoneda] = useState("USD");
  const [dateRange, setDateRange] = useState({
    desde: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hasta: new Date().toISOString().split("T")[0],
  });

  // Datos
  const { data: divisas } = useFetch<DivisaResponse>("/api/cambiarias/divisas");
  const { data: cotizHoy, loading: loadHoy, error: errHoy } =
    useFetch<CotizacionDiaResponse>("/api/cambiarias");
  const { data: historico, loading: loadHist, error: errHist } =
    useFetch<CotizacionesHistoricasResponse>(
      `/api/cambiarias/historico?moneda=${selectedMoneda}&desde=${dateRange.desde}&hasta=${dateRange.hasta}&limit=500`
    );

  // Monedas populares para acceso rápido
  const monedasPopulares = ["USD", "EUR", "BRL", "GBP", "JPY", "CNY"];

  // Cotización actual del USD
  const usdHoy = useMemo(() => {
    if (!cotizHoy?.results?.detalle) return null;
    return cotizHoy.results.detalle.find((d) => d.codigoMoneda === "USD");
  }, [cotizHoy]);

  const eurHoy = useMemo(() => {
    if (!cotizHoy?.results?.detalle) return null;
    return cotizHoy.results.detalle.find((d) => d.codigoMoneda === "EUR");
  }, [cotizHoy]);

  const brlHoy = useMemo(() => {
    if (!cotizHoy?.results?.detalle) return null;
    return cotizHoy.results.detalle.find((d) => d.codigoMoneda === "BRL");
  }, [cotizHoy]);

  // Chart data
  const chartData = useMemo(() => {
    if (!historico?.results) return [];
    return historico.results.map((r) => {
      const det = r.detalle?.[0];
      return {
        fecha: formatDate(r.fecha),
        cotizacion: det?.tipoCotizacion || 0,
      };
    });
  }, [historico]);

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Monitor Cambiario</h1>
        <p className="text-gray-500 mt-1">
          Cotizaciones de divisas — Estadísticas Cambiarias v1.0
          {cotizHoy?.results?.fecha && (
            <span className="ml-2 text-gray-400">
              Fecha: {formatDate(cotizHoy.results.fecha)}
            </span>
          )}
        </p>
      </div>

      {loadHoy && <LoadingSpinner text="Cargando cotizaciones del día..." />}
      {errHoy && <ErrorAlert message={errHoy} />}

      {/* Stat cards principales */}
      {!loadHoy && !errHoy && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Dólar (USD)"
            value={usdHoy ? `$ ${formatCurrency(usdHoy.tipoCotizacion)}` : "—"}
            icon={<DollarSign size={18} />}
          />
          <StatCard
            label="Euro (EUR)"
            value={eurHoy ? `$ ${formatCurrency(eurHoy.tipoCotizacion)}` : "—"}
            icon={<TrendingUp size={18} />}
          />
          <StatCard
            label="Real (BRL)"
            value={brlHoy ? `$ ${formatCurrency(brlHoy.tipoCotizacion)}` : "—"}
            icon={<TrendingDown size={18} />}
          />
        </div>
      )}

      {/* Tabla de todas las cotizaciones del día */}
      {cotizHoy?.results?.detalle && (
        <Card title="Todas las Cotizaciones del Día" className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Moneda</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Descripción</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Tipo Cotización</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Tipo Pase</th>
                </tr>
              </thead>
              <tbody>
                {cotizHoy.results.detalle.map((d, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                    onClick={() => d.codigoMoneda && setSelectedMoneda(d.codigoMoneda)}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-bcra-blue">
                      {d.codigoMoneda}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">{d.descripcion}</td>
                    <td className="py-2.5 px-3 text-right font-medium">
                      $ {formatCurrency(d.tipoCotizacion)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-500">
                      {d.tipoPase ? formatCurrency(d.tipoPase) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Histórico */}
      <Card title={`Evolución Histórica — ${selectedMoneda}`}>
        <div className="flex flex-wrap gap-2 mb-4">
          {monedasPopulares.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMoneda(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedMoneda === m
                  ? "bg-bcra-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m}
            </button>
          ))}
          {divisas?.results && (
            <select
              value={selectedMoneda}
              onChange={(e) => setSelectedMoneda(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs"
            >
              {divisas.results.map((d) => (
                <option key={d.codigo} value={d.codigo}>
                  {d.codigo} — {d.denominacion}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-3 items-center mb-4">
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

        {loadHist && <LoadingSpinner text="Cargando histórico..." />}
        {errHist && <ErrorAlert message={errHist} />}

        {!loadHist && !errHist && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCotiz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003366" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#003366" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`$ ${formatCurrency(v)}`, "Cotización"]} />
              <Area
                type="monotone"
                dataKey="cotizacion"
                stroke="#003366"
                strokeWidth={2}
                fill="url(#colorCotiz)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
