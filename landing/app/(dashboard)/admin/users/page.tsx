import { prisma } from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      source: true,
      country: true,
      city: true,
      createdAt: true,
      accounts: { select: { provider: true } },
      _count: {
        select: {
          apiKeys: { where: { isActive: true } },
          payments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Attach 30d call counts
  const callCounts = await prisma.$queryRaw<
    { userId: string; count: number }[]
  >`
    SELECT "userId", COUNT(*)::int as count
    FROM "UsageLog"
    WHERE "createdAt" >= ${thirtyDaysAgo}
    GROUP BY "userId"
  `;
  const callMap = new Map(callCounts.map((c) => [c.userId, c.count]));

  // Attach revenue per user
  const revenues = await prisma.$queryRaw<
    { userId: string; total: number }[]
  >`
    SELECT "userId", COALESCE(SUM(amount), 0)::int as total
    FROM "Payment"
    WHERE status = 'completed'
    GROUP BY "userId"
  `;
  const revenueMap = new Map(revenues.map((r) => [r.userId, r.total]));

  const enrichedUsers = users.map((u) => ({
    ...u,
    provider: u.accounts[0]?.provider ?? null,
    calls30d: callMap.get(u.id) ?? 0,
    revenue: revenueMap.get(u.id) ?? 0,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">All Users</h2>
      <UsersTable users={enrichedUsers} />
    </div>
  );
}
