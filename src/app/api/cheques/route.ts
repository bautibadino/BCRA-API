import { NextResponse } from "next/server";
import { chequesService } from "@/lib/services";

// GET /api/cheques — listado de entidades
export async function GET() {
  try {
    const data = await chequesService.getEntidades();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ status: 500, errorMessages: [message] }, { status: 500 });
  }
}
