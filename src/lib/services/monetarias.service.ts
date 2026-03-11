import { monetarias } from "@/lib/bcra-client";
import { cache, TTL } from "@/lib/cache";
import type {
  MonetariasResponse,
  DatosMonetariaResponse,
  MetadatoResponse,
  MetadatoListResponse,
} from "@/types/bcra";

export const monetariasService = {
  async getVariables(filters?: {
    IdVariable?: number;
    Categoria?: string;
    Periodicidad?: string;
    Moneda?: string;
    TipoSerie?: string;
    Limit?: number;
    Offset?: number;
  }): Promise<MonetariasResponse> {
    const filterKey = filters ? JSON.stringify(filters) : "all";
    return cache.getOrFetch(
      `monetarias:variables:${filterKey}`,
      () => monetarias.getVariables(filters) as Promise<MonetariasResponse>,
      TTL.MONETARIAS_CATALOGO
    );
  },

  async getDatosVariable(
    idVariable: number,
    desde?: string,
    hasta?: string,
    limit?: number,
    offset?: number
  ): Promise<DatosMonetariaResponse> {
    const key = `monetarias:datos:${idVariable}:${desde}:${hasta}:${limit}:${offset}`;
    return cache.getOrFetch(
      key,
      () =>
        monetarias.getDatosVariable(
          idVariable,
          desde,
          hasta,
          limit,
          offset
        ) as Promise<DatosMonetariaResponse>,
      TTL.MONETARIAS_DATOS
    );
  },

  async getMetodologia(
    limit?: number,
    offset?: number
  ): Promise<MetadatoListResponse> {
    return cache.getOrFetch(
      `monetarias:metodologia:${limit}:${offset}`,
      () =>
        monetarias.getMetodologia(limit, offset) as Promise<MetadatoListResponse>,
      TTL.METODOLOGIA
    );
  },

  async getMetodologiaVariable(idVariable: number): Promise<MetadatoResponse> {
    return cache.getOrFetch(
      `monetarias:metodologia:${idVariable}`,
      () =>
        monetarias.getMetodologiaVariable(
          idVariable
        ) as Promise<MetadatoResponse>,
      TTL.METODOLOGIA
    );
  },
};
