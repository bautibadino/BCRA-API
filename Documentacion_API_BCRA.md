# Documentación Completa — API del Banco Central de la República Argentina (BCRA)

**Fecha de documentación:** 11 de marzo de 2026
**Fuente oficial:** https://www.bcra.gob.ar/apis-banco-central/
**Servidor base:** `https://api.bcra.gob.ar`
**Contacto técnico:** api@bcra.gob.ar
**Especificación:** OpenAPI 3.0.1
**Autenticación:** No requiere token ni registro (acceso público y gratuito)
**Formato de respuesta:** `application/json`

---

## Índice

1. [Información General](#1-información-general)
2. [API Central de Deudores v1.0](#2-api-central-de-deudores-v10)
3. [API Cheques Denunciados v1.0](#3-api-cheques-denunciados-v10)
4. [API Estadísticas Cambiarias v1.0](#4-api-estadísticas-cambiarias-v10)
5. [API Estadísticas Monetarias | Series y Principales Variables v4.0](#5-api-estadísticas-monetarias--series-y-principales-variables-v40)
6. [API Régimen de Transparencia v1.0](#6-api-régimen-de-transparencia-v10)
7. [Códigos de Respuesta HTTP Comunes](#7-códigos-de-respuesta-http-comunes)
8. [Estructura de Error Estándar](#8-estructura-de-error-estándar)

---

## 1. Información General

El BCRA pone a disposición de desarrolladores, instituciones y empresas un conjunto de APIs para integrar de forma automatizada la información que publica el Banco en sistemas propios, aplicaciones y otros servicios digitales. Son herramientas públicas y gratuitas que optimizan la interacción con las bases de datos del BCRA.

### APIs disponibles

| API | Versión Actual | Estado |
|-----|---------------|--------|
| Central de Deudores | v1.0 | Activa |
| Cheques Denunciados | v1.0 | Activa |
| Estadísticas Cambiarias | v1.0 | Activa |
| Estadísticas Monetarias / Principales Variables | **v4.0** (Nueva, incluye Series) | Activa |
| Estadísticas Monetarias / Principales Variables | v3.0 | Deprecación: 28/02/2026 |
| Estadísticas Monetarias / Principales Variables | v2.0 | Deprecada (01/06/2025) |
| Estadísticas Monetarias / Principales Variables | v1.0 | Deprecada (15/06/2024) |
| Régimen de Transparencia | v1.0 | Activa |

### Características generales

- **Facilidad de integración:** diseñadas para sitios web, apps móviles, servicios empresariales y desarrollos internos.
- **Escalabilidad y flexibilidad:** arquitectura preparada para crecer con la cantidad de consultas.
- **Rendimiento y disponibilidad:** procesan grandes volúmenes de datos y atienden múltiples solicitudes simultáneas.

---

## 2. API Central de Deudores v1.0

**Descripción:** Permite obtener un informe consolidado por clave de identificación fiscal (CUIT, CUIL o CDI) para una persona humana o jurídica respecto de financiaciones otorgadas por entidades financieras, fideicomisos financieros, entidades no financieras emisoras de tarjetas de crédito/compra, otros proveedores no financieros de créditos, sociedades de garantía recíproca, fondos de garantía de carácter público y proveedores de servicios de crédito entre particulares a través de plataformas.

**Especificación OpenAPI:** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/json/central-deudores-v1.json
**Manual de Desarrollo (PDF):** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/pdf/central-deudores-v1.pdf

### 2.1 Endpoints

#### 2.1.1 Obtener Deudas Actuales

```
GET /centraldedeudores/v1.0/Deudas/{Identificacion}
```

**Descripción:** Devuelve el informe consolidado de deudas del último período disponible para la identificación fiscal indicada.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `Identificacion` | path | integer (int64) | Sí | CUIT, CUIL o CDI de la persona |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `DeudaResponse` |
| 400 | Bad Request | `ErrorResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/20123456789
```

---

#### 2.1.2 Obtener Deudas Históricas

```
GET /centraldedeudores/v1.0/Deudas/Historicas/{Identificacion}
```

**Descripción:** Devuelve el historial de deudas (últimos 24 meses) para la identificación fiscal indicada.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `Identificacion` | path | integer (int64) | Sí | CUIT, CUIL o CDI de la persona |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `HistorialResponse` |
| 400 | Bad Request | `ErrorResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/Historicas/20123456789
```

---

#### 2.1.3 Obtener Cheques Rechazados

```
GET /centraldedeudores/v1.0/Deudas/ChequesRechazados/{Identificacion}
```

**Descripción:** Devuelve los cheques rechazados asociados a la identificación fiscal indicada, con sus causales correspondientes.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `Identificacion` | path | integer (int64) | Sí | CUIT, CUIL o CDI de la persona |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `ChequeResponse` |
| 400 | Bad Request | `ErrorResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/ChequesRechazados/20123456789
```

---

### 2.2 Schemas — Central de Deudores

#### DeudaResponse

```json
{
  "status": 200,
  "results": {
    "identificacion": 20123456789,
    "denominacion": "string",
    "periodos": [
      {
        "periodo": "string",
        "entidades": [
          {
            "entidad": "string",
            "situacion": 1,
            "fechaSit1": "2024-09-17",
            "monto": 0.0,
            "diasAtrasoPago": 0.0,
            "refinanciaciones": false,
            "recategorizacionOblig": false,
            "situacionJuridica": false,
            "irrecDisposicionTecnica": false,
            "enRevision": false,
            "procesoJud": false
          }
        ]
      }
    ]
  }
}
```

#### HistorialResponse

```json
{
  "status": 200,
  "results": {
    "identificacion": 20123456789,
    "denominacion": "string",
    "periodos": [
      {
        "periodo": "string",
        "entidades": [
          {
            "entidad": "string",
            "situacion": 1,
            "monto": 0.0,
            "enRevision": false,
            "procesoJud": false
          }
        ]
      }
    ]
  }
}
```

#### ChequeResponse (Central de Deudores)

```json
{
  "status": 200,
  "results": {
    "identificacion": 20123456789,
    "denominacion": "string",
    "causales": [
      {
        "causal": "string",
        "entidades": [
          {
            "entidad": 0,
            "detalle": [
              {
                "nroCheque": 0.0,
                "fechaRechazo": "2024-09-17",
                "monto": 0.0,
                "fechaPago": "2024-09-17",
                "fechaPagoMulta": "2024-09-17",
                "estadoMulta": "string",
                "ctaPersonal": true,
                "denomJuridica": "string",
                "enRevision": false,
                "procesoJud": false
              }
            ]
          }
        ]
      }
    ]
  }
}
```

#### Detalle de campos — DeudaEntidad

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `entidad` | string | Sí | Nombre de la entidad financiera |
| `situacion` | integer (int32) | Sí | Situación crediticia (1-6) |
| `fechaSit1` | date | Sí | Fecha desde la que se encuentra en situación 1 |
| `monto` | double | Sí | Monto de la deuda |
| `diasAtrasoPago` | double | Sí | Días de atraso en el pago |
| `refinanciaciones` | boolean | No | Indica si tiene refinanciaciones |
| `recategorizacionOblig` | boolean | No | Indica recategorización obligatoria |
| `situacionJuridica` | boolean | No | Indica si tiene situación jurídica |
| `irrecDisposicionTecnica` | boolean | No | Irrecuperabilidad por disposición técnica |
| `enRevision` | boolean | No | Indica si está en revisión |
| `procesoJud` | boolean | No | Indica si está en proceso judicial |

#### Detalle de campos — ChequeDetalle (Central de Deudores)

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `nroCheque` | double | No | Número de cheque |
| `fechaRechazo` | date | No | Fecha de rechazo |
| `monto` | double | No | Monto del cheque |
| `fechaPago` | date | Sí | Fecha de pago (si fue pagado) |
| `fechaPagoMulta` | date | Sí | Fecha de pago de multa |
| `estadoMulta` | string | Sí | Estado de la multa |
| `ctaPersonal` | boolean | No | Si la cuenta es personal |
| `denomJuridica` | string | Sí | Denominación jurídica |
| `enRevision` | boolean | No | Si está en revisión |
| `procesoJud` | boolean | No | Si está en proceso judicial |

---

## 3. API Cheques Denunciados v1.0

**Descripción:** Permite consultar cheques denunciados, extraviados, sustraídos o adulterados. La información es suministrada por las entidades financieras que operan en el país y se publica sin alteraciones.

**Especificación OpenAPI:** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/json/cheques-v1.json
**Manual de Desarrollo (PDF):** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/pdf/Cheques-v1.pdf

### 3.1 Endpoints

#### 3.1.1 Listar Entidades Financieras

```
GET /cheques/v1.0/entidades
```

**Descripción:** Obtiene el listado maestro de todas las entidades financieras con sus códigos identificadores.

**Parámetros:** Ninguno.

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `EntidadResponse` |
| 400 | Bad Request | `ChequeResponseError` |
| 500 | Server Error | `EntidadResponseError` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/cheques/v1.0/entidades
```

---

#### 3.1.2 Consultar Cheque Denunciado

```
GET /cheques/v1.0/denunciados/{codigoEntidad}/{numeroCheque}
```

**Descripción:** Consulta si un cheque específico de una entidad fue denunciado como extraviado, sustraído o adulterado.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codigoEntidad` | path | integer (int32) | Sí | Código de la entidad financiera (obtenido del endpoint de entidades) |
| `numeroCheque` | path | integer (int64) | Sí | Número del cheque a consultar |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `ChequeResponse` |
| 400 | Bad Request | `ChequeResponseError` |
| 404 | Not Found | `ChequeResponseError` |
| 500 | Server Error | `ChequeResponseError` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/cheques/v1.0/denunciados/11/12345678
```

---

### 3.2 Schemas — Cheques Denunciados

#### EntidadResponse

```json
{
  "status": 200,
  "results": [
    {
      "codigoEntidad": 11,
      "denominacion": "string"
    }
  ]
}
```

#### ChequeResponse (Cheques Denunciados)

```json
{
  "status": 200,
  "results": {
    "numeroCheque": 12345678,
    "denunciado": true,
    "fechaProcesamiento": "2024-08-07",
    "denominacionEntidad": "string",
    "detalles": [
      {
        "sucursal": 1,
        "numeroCuenta": 123456,
        "causal": "string"
      }
    ]
  }
}
```

#### Detalle de campos — Cheque

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `numeroCheque` | integer (int64) | No | Número del cheque consultado |
| `denunciado` | boolean | No | Si el cheque fue denunciado |
| `fechaProcesamiento` | date | No | Fecha de procesamiento de la denuncia |
| `denominacionEntidad` | string | Sí | Nombre de la entidad financiera |
| `detalles` | array[ChequeDetalle] | Sí | Detalles de la denuncia |

#### Detalle de campos — ChequeDetalle

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `sucursal` | integer (int32) | No | Número de sucursal |
| `numeroCuenta` | integer (int64) | No | Número de cuenta |
| `causal` | string | Sí | Causal de la denuncia (extraviado, sustraído, adulterado) |

---

## 4. API Estadísticas Cambiarias v1.0

**Descripción:** Proporciona acceso a recursos relacionados con la información de los tipos de cambio publicados por el BCRA.

**Especificación OpenAPI:** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/json/estadisticascambiarias-v1.json
**Manual de Desarrollo (PDF):** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/pdf/estadisticascambiarias-v1.pdf

### 4.1 Endpoints

#### 4.1.1 Listar Divisas

```
GET /estadisticascambiarias/v1.0/Maestros/Divisas
```

**Descripción:** Obtiene el listado maestro de todas las divisas disponibles con sus códigos de 3 caracteres.

**Parámetros:** Ninguno.

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `DivisaResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Maestros/Divisas
```

---

#### 4.1.2 Obtener Cotizaciones del Día

```
GET /estadisticascambiarias/v1.0/Cotizaciones
```

**Descripción:** Devuelve todas las cotizaciones de divisas para una fecha determinada. Sin parámetro de fecha, devuelve las cotizaciones del último día hábil disponible.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `fecha` | query | string (date-time) | No | Fecha de la cotización (formato: YYYY-MM-DD) |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `CotizacionResponse` |
| 400 | Bad Request | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones?fecha=2026-03-10
```

---

#### 4.1.3 Obtener Cotizaciones Históricas por Moneda

```
GET /estadisticascambiarias/v1.0/Cotizaciones/{codMoneda}
```

**Descripción:** Devuelve las cotizaciones históricas de una moneda específica en un rango de fechas, con soporte de paginación.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codMoneda` | path | string | Sí | Código de la moneda (3 caracteres, ej: "USD") |
| `fechaDesde` | query | string (date-time) | No | Fecha de inicio del rango (YYYY-MM-DD) |
| `fechaHasta` | query | string (date-time) | No | Fecha de fin del rango (YYYY-MM-DD) |
| `limit` | query | integer (int32) | No | Cantidad máxima de resultados por página |
| `offset` | query | integer (int32) | No | Desplazamiento para paginación |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `CotizacionesResponse` |
| 400 | Bad Request | `ErrorResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/USD?fechaDesde=2026-01-01&fechaHasta=2026-03-10&limit=100&offset=0
```

---

### 4.2 Schemas — Estadísticas Cambiarias

#### DivisaResponse

```json
{
  "status": 200,
  "results": [
    {
      "codigo": "USD",
      "denominacion": "DOLAR ESTADOUNIDENSE"
    }
  ]
}
```

> **Nota:** `codigo` tiene longitud máxima de 3 caracteres, `denominacion` máximo 50 caracteres.

#### CotizacionResponse (día específico)

```json
{
  "status": 200,
  "results": {
    "fecha": "2026-03-10",
    "detalle": [
      {
        "codigoMoneda": "USD",
        "descripcion": "DOLAR ESTADOUNIDENSE",
        "tipoPase": 0.0,
        "tipoCotizacion": 0.0
      }
    ]
  }
}
```

#### CotizacionesResponse (rango histórico con paginación)

```json
{
  "status": 200,
  "metadata": {
    "resultset": {
      "count": 100,
      "offset": 0,
      "limit": 100
    }
  },
  "results": [
    {
      "fecha": "2026-01-02",
      "detalle": [
        {
          "codigoMoneda": "USD",
          "descripcion": "DOLAR ESTADOUNIDENSE",
          "tipoPase": 0.0,
          "tipoCotizacion": 0.0
        }
      ]
    }
  ]
}
```

#### Detalle de campos — CotizacionesDetalle

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `codigoMoneda` | string | Sí | Código ISO de la moneda |
| `descripcion` | string | Sí | Nombre completo de la moneda |
| `tipoPase` | double | No | Tipo de pase |
| `tipoCotizacion` | double | No | Tipo de cotización |

#### Metadata (paginación)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `resultset.count` | integer | Total de registros disponibles |
| `resultset.offset` | integer | Desplazamiento actual |
| `resultset.limit` | integer | Límite de registros por página |

---

## 5. API Estadísticas Monetarias | Series y Principales Variables v4.0

**Descripción:** API de principales variables y series estadísticas del Informe Monetario Diario. Permite acceder a datos clave sobre la economía argentina, incluyendo base monetaria, reservas internacionales, depósitos, préstamos, tasas de interés, entre otros.

**Especificación OpenAPI:** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/json/principales-variables-v4.json
**Manual de Desarrollo (PDF):** Disponible desde la página del catálogo de APIs
**Contacto:** aplicaciones@bcra.gob.ar

> **Nota de versiones:** La v4.0 es la versión más reciente e incluye el endpoint de Series. La v3.0 será deprecada el 28/02/2026. Las versiones v2.0 y v1.0 ya fueron deprecadas.

### 5.1 Endpoints

#### 5.1.1 Listar Todas las Variables Monetarias

```
GET /estadisticas/v4.0/Monetarias
```

**Descripción:** Obtiene el catálogo completo de todas las variables monetarias publicadas por el BCRA, con soporte de paginación y filtros.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `IdVariable` | query | integer (int32) | No | Filtrar por ID de variable específica |
| `Categoria` | query | string (max 255) | No | Filtrar por categoría |
| `Periodicidad` | query | string (max 1) | No | Filtrar por periodicidad (ej: "D"=diaria, "M"=mensual) |
| `Moneda` | query | string (max 5) | No | Filtrar por moneda |
| `TipoSerie` | query | string (max 100) | No | Filtrar por tipo de serie |
| `UnidadExpresion` | query | string (max 100) | No | Filtrar por unidad de expresión |
| `Limit` | query | integer (int32) | No | Cantidad máxima de resultados |
| `Offset` | query | integer (int32) | No | Desplazamiento para paginación |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `MonetariasResponse` |
| 400 | Bad Request | `ResponseError` |
| 500 | Server Error | `ResponseError` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias?Categoria=Reservas&Limit=10
```

---

#### 5.1.2 Obtener Datos de una Variable Monetaria

```
GET /estadisticas/v4.0/Monetarias/{IdVariable}
```

**Descripción:** Devuelve la serie de datos (fecha y valor) para una variable monetaria específica en un rango de fechas, con soporte de paginación.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `IdVariable` | path | integer (int32) | Sí | ID de la variable monetaria |
| `Desde` | query | string (date-time) | No | Fecha de inicio (YYYY-MM-DD) |
| `Hasta` | query | string (date-time) | No | Fecha de fin (YYYY-MM-DD) |
| `Limit` | query | integer (int32) | No | Cantidad máxima de resultados |
| `Offset` | query | integer (int32) | No | Desplazamiento para paginación |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `DatosMonetariaResponse` |
| 400 | Bad Request | `ResponseError` |
| 404 | Not Found | `ResponseError` |
| 500 | Server Error | `ResponseError` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/1?Desde=2026-01-01&Hasta=2026-03-10&Limit=100
```

---

#### 5.1.3 Obtener Metodología de Todas las Variables

```
GET /estadisticas/v4.0/Metodologia
```

**Descripción:** Devuelve la descripción metodológica de todas las variables disponibles, con soporte de paginación.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `Limit` | query | integer (int32) | No | Cantidad máxima de resultados |
| `Offset` | query | integer (int32) | No | Desplazamiento para paginación |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `MetadatoListResponse` |
| 500 | Server Error | `ResponseError` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/estadisticas/v4.0/Metodologia?Limit=50
```

---

#### 5.1.4 Obtener Metodología de una Variable Específica

```
GET /estadisticas/v4.0/Metodologia/{idVariable}
```

**Descripción:** Devuelve la descripción metodológica de una variable específica.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `idVariable` | path | integer (int32) | Sí | ID de la variable |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `MetadatoResponse` |
| 400 | Bad Request | `ResponseError` |
| 404 | Not Found | `ResponseError` |
| 500 | Server Error | `ResponseError` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/estadisticas/v4.0/Metodologia/1
```

---

### 5.2 Schemas — Estadísticas Monetarias

#### MonetariasResponse

```json
{
  "status": 200,
  "metadata": {
    "resultset": {
      "count": 500,
      "offset": 0,
      "limit": 100
    }
  },
  "results": [
    {
      "idVariable": 1,
      "descripcion": "Reservas Internacionales del BCRA (en millones de dólares)",
      "categoria": "Reservas",
      "tipoSerie": "Principales Variables",
      "periodicidad": "D",
      "unidadExpresion": "Millones de dólares",
      "moneda": "USD",
      "primerFechaInformada": "2003-01-02",
      "ultFechaInformada": "2026-03-10",
      "ultValorInformado": 0.0
    }
  ]
}
```

#### DatosMonetariaResponse

```json
{
  "status": 200,
  "metadata": {
    "resultset": {
      "count": 100,
      "offset": 0,
      "limit": 100
    }
  },
  "results": [
    {
      "idVariable": 1,
      "detalle": [
        {
          "fecha": "2026-01-02",
          "valor": 25000.0
        }
      ]
    }
  ]
}
```

#### MetadatoResponse

```json
{
  "status": 200,
  "results": [
    {
      "id": 1,
      "detalle": "Descripción metodológica de la variable"
    }
  ]
}
```

#### Detalle de campos — Monetarias

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `idVariable` | integer (int32) | No | ID único de la variable |
| `descripcion` | string | Sí | Descripción textual de la variable |
| `categoria` | string | Sí | Categoría a la que pertenece |
| `tipoSerie` | string | Sí | Tipo de serie (Principales Variables, Series, etc.) |
| `periodicidad` | string | Sí | Periodicidad de la variable (D, M, etc.) |
| `unidadExpresion` | string | Sí | Unidad en la que se expresa el valor |
| `moneda` | string | Sí | Moneda de referencia |
| `primerFechaInformada` | date | Sí | Primera fecha con datos disponibles |
| `ultFechaInformada` | date | Sí | Última fecha con datos disponibles |
| `ultValorInformado` | double | Sí | Último valor informado |

---

## 6. API Régimen de Transparencia v1.0

**Descripción:** Brinda información para hacer eficientes las decisiones de contratación de productos financieros. Incluye datos sobre cajas de ahorro, plazos fijos, préstamos, paquetes de productos y tarjetas de crédito de todas las entidades financieras del país.

**Especificación OpenAPI:** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/json/regimen-transparencia-v1.json
**Manual de Desarrollo (PDF):** https://www.bcra.gob.ar/archivos/Catalogo/Content/files/pdf/regimen-transparencia-v1.pdf

### 6.1 Endpoints

#### 6.1.1 Cajas de Ahorro

```
GET /transparencia/v1.0/CajasAhorros
```

**Descripción:** Obtiene información sobre cajas de ahorro ofrecidas por las entidades financieras.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codigoEntidad` | query | integer (int32) | No | Código de la entidad financiera (sin filtro devuelve todas) |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `CajaAhorroResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/transparencia/v1.0/CajasAhorros
GET https://api.bcra.gob.ar/transparencia/v1.0/CajasAhorros?codigoEntidad=11
```

---

#### 6.1.2 Paquetes de Productos

```
GET /transparencia/v1.0/PaquetesProductos
```

**Descripción:** Obtiene información sobre paquetes de productos financieros ofrecidos por las entidades.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codigoEntidad` | query | integer (int32) | No | Código de la entidad financiera |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `PaqueteProductoResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/transparencia/v1.0/PaquetesProductos?codigoEntidad=11
```

---

#### 6.1.3 Plazos Fijos

```
GET /transparencia/v1.0/PlazosFijos
```

**Descripción:** Obtiene información sobre plazos fijos ofrecidos por las entidades financieras.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codigoEntidad` | query | integer (int32) | No | Código de la entidad financiera |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `PlazoFijoResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/transparencia/v1.0/PlazosFijos
```

---

#### 6.1.4 Préstamos Prendarios

```
GET /transparencia/v1.0/Prestamos/Prendarios
```

**Descripción:** Obtiene información sobre préstamos prendarios ofrecidos por las entidades financieras.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codigoEntidad` | query | integer (int32) | No | Código de la entidad financiera |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `PrestamoPrendarioResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/transparencia/v1.0/Prestamos/Prendarios?codigoEntidad=11
```

---

#### 6.1.5 Préstamos Hipotecarios

```
GET /transparencia/v1.0/Prestamos/Hipotecarios
```

**Descripción:** Obtiene información sobre préstamos hipotecarios ofrecidos por las entidades financieras.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codigoEntidad` | query | integer (int32) | No | Código de la entidad financiera |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `PrestamoHipotecarioResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/transparencia/v1.0/Prestamos/Hipotecarios
```

---

#### 6.1.6 Préstamos Personales

```
GET /transparencia/v1.0/Prestamos/Personales
```

**Descripción:** Obtiene información sobre préstamos personales ofrecidos por las entidades financieras.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codigoEntidad` | query | integer (int32) | No | Código de la entidad financiera |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `PrestamoPersonalResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/transparencia/v1.0/Prestamos/Personales
```

---

#### 6.1.7 Tarjetas de Crédito

```
GET /transparencia/v1.0/TarjetasCredito
```

**Descripción:** Obtiene información sobre tarjetas de crédito ofrecidas por las entidades financieras.

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|-----------|-------------|
| `codigoEntidad` | query | integer (int32) | No | Código de la entidad financiera |

**Respuestas:**

| Código | Descripción | Schema |
|--------|-------------|--------|
| 200 | Success | `TarjetaCreditoResponse` |
| 404 | Not Found | `ErrorResponse` |
| 500 | Server Error | `ErrorResponse` |

**Ejemplo de solicitud:**
```
GET https://api.bcra.gob.ar/transparencia/v1.0/TarjetasCredito?codigoEntidad=11
```

---

### 6.2 Schemas — Régimen de Transparencia

#### CajaAhorroDTO

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `codigoEntidad` | integer (int32) | No | Código de la entidad |
| `descripcionEntidad` | string | Sí | Nombre de la entidad |
| `fechaInformacion` | date | Sí | Fecha de la información |
| `procesoSimplificadoDebidaDiligencia` | string | Sí | Si aplica proceso simplificado de debida diligencia |

#### PaqueteProductoDTO

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `codigoEntidad` | integer (int32) | No | Código de la entidad |
| `descripcionEntidad` | string | Sí | Nombre de la entidad |
| `fechaInformacion` | date | Sí | Fecha de la información |
| `nombreCompleto` | string | Sí | Nombre completo del paquete |
| `nombreCorto` | string | Sí | Nombre corto |
| `territorioValidez` | string | Sí | Territorio de validez |
| `masInformacion` | string | Sí | URL o texto con más información |
| `comisionMaximaMantenimiento` | double | Sí | Comisión máxima de mantenimiento |
| `ingresoMinimoMensual` | double | Sí | Ingreso mínimo mensual requerido |
| `antiguedadLaboralMinimaMeses` | integer (int32) | Sí | Antigüedad laboral mínima en meses |
| `edadMaximaSolicitada` | integer (int32) | Sí | Edad máxima para solicitar |
| `beneficiarios` | string | Sí | Tipo de beneficiarios |
| `segmento` | string | Sí | Segmento objetivo |
| `productosIntegrantes` | string | Sí | Productos que integran el paquete |

#### PlazoFijoDTO

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `codigoEntidad` | integer (int32) | No | Código de la entidad |
| `descripcionEntidad` | string | Sí | Nombre de la entidad |
| `fechaInformacion` | date | Sí | Fecha de la información |
| `nombreCompleto` | string | Sí | Nombre completo del producto |
| `nombreCorto` | string | Sí | Nombre corto |
| `territorioValidez` | string | Sí | Territorio de validez |
| `masInformacion` | string | Sí | URL o texto con más información |
| `denominacion` | string | Sí | Denominación (moneda) |
| `montoMinimoInvertir` | double | Sí | Monto mínimo a invertir |
| `plazoMinimoInvertirDias` | integer (int32) | Sí | Plazo mínimo en días |
| `canalConstitucion` | string | Sí | Canal de constitución |
| `tasaEfectivaAnualMinima` | double | Sí | TEA mínima ofrecida |

#### PrestamoHipotecarioDTO

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `codigoEntidad` | integer (int32) | No | Código de la entidad |
| `descripcionEntidad` | string | Sí | Nombre de la entidad |
| `fechaInformacion` | date | Sí | Fecha de la información |
| `nombreCompleto` | string | Sí | Nombre del producto |
| `nombreCorto` | string | Sí | Nombre corto |
| `territorioValidez` | string | Sí | Territorio de validez |
| `masInformacion` | string | Sí | URL con más información |
| `denominacion` | string | Sí | Denominación (moneda) |
| `montoMaximoOtorgable` | double | Sí | Monto máximo otorgable |
| `plazoMaximoOtorgable` | integer (int32) | Sí | Plazo máximo en meses |
| `ingresoMinimoMensual` | double | Sí | Ingreso mínimo mensual |
| `antiguedadLaboralMinimaMeses` | integer (int32) | Sí | Antigüedad laboral mínima |
| `edadMaximaSolicitada` | integer (int32) | Sí | Edad máxima |
| `relacionCuotaIngreso` | double | Sí | Relación cuota/ingreso máxima |
| `beneficiario` | string | Sí | Tipo de beneficiario |
| `cargoMaximoCancelacionAnticipada` | double | Sí | Cargo máximo por cancelación anticipada |
| `tasaEfectivaAnualMaxima` | double | Sí | TEA máxima |
| `tipoTasa` | string | Sí | Tipo de tasa (fija, variable, mixta) |
| `costoFinancieroEfectivoTotalMaximo` | double | Sí | CFT máximo |
| `relacionMontoTasacion` | double | Sí | Relación monto/tasación |
| `destinoFondos` | string | Sí | Destino de los fondos |
| `cuotaInicialCada100k` | double | Sí | Cuota inicial cada $100.000 |

#### PrestamoPersonalDTO

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `codigoEntidad` | integer (int32) | No | Código de la entidad |
| `descripcionEntidad` | string | Sí | Nombre de la entidad |
| `fechaInformacion` | date | Sí | Fecha de la información |
| `nombreCompleto` | string | Sí | Nombre del producto |
| `nombreCorto` | string | Sí | Nombre corto |
| `territorioValidez` | string | Sí | Territorio de validez |
| `masInformacion` | string | Sí | URL con más información |
| `denominacion` | string | Sí | Denominación (moneda) |
| `montoMaximoOtorgable` | double | Sí | Monto máximo |
| `montoMinimoOtorgable` | double | Sí | Monto mínimo |
| `plazoMaximoOtorgable` | integer (int32) | Sí | Plazo máximo en meses |
| `ingresoMinimoMensual` | double | Sí | Ingreso mínimo |
| `antiguedadLaboralMinimaMeses` | integer (int32) | Sí | Antigüedad laboral mínima |
| `edadMaximaSolicitada` | integer (int32) | Sí | Edad máxima |
| `relacionCuotaIngreso` | double | Sí | Relación cuota/ingreso |
| `beneficiario` | string | Sí | Tipo de beneficiario |
| `cargoMaximoCancelacionAnticipada` | double | Sí | Cargo por cancelación anticipada |
| `tasaEfectivaAnualMaxima` | double | Sí | TEA máxima |
| `tipoTasa` | string | Sí | Tipo de tasa |
| `costoFinancieroEfectivoTotalMaximo` | double | Sí | CFT máximo |
| `cuotaInicialCada10k` | double | Sí | Cuota inicial cada $10.000 |

#### PrestamoPrendarioDTO

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `codigoEntidad` | integer (int32) | No | Código de la entidad |
| `descripcionEntidad` | string | Sí | Nombre de la entidad |
| `fechaInformacion` | date | Sí | Fecha de la información |
| `nombreCompleto` | string | Sí | Nombre del producto |
| `nombreCorto` | string | Sí | Nombre corto |
| `territorioValidez` | string | Sí | Territorio de validez |
| `masInformacion` | string | Sí | URL con más información |
| `denominacion` | string | Sí | Denominación (moneda) |
| `montoMaximoOtorgable` | double | Sí | Monto máximo |
| `montoMinimoOtorgable` | double | Sí | Monto mínimo |
| `plazoMaximoOtorgable` | integer (int32) | Sí | Plazo máximo en meses |
| `ingresoMinimoMensual` | double | Sí | Ingreso mínimo |
| `antiguedadLaboralMinimaMeses` | integer (int32) | Sí | Antigüedad laboral mínima |
| `edadMaximaSolicitada` | integer (int32) | Sí | Edad máxima |
| `relacionCuotaIngreso` | double | Sí | Relación cuota/ingreso |
| `beneficiario` | string | Sí | Tipo de beneficiario |
| `cargoMaximoCancelacionAnticipada` | double | Sí | Cargo por cancelación anticipada |
| `tasaEfectivaAnualMaxima` | double | Sí | TEA máxima |
| `tipoTasa` | string | Sí | Tipo de tasa |
| `costoFinancieroEfectivoTotalMaximo` | double | Sí | CFT máximo |
| `relacionMontoTasacion` | double | Sí | Relación monto/tasación |
| `destinoFondos` | string | Sí | Destino de los fondos |
| `cuotaInicialCada10k` | double | Sí | Cuota inicial cada $10.000 |

#### TarjetaCreditoDTO

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `codigoEntidad` | integer (int32) | No | Código de la entidad |
| `descripcionEntidad` | string | Sí | Nombre de la entidad |
| `fechaInformacion` | date | Sí | Fecha de la información |
| `nombreCompleto` | string | Sí | Nombre de la tarjeta |
| `nombreCorto` | string | Sí | Nombre corto |
| `territorioValidez` | string | Sí | Territorio de validez |
| `masInformacion` | string | Sí | URL con más información |
| `comisionMaximaAdministracionMantenimiento` | double | Sí | Comisión máxima de administración/mantenimiento |
| `comisionMaximaRenovacion` | double | Sí | Comisión máxima de renovación |
| `tasaEfectivaAnualMaximaFinanciacion` | double | Sí | TEA máxima para financiación |
| `tasaEfectivaAnualMaximaAdelantoEfectivo` | double | Sí | TEA máxima para adelanto de efectivo |
| `ingresoMinimoMensual` | double | Sí | Ingreso mínimo |
| `antiguedadLaboralMinimaMeses` | integer (int32) | Sí | Antigüedad laboral mínima |
| `edadMaximaSolicitada` | integer (int32) | Sí | Edad máxima |
| `segmento` | string | Sí | Segmento objetivo |

---

## 7. Códigos de Respuesta HTTP Comunes

| Código | Significado | Descripción |
|--------|-------------|-------------|
| **200** | Success | La solicitud fue procesada correctamente |
| **400** | Bad Request | La solicitud contiene parámetros inválidos o faltantes |
| **404** | Not Found | El recurso solicitado no fue encontrado |
| **500** | Server Error | Error interno del servidor |

---

## 8. Estructura de Error Estándar

Todas las APIs comparten una estructura de error uniforme:

```json
{
  "status": 400,
  "errorMessages": [
    "Descripción del error"
  ]
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `status` | integer (int32) | Código HTTP del error |
| `errorMessages` | array[string] | Lista de mensajes descriptivos del error |

---

## Resumen de Todos los Endpoints

| # | API | Método | Endpoint | Descripción |
|---|-----|--------|----------|-------------|
| 1 | Central de Deudores | GET | `/centraldedeudores/v1.0/Deudas/{Identificacion}` | Deudas actuales por CUIT/CUIL/CDI |
| 2 | Central de Deudores | GET | `/centraldedeudores/v1.0/Deudas/Historicas/{Identificacion}` | Historial de deudas (24 meses) |
| 3 | Central de Deudores | GET | `/centraldedeudores/v1.0/Deudas/ChequesRechazados/{Identificacion}` | Cheques rechazados por CUIT |
| 4 | Cheques Denunciados | GET | `/cheques/v1.0/entidades` | Listado de entidades financieras |
| 5 | Cheques Denunciados | GET | `/cheques/v1.0/denunciados/{codigoEntidad}/{numeroCheque}` | Consultar cheque denunciado |
| 6 | Estadísticas Cambiarias | GET | `/estadisticascambiarias/v1.0/Maestros/Divisas` | Listado de divisas |
| 7 | Estadísticas Cambiarias | GET | `/estadisticascambiarias/v1.0/Cotizaciones` | Cotizaciones del día |
| 8 | Estadísticas Cambiarias | GET | `/estadisticascambiarias/v1.0/Cotizaciones/{codMoneda}` | Cotizaciones históricas por moneda |
| 9 | Estadísticas Monetarias | GET | `/estadisticas/v4.0/Monetarias` | Catálogo de variables monetarias |
| 10 | Estadísticas Monetarias | GET | `/estadisticas/v4.0/Monetarias/{IdVariable}` | Datos de una variable monetaria |
| 11 | Estadísticas Monetarias | GET | `/estadisticas/v4.0/Metodologia` | Metodología de todas las variables |
| 12 | Estadísticas Monetarias | GET | `/estadisticas/v4.0/Metodologia/{idVariable}` | Metodología de una variable |
| 13 | Régimen de Transparencia | GET | `/transparencia/v1.0/CajasAhorros` | Cajas de ahorro |
| 14 | Régimen de Transparencia | GET | `/transparencia/v1.0/PaquetesProductos` | Paquetes de productos |
| 15 | Régimen de Transparencia | GET | `/transparencia/v1.0/PlazosFijos` | Plazos fijos |
| 16 | Régimen de Transparencia | GET | `/transparencia/v1.0/Prestamos/Prendarios` | Préstamos prendarios |
| 17 | Régimen de Transparencia | GET | `/transparencia/v1.0/Prestamos/Hipotecarios` | Préstamos hipotecarios |
| 18 | Régimen de Transparencia | GET | `/transparencia/v1.0/Prestamos/Personales` | Préstamos personales |
| 19 | Régimen de Transparencia | GET | `/transparencia/v1.0/TarjetasCredito` | Tarjetas de crédito |

---

*Documentación generada a partir de las especificaciones OpenAPI 3.0.1 oficiales del BCRA.*
*Para actualizaciones, suscribirse en: https://www.dopplerpages.com/api-7A0A7/notificaciones-apis*
