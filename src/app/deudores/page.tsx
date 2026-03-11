"use client";

import { useState } from "react";
import { useFetch, formatCurrency, formatDate } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";
import type { EntidadResponse } from "@/types/bcra";
import { Search, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface ReporteCompleto {
  status: number;
  results: {
    deudas: any;
    historial: any;
    chequesRechazados: any;
    errors: string[];
  };
}

const SITUACION_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Normal", color: "text-green-600 bg-green-50" },
  2: { label: "Riesgo bajo", color: "text-yellow-600 bg-yellow-50" },
  3: { label: "Riesgo medio", color: "text-orange-600 bg-orange-50" },
  4: { label: "Riesgo alto", color: "text-red-500 bg-red-50" },
  5: { label: "Irrecuperable", color: "text-red-700 bg-red-100" },
  6: { label: "Irrecuperable por Disp. Técnica", color: "text-red-900 bg-red-200" },
};

export default function DeudoresPage() {
  const [cuit, setCuit] = useState("");
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [chequeEntidad, setChequeEntidad] = useState("");
  const [chequeNumero, setChequeNumero] = useState("");
  const [chequeUrl, setChequeUrl] = useState<string | null>(null);

  // Reporte de deudas
  const { data: reporte, loading: loadReporte, error: errReporte } =
    useFetch<ReporteCompleto>(searchUrl);

  // Cheque denunciado
  const { data: chequeData, loading: loadCheque, error: errCheque } =
    useFetch<any>(chequeUrl);

  // Entidades para el selector de cheques
  const { data: entidades } = useFetch<EntidadResponse>("/api/cheques");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const clean = cuit.replace(/\D/g, "");
    if (clean.length === 11) {
      setSearchUrl(`/api/deudores/reporte?cuit=${clean}`);
    }
  }

  function handleChequeSearch(e: React.FormEvent) {
    e.preventDefault();
    if (chequeEntidad && chequeNumero) {
      setChequeUrl(
        `/api/cheques/denunciados?entidad=${chequeEntidad}&cheque=${chequeNumero}`
      );
    }
  }

  const deudas = reporte?.results?.deudas?.results;
  const historial = reporte?.results?.historial?.results;
  const chequesRech = reporte?.results?.chequesRechazados?.results;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Consulta Crediticia</h1>
        <p className="text-gray-500 mt-1">
          Central de Deudores v1.0 + Cheques Denunciados v1.0
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Búsqueda por CUIT */}
        <Card title="Buscar por CUIT/CUIL/CDI">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              placeholder="20-12345678-9"
              maxLength={13}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-bcra-blue"
            />
            <button
              type="submit"
              className="bg-bcra-blue text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-bcra-blue/90 flex items-center gap-2"
            >
              <Search size={16} />
              Consultar
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">
            Ingresá el CUIT/CUIL/CDI sin guiones (11 dígitos)
          </p>
        </Card>

        {/* Búsqueda de cheque denunciado */}
        <Card title="Verificar Cheque Denunciado">
          <form onSubmit={handleChequeSearch} className="flex gap-2">
            <select
              value={chequeEntidad}
              onChange={(e) => setChequeEntidad(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-48"
            >
              <option value="">Entidad...</option>
              {entidades?.results?.map((e) => (
                <option key={e.codigoEntidad} value={e.codigoEntidad}>
                  {e.denominacion}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={chequeNumero}
              onChange={(e) => setChequeNumero(e.target.value)}
              placeholder="N° Cheque"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-bcra-blue"
            />
            <button
              type="submit"
              className="bg-amber-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-amber-700"
            >
              Verificar
            </button>
          </form>
        </Card>
      </div>

      {/* Resultado cheque denunciado */}
      {loadCheque && <LoadingSpinner text="Verificando cheque..." />}
      {errCheque && <ErrorAlert message={errCheque} />}
      {chequeData?.results && (
        <Card className="mb-8">
          <div className="flex items-center gap-3">
            {chequeData.results.denunciado ? (
              <>
                <XCircle className="text-red-600" size={24} />
                <div>
                  <p className="font-bold text-red-600">CHEQUE DENUNCIADO</p>
                  <p className="text-sm text-gray-500">
                    Cheque #{chequeData.results.numeroCheque} —{" "}
                    {chequeData.results.denominacionEntidad}
                  </p>
                  {chequeData.results.detalles?.map((d: any, i: number) => (
                    <p key={i} className="text-sm text-gray-600">
                      Sucursal {d.sucursal} — Cuenta {d.numeroCuenta} — {d.causal}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="text-green-600" size={24} />
                <div>
                  <p className="font-bold text-green-600">CHEQUE NO DENUNCIADO</p>
                  <p className="text-sm text-gray-500">
                    Cheque #{chequeData.results.numeroCheque} sin denuncias registradas
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Resultados del reporte crediticio */}
      {loadReporte && <LoadingSpinner text="Consultando Central de Deudores..." />}
      {errReporte && <ErrorAlert message={errReporte} />}

      {reporte?.results?.errors && reporte.results.errors.length > 0 && (
        <div className="mb-4">
          {reporte.results.errors.map((e, i) => (
            <ErrorAlert key={i} message={e} />
          ))}
        </div>
      )}

      {deudas && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-bold text-gray-900">
              Reporte: {deudas.denominacion}
            </h2>
            <span className="text-sm text-gray-400">CUIT: {deudas.identificacion}</span>
          </div>

          {/* Deudas actuales */}
          <Card title="Situación Crediticia Actual">
            {deudas.periodos?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Entidad</th>
                      <th className="text-center py-2 px-3 text-gray-500 font-medium">Situación</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Monto</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Días Atraso</th>
                      <th className="text-center py-2 px-3 text-gray-500 font-medium">Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deudas.periodos[0]?.entidades?.map((ent: any, i: number) => {
                      const sit = SITUACION_LABELS[ent.situacion] || {
                        label: `Sit. ${ent.situacion}`,
                        color: "text-gray-600 bg-gray-50",
                      };
                      return (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="py-2.5 px-3">{ent.entidad}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sit.color}`}>
                              {sit.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">
                            $ {formatCurrency(ent.monto)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {ent.diasAtrasoPago || 0}
                          </td>
                          <td className="py-2.5 px-3 text-center space-x-1">
                            {ent.refinanciaciones && (
                              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">REF</span>
                            )}
                            {ent.procesoJud && (
                              <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">JUD</span>
                            )}
                            {ent.situacionJuridica && (
                              <span className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">SIT.JUR</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Sin deudas registradas</p>
            )}
          </Card>

          {/* Historial */}
          {historial?.periodos && historial.periodos.length > 0 && (
            <Card title="Historial Crediticio (24 meses)">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Período</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Entidad</th>
                      <th className="text-center py-2 px-3 text-gray-500 font-medium">Situación</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.periodos.slice(0, 12).flatMap((p: any) =>
                      p.entidades?.map((ent: any, i: number) => {
                        const sit = SITUACION_LABELS[ent.situacion] || {
                          label: `${ent.situacion}`,
                          color: "text-gray-600 bg-gray-50",
                        };
                        return (
                          <tr key={`${p.periodo}-${i}`} className="border-b border-gray-50">
                            <td className="py-2 px-3 text-gray-500">{p.periodo}</td>
                            <td className="py-2 px-3">{ent.entidad}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sit.color}`}>
                                {sit.label}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right font-mono">
                              $ {formatCurrency(ent.monto)}
                            </td>
                          </tr>
                        );
                      }) || []
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Cheques rechazados */}
          {chequesRech?.causales && chequesRech.causales.length > 0 && (
            <Card title="Cheques Rechazados">
              <div className="flex items-center gap-2 mb-3 text-amber-600">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">
                  Se encontraron cheques rechazados
                </span>
              </div>
              {chequesRech.causales.map((causal: any, ci: number) => (
                <div key={ci} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Causal: {causal.causal}
                  </h4>
                  {causal.entidades?.flatMap((ent: any) =>
                    ent.detalle?.map((d: any, di: number) => (
                      <div
                        key={`${ci}-${di}`}
                        className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 mb-1 text-sm"
                      >
                        <span>Cheque #{d.nroCheque}</span>
                        <span>$ {formatCurrency(d.monto)}</span>
                        <span className="text-gray-400">
                          {formatDate(d.fechaRechazo)}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            d.fechaPago
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {d.fechaPago ? "Pagado" : "Impago"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
