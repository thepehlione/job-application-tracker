// app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // 🔥 ŞART

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const app = await prisma.application.findUnique({
      where: { id },
    });

    if (!app) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(app);
  } catch (err) {
    console.error("GET /api/applications/[id] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();

    const updated = await prisma.application.update({
      where: { id },
      data: {
        company: body.company,
        role: body.role,
        status: body.status,
        location: body.location ?? undefined,
        link: body.link ?? undefined,
        source: body.source ?? undefined,
        salary: body.salary ?? undefined,
        notes: body.notes ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    console.error("PUT /api/applications/[id] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    await prisma.application.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    console.error("DELETE /api/applications/[id] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
