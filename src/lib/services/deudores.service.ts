import { BCRAClientError, deudores } from "@/lib/bcra-client";
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

    const normalizeError = (reason: unknown): string => {
      if (reason instanceof Error) return reason.message;
      return "Error desconocido";
    };

    const shouldIgnoreError = (reason: unknown): boolean => {
      if (!(reason instanceof BCRAClientError)) return false;
      const isChequesRechazadosEndpoint = reason.endpoint.includes("/Deudas/ChequesRechazados/");
      const hasNoDataMessage = reason.errorMessages.some((msg) =>
        msg.toLowerCase().includes("no se encontró datos") ||
        msg.toLowerCase().includes("no se encontro datos")
      );
      return reason.statusCode === 404 && isChequesRechazadosEndpoint && hasNoDataMessage;
    };

    return {
      deudas: deudasRes.status === "fulfilled" ? deudasRes.value : null,
      historial: historialRes.status === "fulfilled" ? historialRes.value : null,
      chequesRechazados: chequesRes.status === "fulfilled" ? chequesRes.value : null,
      errors: [deudasRes, historialRes, chequesRes]
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .filter((r) => !shouldIgnoreError(r.reason))
        .map((r) => normalizeError(r.reason)),
    };
  },
};
