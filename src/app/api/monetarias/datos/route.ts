import { NextRequest, NextResponse } from "next/server";
import { monetariasService } from "@/lib/services";

// GET /api/monetarias/datos?id=1&desde=2026-01-01&hasta=2026-03-10
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const desde = searchParams.get("desde") || undefined;
    const hasta = searchParams.get("hasta") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;

    if (!id) {
      return NextResponse.json(
        { status: 400, errorMessages: ["Parámetro 'id' requerido"] },
        { status: 400 }
      );
    }

    const data = await monetariasService.getDatosVariable(
      Number(id), desde, hasta, limit, offset
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ status: 500, errorMessages: [message] }, { status: 500 });
  }
}
