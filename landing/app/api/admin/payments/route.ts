import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/payments — list all payments
export const GET = auth(async (req) => {
  if (!req.auth?.user?.id || req.auth.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ payments });
});

// POST /api/admin/payments — create a manual payment
export const POST = auth(async (req) => {
  if (!req.auth?.user?.id || req.auth.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, amount, currency, method, note } = body as {
    userId: string;
    amount: number;
    currency?: string;
    method?: string;
    note?: string;
  };

  if (!userId || !amount || amount <= 0) {
    return NextResponse.json(
      { error: "userId and amount are required" },
      { status: 400 },
    );
  }

  const payment = await prisma.payment.create({
    data: {
      userId,
      amount: Math.round(amount),
      currency: currency ?? "USD",
      method: method ?? "manual",
      note: note ?? null,
    },
  });

  return NextResponse.json({ payment }, { status: 201 });
});
