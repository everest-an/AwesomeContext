import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/users/[id] — update user source/role
export const PATCH = auth(async (req, ctx) => {
  if (!req.auth?.user?.id || req.auth.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;
  const body = await req.json();
  const { source, role } = body as { source?: string; role?: string };

  const data: Record<string, string> = {};
  if (source !== undefined) data.source = source;
  if (role !== undefined && ["user", "admin"].includes(role)) data.role = role;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ user });
});
