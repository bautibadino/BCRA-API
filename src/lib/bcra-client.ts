/**
 * Cliente HTTP centralizado para la API del BCRA.
 * Maneja reintentos, timeouts y logging.
 */

const BCRA_BASE_URL = process.env.BCRA_API_URL || "https://api.bcra.gob.ar";
const DEFAULT_TIMEOUT = 15_000; // 15 segundos
const MAX_RETRIES = 2;

interface FetchOptions {
  timeout?: number;
  retries?: number;
}

class BCRAClientError extends Error {
  constructor(
    public statusCode: number,
    public errorMessages: string[],
    public endpoint: string
  ) {
    super(`BCRA API Error [${statusCode}] on ${endpoint}: ${errorMessages.join(", ")}`);
    this.name = "BCRAClientError";
  }
}

async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

async function bcraFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES } = options;
  const url = `${BCRA_BASE_URL}${path}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        // Backoff exponencial: 1s, 2s, 4s...
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }

      console.log(`[BCRA] ${attempt > 0 ? `Retry #${attempt} ` : ""}GET ${path}`);

      const response = await fetchWithTimeout(url, timeout);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({
          status: response.status,
          errorMessages: [response.statusText],
        }));

        throw new BCRAClientError(
          response.status,
          errorBody.errorMessages || [response.statusText],
          path
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error as Error;

      // No reintentar en errores 4xx (client errors)
      if (error instanceof BCRAClientError && error.statusCode < 500) {
        throw error;
      }

      // No reintentar si se agotaron los intentos
      if (attempt >= retries) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Unexpected error in bcraFetch");
}

// ============================================================
// Funciones de API exportadas
// ============================================================

// --- Central de Deudores ---
export const deudores = {
  getDeudas: (cuit: number) =>
    bcraFetch(`/centraldedeudores/v1.0/Deudas/${cuit}`),

  getDeudasHistoricas: (cuit: number) =>
    bcraFetch(`/centraldedeudores/v1.0/Deudas/Historicas/${cuit}`),

  getChequesRechazados: (cuit: number) =>
    bcraFetch(`/centraldedeudores/v1.0/Deudas/ChequesRechazados/${cuit}`),
};

// --- Cheques Denunciados ---
export const cheques = {
  getEntidades: () =>
    bcraFetch(`/cheques/v1.0/entidades`),

  getDenunciado: (codigoEntidad: number, numeroCheque: number) =>
    bcraFetch(`/cheques/v1.0/denunciados/${codigoEntidad}/${numeroCheque}`),
};

// --- Estadísticas Cambiarias ---
export const cambiarias = {
  getDivisas: () =>
    bcraFetch(`/estadisticascambiarias/v1.0/Maestros/Divisas`),

  getCotizaciones: (fecha?: string) => {
    const params = fecha ? `?fecha=${fecha}` : "";
    return bcraFetch(`/estadisticascambiarias/v1.0/Cotizaciones${params}`);
  },

  getCotizacionesMoneda: (
    codMoneda: string,
    fechaDesde?: string,
    fechaHasta?: string,
    limit?: number,
    offset?: number
  ) => {
    const params = new URLSearchParams();
    if (fechaDesde) params.set("fechaDesde", fechaDesde);
    if (fechaHasta) params.set("fechaHasta", fechaHasta);
    if (limit) params.set("limit", String(limit));
    if (offset) params.set("offset", String(offset));
    const qs = params.toString() ? `?${params.toString()}` : "";
    return bcraFetch(`/estadisticascambiarias/v1.0/Cotizaciones/${codMoneda}${qs}`);
  },
};

// --- Estadísticas Monetarias v4.0 ---
export const monetarias = {
  getVariables: (filters?: {
    IdVariable?: number;
    Categoria?: string;
    Periodicidad?: string;
    Moneda?: string;
    TipoSerie?: string;
    UnidadExpresion?: string;
    Limit?: number;
    Offset?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined) params.set(key, String(val));
      });
    }
    const qs = params.toString() ? `?${params.toString()}` : "";
    return bcraFetch(`/estadisticas/v4.0/Monetarias${qs}`);
  },

  getDatosVariable: (
    idVariable: number,
    desde?: string,
    hasta?: string,
    limit?: number,
    offset?: number
  ) => {
    const params = new URLSearchParams();
    if (desde) params.set("Desde", desde);
    if (hasta) params.set("Hasta", hasta);
    if (limit) params.set("Limit", String(limit));
    if (offset) params.set("Offset", String(offset));
    const qs = params.toString() ? `?${params.toString()}` : "";
    return bcraFetch(`/estadisticas/v4.0/Monetarias/${idVariable}${qs}`);
  },

  getMetodologia: (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit) params.set("Limit", String(limit));
    if (offset) params.set("Offset", String(offset));
    const qs = params.toString() ? `?${params.toString()}` : "";
    return bcraFetch(`/estadisticas/v4.0/Metodologia${qs}`);
  },

  getMetodologiaVariable: (idVariable: number) =>
    bcraFetch(`/estadisticas/v4.0/Metodologia/${idVariable}`),
};

// --- Régimen de Transparencia ---
export const transparencia = {
  getCajasAhorros: (codigoEntidad?: number) => {
    const qs = codigoEntidad ? `?codigoEntidad=${codigoEntidad}` : "";
    return bcraFetch(`/transparencia/v1.0/CajasAhorros${qs}`);
  },

  getPaquetesProductos: (codigoEntidad?: number) => {
    const qs = codigoEntidad ? `?codigoEntidad=${codigoEntidad}` : "";
    return bcraFetch(`/transparencia/v1.0/PaquetesProductos${qs}`);
  },

  getPlazosFijos: (codigoEntidad?: number) => {
    const qs = codigoEntidad ? `?codigoEntidad=${codigoEntidad}` : "";
    return bcraFetch(`/transparencia/v1.0/PlazosFijos${qs}`);
  },

  getPrestamosPrendarios: (codigoEntidad?: number) => {
    const qs = codigoEntidad ? `?codigoEntidad=${codigoEntidad}` : "";
    return bcraFetch(`/transparencia/v1.0/Prestamos/Prendarios${qs}`);
  },

  getPrestamosHipotecarios: (codigoEntidad?: number) => {
    const qs = codigoEntidad ? `?codigoEntidad=${codigoEntidad}` : "";
    return bcraFetch(`/transparencia/v1.0/Prestamos/Hipotecarios${qs}`);
  },

  getPrestamosPersonales: (codigoEntidad?: number) => {
    const qs = codigoEntidad ? `?codigoEntidad=${codigoEntidad}` : "";
    return bcraFetch(`/transparencia/v1.0/Prestamos/Personales${qs}`);
  },

  getTarjetasCredito: (codigoEntidad?: number) => {
    const qs = codigoEntidad ? `?codigoEntidad=${codigoEntidad}` : "";
    return bcraFetch(`/transparencia/v1.0/TarjetasCredito${qs}`);
  },
};

export { BCRAClientError };
