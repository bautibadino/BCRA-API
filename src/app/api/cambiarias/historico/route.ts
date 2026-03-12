import { NextRequest, NextResponse } from "next/server";
import { cambiariasService } from "@/lib/services";

// GET /api/cambiarias/historico?moneda=USD&desde=2026-01-01&hasta=2026-03-10
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moneda = searchParams.get("moneda");
    const rawDesde = searchParams.get("desde") || undefined;
    const rawHasta = searchParams.get("hasta") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 365;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : 0;

    const today = new Date();
    const todayYmd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const desde = rawDesde && /^\d{4}-\d{2}-\d{2}$/.test(rawDesde) ? rawDesde : undefined;
    const hastaBase = rawHasta && /^\d{4}-\d{2}-\d{2}$/.test(rawHasta) ? rawHasta : undefined;
    const hasta = hastaBase && hastaBase > todayYmd ? todayYmd : hastaBase;

    if (!moneda) {
      return NextResponse.json(
        { status: 400, errorMessages: ["Parámetro 'moneda' requerido"] },
        { status: 400 }
      );
    }

    if (desde && hasta && desde > hasta) {
      return NextResponse.json(
        { status: 400, errorMessages: ["Rango de fechas inválido: 'desde' no puede ser mayor a 'hasta'"] },
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
