import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/stats
export const GET = auth(async (req) => {
  if (!req.auth?.user?.id || req.auth.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalKeys,
    totalCalls,
    callsByTool,
    topUsers,
    totalRevenue,
    usersByCountry,
    usersBySource,
    dailySignups,
    dailyCalls,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.apiKey.count({ where: { isActive: true } }),
    prisma.usageLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.usageLog.groupBy({
      by: ["toolName"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
    prisma.$queryRaw`
      SELECT u.id, u.name, u.email, u.image, COUNT(ul.id)::int as "callCount"
      FROM "User" u
      LEFT JOIN "UsageLog" ul ON u.id = ul."userId"
        AND ul."createdAt" >= ${thirtyDaysAgo}
      GROUP BY u.id, u.name, u.email, u.image
      ORDER BY "callCount" DESC
      LIMIT 20
    `,
    // Total revenue
    prisma.payment.aggregate({ _sum: { amount: true } }),
    // Users by country
    prisma.$queryRaw`
      SELECT country, COUNT(*)::int as count
      FROM "User"
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
      LIMIT 20
    `,
    // Users by source (OAuth provider)
    prisma.$queryRaw`
      SELECT a.provider, COUNT(DISTINCT a."userId")::int as count
      FROM "Account" a
      GROUP BY a.provider
      ORDER BY count DESC
    `,
    // Daily signups (last 30 days)
    prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "User"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
    // Daily API calls (last 30 days)
    prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "UsageLog"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
  ]);

  return NextResponse.json({
    totalUsers,
    totalKeys,
    totalCalls,
    callsByTool,
    topUsers,
    totalRevenue: (totalRevenue as { _sum: { amount: number | null } })._sum
      .amount ?? 0,
    usersByCountry,
    usersBySource,
    dailySignups,
    dailyCalls,
  });
});
