import { deudores } from "@/lib/bcra-client";
import type {
  DeudaResponse,
  HistorialResponse,
  ChequesRechazadosResponse,
} from "@/types/bcra";

/**
 * Servicio de Central de Deudores.
 * SIN CACHE — datos personales, siempre frescos desde el BCRA.
 */
export const deudoresService = {
  async getDeudas(cuit: number): Promise<DeudaResponse> {
    return deudores.getDeudas(cuit) as Promise<DeudaResponse>;
  },

  async getDeudasHistoricas(cuit: number): Promise<HistorialResponse> {
    return deudores.getDeudasHistoricas(cuit) as Promise<HistorialResponse>;
  },

  async getChequesRechazados(cuit: number): Promise<ChequesRechazadosResponse> {
    return deudores.getChequesRechazados(cuit) as Promise<ChequesRechazadosResponse>;
  },

  /**
   * Consulta consolidada: obtiene deudas + historial + cheques rechazados
   * en paralelo para un CUIT.
   */
  async getReporteCompleto(cuit: number) {
    const [deudasRes, historialRes, chequesRes] = await Promise.allSettled([
      this.getDeudas(cuit),
      this.getDeudasHistoricas(cuit),
      this.getChequesRechazados(cuit),
    ]);

    return {
      deudas: deudasRes.status === "fulfilled" ? deudasRes.value : null,
      historial: historialRes.status === "fulfilled" ? historialRes.value : null,
      chequesRechazados: chequesRes.status === "fulfilled" ? chequesRes.value : null,
      errors: [deudasRes, historialRes, chequesRes]
        .filter((r) => r.status === "rejected")
        .map((r) => (r as PromiseRejectedResult).reason?.message || "Error desconocido"),
    };
  },
};
