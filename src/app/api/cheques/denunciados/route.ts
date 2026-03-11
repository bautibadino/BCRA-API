import { NextRequest, NextResponse } from "next/server";
import { chequesService } from "@/lib/services";

// GET /api/cheques/denunciados?entidad=11&cheque=12345678
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entidad = searchParams.get("entidad");
    const cheque = searchParams.get("cheque");

    if (!entidad || !cheque) {
      return NextResponse.json(
        { status: 400, errorMessages: ["Parámetros 'entidad' y 'cheque' requeridos"] },
        { status: 400 }
      );
    }

    const data = await chequesService.getDenunciado(Number(entidad), Number(cheque));
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ status: 500, errorMessages: [message] }, { status: 500 });
  }
}
