# BCRA App

Dashboard completo en Next.js + TypeScript que consume las 5 APIs públicas del Banco Central de la República Argentina.

## APIs integradas

| API | Versión | Endpoints |
|-----|---------|-----------|
| Central de Deudores | v1.0 | Deudas, Historial, Cheques Rechazados |
| Cheques Denunciados | v1.0 | Entidades, Consulta de cheques |
| Estadísticas Cambiarias | v1.0 | Divisas, Cotizaciones, Histórico |
| Estadísticas Monetarias | v4.0 | Variables, Datos, Metodología |
| Régimen de Transparencia | v1.0 | Plazos Fijos, Préstamos, Tarjetas, Cajas de Ahorro, Paquetes |

**19 endpoints** documentados y consumidos. Servidor base: `https://api.bcra.gob.ar`

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **Recharts** (gráficos)
- **node-cron** (pre-cache automático)
- **Cache en memoria** con TTL (swappable a Redis)

## Módulos

### Dashboard Monetario (`/monetarias`)
Explorador de variables monetarias con gráficos de series temporales. Filtros por categoría, periodicidad y moneda. +500 variables disponibles.

### Monitor Cambiario (`/cambiarias`)
Cotizaciones del día de todas las divisas, gráficos históricos con AreaChart, selector de moneda y rango de fechas.

### Consulta Crediticia (`/deudores`)
Búsqueda por CUIT/CUIL/CDI con reporte consolidado: deudas actuales, historial 24 meses, cheques rechazados. Incluye verificación de cheques denunciados.

### Comparador Financiero (`/transparencia`)
Tablas comparativas ordenables de plazos fijos, préstamos (personales, hipotecarios, prendarios), tarjetas de crédito, cajas de ahorro y paquetes de productos.

## Arquitectura

```
Frontend (React)
    │
    ▼
API Routes (Next.js)        ← proxy + validación
    │
    ├── Cache Layer          ← TTL configurable por tipo de dato
    │
    └── BCRA Client          ← retry + backoff exponencial
         │
         ▼
    api.bcra.gob.ar
```

Los datos se separan en dos categorías:

- **Con cache** (cotizaciones, variables monetarias, transparencia): se pre-cachean con cron jobs. TTL de 1h a 24h según el tipo.
- **Sin cache** (deudores, cheques denunciados): consultas en tiempo real al BCRA porque dependen del input del usuario.

## Setup

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno (opcional, la URL por defecto funciona)
cp .env.example .env

# Desarrollo
npm run dev

# Build producción
npm run build && npm start
```

Abrir `http://localhost:3000`

## Estructura del proyecto

```
src/
├── types/bcra.ts                    # Tipos TypeScript de las 5 APIs
├── lib/
│   ├── bcra-client.ts               # Cliente HTTP centralizado
│   ├── cache.ts                     # Cache en memoria con TTL
│   ├── hooks.ts                     # useFetch, formatters
│   └── services/                    # 5 servicios (uno por API)
├── app/
│   ├── api/                         # 9 API routes
│   ├── monetarias/page.tsx          # Dashboard Monetario
│   ├── cambiarias/page.tsx          # Monitor Cambiario
│   ├── deudores/page.tsx            # Consulta Crediticia
│   └── transparencia/page.tsx       # Comparador Financiero
├── components/                      # UI reutilizable
└── instrumentation.ts               # Cron jobs
```

## Documentación de la API

El archivo `Documentacion_API_BCRA.md` en la raíz del repo contiene la documentación completa de los 19 endpoints con schemas, parámetros y ejemplos.

## Notas

- La API del BCRA es **pública y gratuita**, no requiere token ni registro.
- Para producción, se recomienda reemplazar el cache en memoria por **Redis** (la interfaz es la misma, solo hay que cambiar la implementación en `cache.ts`).
- Los cron jobs se configuran en `instrumentation.ts` y corren automáticamente al iniciar el servidor.

## Licencia

MIT
