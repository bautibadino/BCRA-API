/**
 * Next.js Instrumentation Hook.
 * Se ejecuta una sola vez al iniciar el servidor.
 * Acá inicializamos los cron jobs para pre-cachear datos del BCRA.
 */
export async function register() {
  // Solo correr en el servidor (no en edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const cron = await import("node-cron");
    const { cambiariasService } = await import("@/lib/services");
    const { monetariasService } = await import("@/lib/services");
    const { transparenciaService } = await import("@/lib/services");

    console.log("[CRON] Inicializando cron jobs para pre-cache BCRA...");

    // Cada hora en horario bancario (9-18 AR): pre-cachear cotizaciones
    cron.default.schedule("0 9-18 * * 1-5", async () => {
      console.log("[CRON] Actualizando cotizaciones cambiarias...");
      try {
        await cambiariasService.getCotizacionesHoy();
        await cambiariasService.getDivisas();
        console.log("[CRON] Cotizaciones actualizadas OK");
      } catch (e) {
        console.error("[CRON] Error actualizando cotizaciones:", e);
      }
    });

    // Cada 2 horas: pre-cachear catálogo de variables monetarias
    cron.default.schedule("0 */2 * * *", async () => {
      console.log("[CRON] Actualizando catálogo monetarias...");
      try {
        await monetariasService.getVariables({ Limit: 500 });
        console.log("[CRON] Catálogo monetarias actualizado OK");
      } catch (e) {
        console.error("[CRON] Error actualizando monetarias:", e);
      }
    });

    // Una vez al día a las 3 AM: pre-cachear transparencia
    cron.default.schedule("0 3 * * *", async () => {
      console.log("[CRON] Actualizando datos de transparencia...");
      try {
        await Promise.allSettled([
          transparenciaService.getPlazosFijos(),
          transparenciaService.getPrestamosPersonales(),
          transparenciaService.getPrestamosHipotecarios(),
          transparenciaService.getPrestamosPrendarios(),
          transparenciaService.getTarjetasCredito(),
          transparenciaService.getCajasAhorros(),
          transparenciaService.getPaquetesProductos(),
        ]);
        console.log("[CRON] Transparencia actualizada OK");
      } catch (e) {
        console.error("[CRON] Error actualizando transparencia:", e);
      }
    });

    console.log("[CRON] Cron jobs registrados.");
  }
}
