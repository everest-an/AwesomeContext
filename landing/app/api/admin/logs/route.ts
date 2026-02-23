import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/logs?level=error&source=auth&search=keyword&limit=50&offset=0&from=2026-01-01&to=2026-12-31
export const GET = auth(async (req) => {
  if (!req.auth?.user?.id || req.auth.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const level = url.searchParams.get("level") || undefined;
  const source = url.searchParams.get("source") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 200);
  const offset = parseInt(url.searchParams.get("offset") ?? "0");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (level) where.level = level;
  if (source) where.source = source;
  if (search) where.message = { contains: search, mode: "insensitive" };
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const [logs, total] = await Promise.all([
    prisma.appLog.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.appLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total });
});
