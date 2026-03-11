import { NextRequest, NextResponse } from "next/server";
import { transparenciaService } from "@/lib/services";

// GET /api/transparencia?tipo=plazos-fijos&entidad=11
// Tipos: cajas-ahorro, paquetes, plazos-fijos, prendarios, hipotecarios, personales, tarjetas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const entidad = searchParams.get("entidad")
      ? Number(searchParams.get("entidad"))
      : undefined;

    if (!tipo) {
      return NextResponse.json(
        { status: 400, errorMessages: ["Parámetro 'tipo' requerido. Valores: cajas-ahorro, paquetes, plazos-fijos, prendarios, hipotecarios, personales, tarjetas"] },
        { status: 400 }
      );
    }

    const serviceMap: Record<string, (e?: number) => Promise<unknown>> = {
      "cajas-ahorro": transparenciaService.getCajasAhorros,
      "paquetes": transparenciaService.getPaquetesProductos,
      "plazos-fijos": transparenciaService.getPlazosFijos,
      "prendarios": transparenciaService.getPrestamosPrendarios,
      "hipotecarios": transparenciaService.getPrestamosHipotecarios,
      "personales": transparenciaService.getPrestamosPersonales,
      "tarjetas": transparenciaService.getTarjetasCredito,
    };

    const serviceFn = serviceMap[tipo];
    if (!serviceFn) {
      return NextResponse.json(
        { status: 400, errorMessages: [`Tipo '${tipo}' no válido`] },
        { status: 400 }
      );
    }

    const data = await serviceFn(entidad);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ status: 500, errorMessages: [message] }, { status: 500 });
  }
}
