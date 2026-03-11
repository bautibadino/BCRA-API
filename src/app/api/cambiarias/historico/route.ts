import { NextRequest, NextResponse } from "next/server";
import { cambiariasService } from "@/lib/services";

// GET /api/cambiarias/historico?moneda=USD&desde=2026-01-01&hasta=2026-03-10
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moneda = searchParams.get("moneda");
    const desde = searchParams.get("desde") || undefined;
    const hasta = searchParams.get("hasta") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 365;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : 0;

    if (!moneda) {
      return NextResponse.json(
        { status: 400, errorMessages: ["Parámetro 'moneda' requerido"] },
        { status: 400 }
      );
    }

    const data = await cambiariasService.getCotizacionesMoneda(
      moneda, desde, hasta, limit, offset
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ status: 500, errorMessages: [message] }, { status: 500 });
  }
}
