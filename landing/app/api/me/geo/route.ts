import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lookupGeo } from "@/lib/geo";

// POST /api/me/geo — called once after login to record user location
export const POST = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.auth.user.id },
    select: { country: true },
  });

  if (user?.country) {
    return NextResponse.json({ status: "already_set" });
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";

  const { country, city } = lookupGeo(ip);

  if (country) {
    await prisma.user.update({
      where: { id: req.auth.user.id },
      data: { country, city },
    });
  }

  return NextResponse.json({ country, city });
});
