import { transparencia } from "@/lib/bcra-client";
import { cache, TTL } from "@/lib/cache";
import type {
  CajaAhorroResponse,
  PaqueteProductoResponse,
  PlazoFijoResponse,
  PrestamoPrendarioResponse,
  PrestamoHipotecarioResponse,
  PrestamoPersonalResponse,
  TarjetaCreditoResponse,
} from "@/types/bcra";

export const transparenciaService = {
  async getCajasAhorros(codigoEntidad?: number): Promise<CajaAhorroResponse> {
    const key = `transparencia:cajas:${codigoEntidad || "all"}`;
    return cache.getOrFetch(
      key,
      () => transparencia.getCajasAhorros(codigoEntidad) as Promise<CajaAhorroResponse>,
      TTL.TRANSPARENCIA
    );
  },

  async getPaquetesProductos(codigoEntidad?: number): Promise<PaqueteProductoResponse> {
    const key = `transparencia:paquetes:${codigoEntidad || "all"}`;
    return cache.getOrFetch(
      key,
      () => transparencia.getPaquetesProductos(codigoEntidad) as Promise<PaqueteProductoResponse>,
      TTL.TRANSPARENCIA
    );
  },

  async getPlazosFijos(codigoEntidad?: number): Promise<PlazoFijoResponse> {
    const key = `transparencia:plazos:${codigoEntidad || "all"}`;
    return cache.getOrFetch(
      key,
      () => transparencia.getPlazosFijos(codigoEntidad) as Promise<PlazoFijoResponse>,
      TTL.TRANSPARENCIA
    );
  },

  async getPrestamosPrendarios(codigoEntidad?: number): Promise<PrestamoPrendarioResponse> {
    const key = `transparencia:prendarios:${codigoEntidad || "all"}`;
    return cache.getOrFetch(
      key,
      () => transparencia.getPrestamosPrendarios(codigoEntidad) as Promise<PrestamoPrendarioResponse>,
      TTL.TRANSPARENCIA
    );
  },

  async getPrestamosHipotecarios(codigoEntidad?: number): Promise<PrestamoHipotecarioResponse> {
    const key = `transparencia:hipotecarios:${codigoEntidad || "all"}`;
    return cache.getOrFetch(
      key,
      () => transparencia.getPrestamosHipotecarios(codigoEntidad) as Promise<PrestamoHipotecarioResponse>,
      TTL.TRANSPARENCIA
    );
  },

  async getPrestamosPersonales(codigoEntidad?: number): Promise<PrestamoPersonalResponse> {
    const key = `transparencia:personales:${codigoEntidad || "all"}`;
    return cache.getOrFetch(
      key,
      () => transparencia.getPrestamosPersonales(codigoEntidad) as Promise<PrestamoPersonalResponse>,
      TTL.TRANSPARENCIA
    );
  },

  async getTarjetasCredito(codigoEntidad?: number): Promise<TarjetaCreditoResponse> {
    const key = `transparencia:tarjetas:${codigoEntidad || "all"}`;
    return cache.getOrFetch(
      key,
      () => transparencia.getTarjetasCredito(codigoEntidad) as Promise<TarjetaCreditoResponse>,
      TTL.TRANSPARENCIA
    );
  },
};
