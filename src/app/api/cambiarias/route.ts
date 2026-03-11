import { NextRequest, NextResponse } from "next/server";
import { cambiariasService } from "@/lib/services";

// GET /api/cambiarias — cotizaciones del día (o de una fecha)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get("fecha") || undefined;

    const data = await cambiariasService.getCotizacionesHoy(fecha);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      { status: 500, errorMessages: [message] },
      { status: 500 }
    );
  }
}
