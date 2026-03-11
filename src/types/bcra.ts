// ============================================================
// TIPOS COMUNES
// ============================================================

export interface BCRAErrorResponse {
  status: number;
  errorMessages: string[];
}

export interface BCRAPaginationMetadata {
  resultset: {
    count: number;
    offset: number;
    limit: number;
  };
}

// ============================================================
// CENTRAL DE DEUDORES v1.0
// ============================================================

export interface DeudaEntidad {
  entidad: string | null;
  situacion: number | null;
  fechaSit1: string | null;
  monto: number | null;
  diasAtrasoPago: number | null;
  refinanciaciones: boolean;
  recategorizacionOblig: boolean;
  situacionJuridica: boolean;
  irrecDisposicionTecnica: boolean;
  enRevision: boolean;
  procesoJud: boolean;
}

export interface DeudaPeriodo {
  periodo: string;
  entidades: DeudaEntidad[];
}

export interface DeudaResult {
  identificacion: number;
  denominacion: string | null;
  periodos: DeudaPeriodo[];
}

export interface DeudaResponse {
  status: number;
  results: DeudaResult;
}

export interface HistorialEntidad {
  entidad: string | null;
  situacion: number;
  monto: number;
  enRevision: boolean;
  procesoJud: boolean;
}

export interface HistorialPeriodo {
  periodo: string;
  entidades: HistorialEntidad[];
}

export interface HistorialResult {
  identificacion: number;
  denominacion: string | null;
  periodos: HistorialPeriodo[];
}

export interface HistorialResponse {
  status: number;
  results: HistorialResult;
}

export interface ChequeRechazadoDetalle {
  nroCheque: number;
  fechaRechazo: string;
  monto: number;
  fechaPago: string | null;
  fechaPagoMulta: string | null;
  estadoMulta: string | null;
  ctaPersonal: boolean;
  denomJuridica: string | null;
  enRevision: boolean;
  procesoJud: boolean;
}

export interface ChequeRechazadoEntidad {
  entidad: number;
  detalle: ChequeRechazadoDetalle[];
}

export interface ChequeRechazadoCausal {
  causal: string;
  entidades: ChequeRechazadoEntidad[];
}

export interface ChequesRechazadosResult {
  identificacion: number;
  denominacion: string | null;
  causales: ChequeRechazadoCausal[];
}

export interface ChequesRechazadosResponse {
  status: number;
  results: ChequesRechazadosResult;
}

// ============================================================
// CHEQUES DENUNCIADOS v1.0
// ============================================================

export interface Entidad {
  codigoEntidad: number;
  denominacion: string | null;
}

export interface EntidadResponse {
  status: number;
  results: Entidad[];
}

export interface ChequeDetalle {
  sucursal: number;
  numeroCuenta: number;
  causal: string | null;
}

export interface Cheque {
  numeroCheque: number;
  denunciado: boolean;
  fechaProcesamiento: string;
  denominacionEntidad: string | null;
  detalles: ChequeDetalle[] | null;
}

export interface ChequeResponse {
  status: number;
  results: Cheque;
}

// ============================================================
// ESTADÍSTICAS CAMBIARIAS v1.0
// ============================================================

export interface Divisa {
  codigo: string;
  denominacion: string;
}

export interface DivisaResponse {
  status: number;
  results: Divisa[];
}

export interface CotizacionDetalle {
  codigoMoneda: string | null;
  descripcion: string | null;
  tipoPase: number;
  tipoCotizacion: number;
}

export interface CotizacionDia {
  fecha: string;
  detalle: CotizacionDetalle[];
}

export interface CotizacionDiaResponse {
  status: number;
  results: CotizacionDia;
}

export interface CotizacionesHistoricasResponse {
  status: number;
  metadata: BCRAPaginationMetadata;
  results: CotizacionDia[];
}

// ============================================================
// ESTADÍSTICAS MONETARIAS v4.0
// ============================================================

export interface VariableMonetaria {
  idVariable: number;
  descripcion: string | null;
  categoria: string | null;
  tipoSerie: string | null;
  periodicidad: string | null;
  unidadExpresion: string | null;
  moneda: string | null;
  primerFechaInformada: string | null;
  ultFechaInformada: string | null;
  ultValorInformado: number | null;
}

export interface MonetariasResponse {
  status: number;
  metadata: BCRAPaginationMetadata;
  results: VariableMonetaria[];
}

export interface DetalleMonetaria {
  fecha: string;
  valor: number;
}

export interface DatosMonetaria {
  idVariable: number;
  detalle: DetalleMonetaria[];
}

export interface DatosMonetariaResponse {
  status: number;
  metadata: BCRAPaginationMetadata;
  results: DatosMonetaria[];
}

export interface Metadato {
  id: number;
  detalle: string | null;
}

export interface MetadatoResponse {
  status: number;
  results: Metadato[];
}

export interface MetadatoListResponse {
  status: number;
  metadata: BCRAPaginationMetadata;
  results: Metadato[][];
}

// ============================================================
// RÉGIMEN DE TRANSPARENCIA v1.0
// ============================================================

export interface CajaAhorro {
  codigoEntidad: number;
  descripcionEntidad: string | null;
  fechaInformacion: string | null;
  procesoSimplificadoDebidaDiligencia: string | null;
}

export interface CajaAhorroResponse {
  status: number;
  results: CajaAhorro[];
}

export interface PaqueteProducto {
  codigoEntidad: number;
  descripcionEntidad: string | null;
  fechaInformacion: string | null;
  nombreCompleto: string | null;
  nombreCorto: string | null;
  territorioValidez: string | null;
  masInformacion: string | null;
  comisionMaximaMantenimiento: number | null;
  ingresoMinimoMensual: number | null;
  antiguedadLaboralMinimaMeses: number | null;
  edadMaximaSolicitada: number | null;
  beneficiarios: string | null;
  segmento: string | null;
  productosIntegrantes: string | null;
}

export interface PaqueteProductoResponse {
  status: number;
  results: PaqueteProducto[];
}

export interface PlazoFijo {
  codigoEntidad: number;
  descripcionEntidad: string | null;
  fechaInformacion: string | null;
  nombreCompleto: string | null;
  nombreCorto: string | null;
  territorioValidez: string | null;
  masInformacion: string | null;
  denominacion: string | null;
  montoMinimoInvertir: number | null;
  plazoMinimoInvertirDias: number | null;
  canalConstitucion: string | null;
  tasaEfectivaAnualMinima: number | null;
}

export interface PlazoFijoResponse {
  status: number;
  results: PlazoFijo[];
}

export interface PrestamoPrendario {
  codigoEntidad: number;
  descripcionEntidad: string | null;
  fechaInformacion: string | null;
  nombreCompleto: string | null;
  nombreCorto: string | null;
  territorioValidez: string | null;
  masInformacion: string | null;
  denominacion: string | null;
  montoMaximoOtorgable: number | null;
  montoMinimoOtorgable: number | null;
  plazoMaximoOtorgable: number | null;
  ingresoMinimoMensual: number | null;
  antiguedadLaboralMinimaMeses: number | null;
  edadMaximaSolicitada: number | null;
  relacionCuotaIngreso: number | null;
  beneficiario: string | null;
  cargoMaximoCancelacionAnticipada: number | null;
  tasaEfectivaAnualMaxima: number | null;
  tipoTasa: string | null;
  costoFinancieroEfectivoTotalMaximo: number | null;
  relacionMontoTasacion: number | null;
  destinoFondos: string | null;
  cuotaInicialCada10k: number | null;
}

export interface PrestamoPrendarioResponse {
  status: number;
  results: PrestamoPrendario[];
}

export interface PrestamoHipotecario {
  codigoEntidad: number;
  descripcionEntidad: string | null;
  fechaInformacion: string | null;
  nombreCompleto: string | null;
  nombreCorto: string | null;
  territorioValidez: string | null;
  masInformacion: string | null;
  denominacion: string | null;
  montoMaximoOtorgable: number | null;
  plazoMaximoOtorgable: number | null;
  ingresoMinimoMensual: number | null;
  antiguedadLaboralMinimaMeses: number | null;
  edadMaximaSolicitada: number | null;
  relacionCuotaIngreso: number | null;
  beneficiario: string | null;
  cargoMaximoCancelacionAnticipada: number | null;
  tasaEfectivaAnualMaxima: number | null;
  tipoTasa: string | null;
  costoFinancieroEfectivoTotalMaximo: number | null;
  relacionMontoTasacion: number | null;
  destinoFondos: string | null;
  cuotaInicialCada100k: number | null;
}

export interface PrestamoHipotecarioResponse {
  status: number;
  results: PrestamoHipotecario[];
}

export interface PrestamoPersonal {
  codigoEntidad: number;
  descripcionEntidad: string | null;
  fechaInformacion: string | null;
  nombreCompleto: string | null;
  nombreCorto: string | null;
  territorioValidez: string | null;
  masInformacion: string | null;
  denominacion: string | null;
  montoMaximoOtorgable: number | null;
  montoMinimoOtorgable: number | null;
  plazoMaximoOtorgable: number | null;
  ingresoMinimoMensual: number | null;
  antiguedadLaboralMinimaMeses: number | null;
  edadMaximaSolicitada: number | null;
  relacionCuotaIngreso: number | null;
  beneficiario: string | null;
  cargoMaximoCancelacionAnticipada: number | null;
  tasaEfectivaAnualMaxima: number | null;
  tipoTasa: string | null;
  costoFinancieroEfectivoTotalMaximo: number | null;
  cuotaInicialCada10k: number | null;
}

export interface PrestamoPersonalResponse {
  status: number;
  results: PrestamoPersonal[];
}

export interface TarjetaCredito {
  codigoEntidad: number;
  descripcionEntidad: string | null;
  fechaInformacion: string | null;
  nombreCompleto: string | null;
  nombreCorto: string | null;
  territorioValidez: string | null;
  masInformacion: string | null;
  comisionMaximaAdministracionMantenimiento: number | null;
  comisionMaximaRenovacion: number | null;
  tasaEfectivaAnualMaximaFinanciacion: number | null;
  tasaEfectivaAnualMaximaAdelantoEfectivo: number | null;
  ingresoMinimoMensual: number | null;
  antiguedadLaboralMinimaMeses: number | null;
  edadMaximaSolicitada: number | null;
  segmento: string | null;
}

export interface TarjetaCreditoResponse {
  status: number;
  results: TarjetaCredito[];
}
