import { NextRequest, NextResponse } from "next/server";
import { deudoresService } from "@/lib/services";

// GET /api/deudores/reporte?cuit=20123456789
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cuit = searchParams.get("cuit");

    if (!cuit || !/^\d{11}$/.test(cuit)) {
      return NextResponse.json(
        { status: 400, errorMessages: ["CUIT inválido. Debe tener 11 dígitos."] },
        { status: 400 }
      );
    }

    const reporte = await deudoresService.getReporteCompleto(Number(cuit));
    return NextResponse.json({ status: 200, results: reporte });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ status: 500, errorMessages: [message] }, { status: 500 });
  }
}
