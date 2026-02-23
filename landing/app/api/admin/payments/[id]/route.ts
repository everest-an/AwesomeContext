import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/payments/[id] — update status/note
export const PATCH = auth(async (req, ctx) => {
  if (!req.auth?.user?.id || req.auth.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;
  const body = await req.json();
  const { status, note } = body as { status?: string; note?: string };

  const data: Record<string, string> = {};
  if (status && ["completed", "pending", "refunded"].includes(status))
    data.status = status;
  if (note !== undefined) data.note = note;

  const payment = await prisma.payment.update({ where: { id }, data });
  return NextResponse.json({ payment });
});

// DELETE /api/admin/payments/[id]
export const DELETE = auth(async (req, ctx) => {
  if (!req.auth?.user?.id || req.auth.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;
  await prisma.payment.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
