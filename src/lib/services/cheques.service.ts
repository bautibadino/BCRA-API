import { cheques } from "@/lib/bcra-client";
import { cache, TTL } from "@/lib/cache";
import type { EntidadResponse, ChequeResponse } from "@/types/bcra";

export const chequesService = {
  /** Listado de entidades — cacheado 24h (cambia rarísimo). */
  async getEntidades(): Promise<EntidadResponse> {
    return cache.getOrFetch(
      "cheques:entidades",
      () => cheques.getEntidades() as Promise<EntidadResponse>,
      TTL.ENTIDADES
    );
  },

  /** Consulta de cheque denunciado — sin cache (depende del input del usuario). */
  async getDenunciado(
    codigoEntidad: number,
    numeroCheque: number
  ): Promise<ChequeResponse> {
    return cheques.getDenunciado(codigoEntidad, numeroCheque) as Promise<ChequeResponse>;
  },
};
