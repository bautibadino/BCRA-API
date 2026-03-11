"use client";

import { useMemo, useState } from "react";
import { useFetch, formatCurrency, formatDate } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";
import type { EntidadResponse } from "@/types/bcra";
import { Search, AlertTriangle, CheckCircle, XCircle, ShieldCheck, CircleAlert } from "lucide-react";

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
  1: { label: "Normal", color: "text-emerald-700 bg-emerald-100" },
  2: { label: "Riesgo bajo", color: "text-yellow-700 bg-yellow-100" },
  3: { label: "Riesgo medio", color: "text-orange-700 bg-orange-100" },
  4: { label: "Riesgo alto", color: "text-rose-700 bg-rose-100" },
  5: { label: "Irrecuperable", color: "text-red-800 bg-red-100" },
  6: { label: "Irrecuperable tecnica", color: "text-red-900 bg-red-200" },
};

export default function DeudoresPage() {
  const [cuit, setCuit] = useState("");
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [chequeEntidad, setChequeEntidad] = useState("");
  const [chequeNumero, setChequeNumero] = useState("");
  const [chequeUrl, setChequeUrl] = useState<string | null>(null);

  const { data: reporte, loading: loadReporte, error: errReporte } = useFetch<ReporteCompleto>(searchUrl);
  const { data: chequeData, loading: loadCheque, error: errCheque } = useFetch<any>(chequeUrl);
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
      setChequeUrl(`/api/cheques/denunciados?entidad=${chequeEntidad}&cheque=${chequeNumero}`);
    }
  }

  const deudas = reporte?.results?.deudas?.results;
  const historial = reporte?.results?.historial?.results;
  const chequesRech = reporte?.results?.chequesRechazados?.results;
  const apiErrors = reporte?.results?.errors ?? [];
  const entidadesActuales = deudas?.periodos?.[0]?.entidades || [];

  const resumen = useMemo(() => {
    if (!entidadesActuales.length) return null;
    const peor = entidadesActuales.reduce((max: number, item: any) => Math.max(max, item.situacion || 0), 0);
    const montoTotal = entidadesActuales.reduce((acc: number, item: any) => acc + (item.monto || 0), 0);
    return {
      peor,
      montoTotal,
      entidades: entidadesActuales.length,
    };
  }, [entidadesActuales]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 animate-fade-in">
      <section className="surface-panel rounded-3xl bg-gradient-to-r from-slate-900 to-bcra-blue p-5 text-white md:p-7">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-200">Consulta prioritaria</p>
        <h1 className="text-2xl font-bold md:text-3xl">Consulta Crediticia</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-200">
          Mira tu situacion en segundos: deudas activas, historial y chequeos de seguridad.
          Diseñado para uso rapido desde celular.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Buscar por CUIT/CUIL/CDI" subtitle="Ingresa 11 digitos para ver el reporte completo.">
          <form onSubmit={handleSearch} className="space-y-3">
            <input
              type="text"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              placeholder="20-12345678-9"
              maxLength={13}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:border-bcra-blue focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bcra-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-bcra-blue/90"
            >
              <Search size={16} />
              Consultar historial crediticio
            </button>
          </form>
        </Card>

        <Card title="Verificar cheque denunciado" subtitle="Antes de aceptar un cheque, confirma si tiene denuncia.">
          <form onSubmit={handleChequeSearch} className="space-y-3">
            <select
              value={chequeEntidad}
              onChange={(e) => setChequeEntidad(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
            >
              <option value="">Selecciona entidad</option>
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
              placeholder="Numero de cheque"
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm focus:border-bcra-blue focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700"
            >
              <ShieldCheck size={16} />
              Verificar cheque
            </button>
          </form>
        </Card>
      </div>

      {loadCheque && <LoadingSpinner text="Verificando cheque..." />}
      {errCheque && <ErrorAlert message={errCheque} />}
      {chequeData?.results && (
        <Card>
          <div className="flex items-start gap-3">
            {chequeData.results.denunciado ? (
              <XCircle className="mt-1 text-red-600" size={24} />
            ) : (
              <CheckCircle className="mt-1 text-emerald-600" size={24} />
            )}
            <div className="space-y-1">
              <p className={`text-base font-bold ${chequeData.results.denunciado ? "text-red-700" : "text-emerald-700"}`}>
                {chequeData.results.denunciado ? "Cheque denunciado" : "Cheque sin denuncias"}
              </p>
              <p className="text-sm text-slate-500">
                Nro {chequeData.results.numeroCheque} - {chequeData.results.denominacionEntidad}
              </p>
              {chequeData.results.detalles?.map((d: any, i: number) => (
                <p key={i} className="text-sm text-slate-600">
                  Sucursal {d.sucursal} | Cuenta {d.numeroCuenta} | {d.causal}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      {loadReporte && <LoadingSpinner text="Consultando Central de Deudores..." />}
      {errReporte && <ErrorAlert message={errReporte} />}

      {apiErrors.length > 0 && (
        <div className="space-y-2">
          {apiErrors.map((e, i) => (
            <ErrorAlert key={i} message={e} />
          ))}
        </div>
      )}

      {deudas && (
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Titular consultado</p>
                <h2 className="text-xl font-bold text-slate-900">{deudas.denominacion}</h2>
                <p className="text-sm text-slate-500">CUIT: {deudas.identificacion}</p>
              </div>
              {resumen && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <p className="mb-1 font-semibold text-slate-700">Semaforo crediticio</p>
                  <p className="text-slate-600">{SITUACION_LABELS[resumen.peor]?.label || `Situacion ${resumen.peor}`}</p>
                  <p className="text-slate-600">Deuda total: $ {formatCurrency(resumen.montoTotal)}</p>
                  <p className="text-slate-600">Entidades: {resumen.entidades}</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Situacion crediticia actual">
            {entidadesActuales.length > 0 ? (
              <div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-3 py-2 text-left font-medium text-slate-500">Entidad</th>
                        <th className="px-3 py-2 text-center font-medium text-slate-500">Situacion</th>
                        <th className="px-3 py-2 text-right font-medium text-slate-500">Monto</th>
                        <th className="px-3 py-2 text-right font-medium text-slate-500">Dias atraso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entidadesActuales.map((ent: any, i: number) => {
                        const sit = SITUACION_LABELS[ent.situacion] || {
                          label: `Sit. ${ent.situacion}`,
                          color: "text-slate-700 bg-slate-100",
                        };
                        return (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="px-3 py-2.5">{ent.entidad}</td>
                            <td className="px-3 py-2.5 text-center">
                              <span className={`rounded-full px-2 py-1 text-xs font-medium ${sit.color}`}>{sit.label}</span>
                            </td>
                            <td className="px-3 py-2.5 text-right">$ {formatCurrency(ent.monto)}</td>
                            <td className="px-3 py-2.5 text-right">{ent.diasAtrasoPago || 0}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 md:hidden">
                  {entidadesActuales.map((ent: any, i: number) => {
                    const sit = SITUACION_LABELS[ent.situacion] || {
                      label: `Sit. ${ent.situacion}`,
                      color: "text-slate-700 bg-slate-100",
                    };
                    return (
                      <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                        <p className="font-semibold text-slate-800">{ent.entidad}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${sit.color}`}>{sit.label}</span>
                          <span className="text-slate-600">$ {formatCurrency(ent.monto)}</span>
                          <span className="text-slate-500">Atraso: {ent.diasAtrasoPago || 0} dias</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No hay deudas registradas para el periodo actual.</p>
            )}
          </Card>

          {historial?.periodos?.length > 0 && (
            <Card title="Historial crediticio reciente">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-3 py-2 text-left font-medium text-slate-500">Periodo</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-500">Entidad</th>
                      <th className="px-3 py-2 text-center font-medium text-slate-500">Situacion</th>
                      <th className="px-3 py-2 text-right font-medium text-slate-500">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.periodos.slice(0, 12).flatMap((p: any) =>
                      p.entidades?.map((ent: any, i: number) => {
                        const sit = SITUACION_LABELS[ent.situacion] || {
                          label: `${ent.situacion}`,
                          color: "text-slate-700 bg-slate-100",
                        };
                        return (
                          <tr key={`${p.periodo}-${i}`} className="border-b border-slate-100">
                            <td className="px-3 py-2">{p.periodo}</td>
                            <td className="px-3 py-2">{ent.entidad}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sit.color}`}>{sit.label}</span>
                            </td>
                            <td className="px-3 py-2 text-right">$ {formatCurrency(ent.monto)}</td>
                          </tr>
                        );
                      }) || []
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {chequesRech?.causales?.length > 0 && (
            <Card title="Cheques rechazados">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                <CircleAlert size={14} />
                Se encontraron rechazos en el historial
              </div>
              <div className="space-y-3">
                {chequesRech.causales.map((causal: any, ci: number) => (
                  <div key={ci} className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                    <p className="mb-2 text-sm font-semibold text-slate-800">Causal: {causal.causal}</p>
                    <div className="space-y-1">
                      {causal.entidades?.flatMap((ent: any) =>
                        ent.detalle?.map((d: any, di: number) => (
                          <div
                            key={`${ci}-${di}`}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                          >
                            <span>Cheque #{d.nroCheque}</span>
                            <span>$ {formatCurrency(d.monto)}</span>
                            <span>{formatDate(d.fechaRechazo)}</span>
                            <span className={`rounded-full px-2 py-0.5 ${d.fechaPago ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                              {d.fechaPago ? "Pagado" : "Impago"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
        <div className="mb-1 inline-flex items-center gap-1 font-semibold">
          <AlertTriangle size={14} />
          Consejo rapido
        </div>
        Verifica siempre la fecha del reporte y cruza esta informacion con tu banco antes de tomar decisiones.
      </div>
    </div>
  );
}
