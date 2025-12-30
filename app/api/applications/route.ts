// app/api/applications/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // 🔥 ŞART

export async function GET() {
  try {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(apps);
  } catch (err) {
    console.error("GET /api/applications error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      company,
      role,
      status,
      location,
      link,
      source,
      salary,
      notes,
    } = body;

    if (!company || !role || !status) {
      return NextResponse.json(
        { message: "company, role and status are required" },
        { status: 400 }
      );
    }

    const created = await prisma.application.create({
      data: {
        company,
        role,
        status,
        location: location || null,
        link: link || null,
        source: source || null,
        salary: salary || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/applications error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
