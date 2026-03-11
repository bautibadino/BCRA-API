/**
 * Cache en memoria con TTL configurable.
 * Para producción, reemplazar por Redis (ioredis/upstash).
 * La interfaz se mantiene igual.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Limpiar entradas expiradas cada 5 minutos
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Obtiene un valor del cache.
   * Retorna null si no existe o expiró.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Guarda un valor en cache con TTL en segundos.
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
      createdAt: Date.now(),
    });
  }

  /**
   * Wrapper: obtiene del cache o ejecuta la función y cachea el resultado.
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      console.log(`[CACHE] HIT: ${key}`);
      return cached;
    }

    console.log(`[CACHE] MISS: ${key}`);
    const data = await fetcher();
    this.set(key, data, ttlSeconds);
    return data;
  }

  /**
   * Invalida una entrada específica.
   */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /**
   * Invalida todas las entradas que matcheen un patrón.
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Limpia entradas expiradas.
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`[CACHE] Cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * Info de debug.
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Singleton — se mantiene entre requests en Next.js
const globalForCache = globalThis as unknown as { bcraCache?: MemoryCache };
export const cache = globalForCache.bcraCache ?? new MemoryCache();
if (process.env.NODE_ENV !== "production") {
  globalForCache.bcraCache = cache;
}

// TTLs configurables (en segundos)
export const TTL = {
  DIVISAS: 24 * 60 * 60,        // 24 horas — cambia rara vez
  ENTIDADES: 24 * 60 * 60,      // 24 horas
  COTIZACIONES: 60 * 60,        // 1 hora
  MONETARIAS_CATALOGO: 6 * 60 * 60,  // 6 horas
  MONETARIAS_DATOS: 60 * 60,    // 1 hora
  METODOLOGIA: 24 * 60 * 60,    // 24 horas
  TRANSPARENCIA: 12 * 60 * 60,  // 12 horas
} as const;
