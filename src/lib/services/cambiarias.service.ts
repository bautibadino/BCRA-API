import { cambiarias } from "@/lib/bcra-client";
import { cache, TTL } from "@/lib/cache";
import type {
  DivisaResponse,
  CotizacionDiaResponse,
  CotizacionesHistoricasResponse,
} from "@/types/bcra";

export const cambiariasService = {
  async getDivisas(): Promise<DivisaResponse> {
    return cache.getOrFetch(
      "cambiarias:divisas",
      () => cambiarias.getDivisas() as Promise<DivisaResponse>,
      TTL.DIVISAS
    );
  },

  async getCotizacionesHoy(fecha?: string): Promise<CotizacionDiaResponse> {
    const key = `cambiarias:cotizaciones:${fecha || "latest"}`;
    return cache.getOrFetch(
      key,
      () => cambiarias.getCotizaciones(fecha) as Promise<CotizacionDiaResponse>,
      TTL.COTIZACIONES
    );
  },

  async getCotizacionesMoneda(
    codMoneda: string,
    fechaDesde?: string,
    fechaHasta?: string,
    limit = 365,
    offset = 0
  ): Promise<CotizacionesHistoricasResponse> {
    const key = `cambiarias:historico:${codMoneda}:${fechaDesde}:${fechaHasta}:${limit}:${offset}`;
    return cache.getOrFetch(
      key,
      () =>
        cambiarias.getCotizacionesMoneda(
          codMoneda,
          fechaDesde,
          fechaHasta,
          limit,
          offset
        ) as Promise<CotizacionesHistoricasResponse>,
      TTL.COTIZACIONES
    );
  },
};
