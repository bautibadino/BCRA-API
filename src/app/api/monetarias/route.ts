import { NextRequest, NextResponse } from "next/server";
import { monetariasService } from "@/lib/services";

// GET /api/monetarias — catálogo de variables monetarias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: Record<string, string | number> = {};

    for (const [key, value] of searchParams.entries()) {
      if (["Limit", "Offset", "IdVariable"].includes(key)) {
        filters[key] = Number(value);
      } else {
        filters[key] = value;
      }
    }

    const data = await monetariasService.getVariables(
      Object.keys(filters).length > 0 ? filters as any : undefined
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ status: 500, errorMessages: [message] }, { status: 500 });
  }
}
