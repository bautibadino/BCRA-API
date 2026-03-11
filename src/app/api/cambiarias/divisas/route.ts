import { NextResponse } from "next/server";
import { cambiariasService } from "@/lib/services";

// GET /api/cambiarias/divisas
export async function GET() {
  try {
    const data = await cambiariasService.getDivisas();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ status: 500, errorMessages: [message] }, { status: 500 });
  }
}
