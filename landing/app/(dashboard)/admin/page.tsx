import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";

export default async function AdminOverviewPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalKeys,
    totalCalls,
    totalRevenue,
    callsByTool,
    usersByCountry,
    usersBySource,
    dailySignups,
    dailyCalls,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.apiKey.count({ where: { isActive: true } }),
    prisma.usageLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.usageLog.groupBy({
      by: ["toolName"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
    prisma.$queryRaw<{ country: string; count: number }[]>`
      SELECT country, COUNT(*)::int as count
      FROM "User"
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
      LIMIT 15
    `,
    prisma.$queryRaw<{ provider: string; count: number }[]>`
      SELECT a.provider, COUNT(DISTINCT a."userId")::int as count
      FROM "Account" a
      GROUP BY a.provider
      ORDER BY count DESC
    `,
    prisma.$queryRaw<{ date: string; count: number }[]>`
      SELECT DATE("createdAt")::text as date, COUNT(*)::int as count
      FROM "User"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
    prisma.$queryRaw<{ date: string; count: number }[]>`
      SELECT DATE("createdAt")::text as date, COUNT(*)::int as count
      FROM "UsageLog"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
  ]);

  const revenue = totalRevenue._sum.amount ?? 0;

  return (
    <>
      {/* Global stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={totalUsers.toString()} />
        <StatCard label="Active Keys" value={totalKeys.toString()} />
        <StatCard label="Calls (30d)" value={totalCalls.toString()} />
        <StatCard
          label="Revenue"
          value={revenue > 0 ? `$${(revenue / 100).toFixed(2)}` : "$0"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Signups */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Signups (30d)</h2>
          {dailySignups.length === 0 ? (
            <p className="text-[13px] text-[var(--text-tertiary)]">
              No signups in the last 30 days.
            </p>
          ) : (
            <BarList
              items={dailySignups.map((d) => ({
                label: d.date.slice(5),
                value: d.count,
              }))}
            />
          )}
        </div>

        {/* Daily API Calls */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">API Calls (30d)</h2>
          {dailyCalls.length === 0 ? (
            <p className="text-[13px] text-[var(--text-tertiary)]">
              No API calls in the last 30 days.
            </p>
          ) : (
            <BarList
              items={dailyCalls.map((d) => ({
                label: d.date.slice(5),
                value: d.count,
              }))}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Tool breakdown */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Usage by Tool (30d)</h2>
          {callsByTool.length === 0 ? (
            <p className="text-[13px] text-[var(--text-tertiary)]">No data.</p>
          ) : (
            <BarList
              items={callsByTool.map((t) => ({
                label: t.toolName,
                value: t._count,
              }))}
            />
          )}
        </div>

        {/* Users by Country */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Users by Country</h2>
          {usersByCountry.length === 0 ? (
            <p className="text-[13px] text-[var(--text-tertiary)]">
              No geo data yet.
            </p>
          ) : (
            <BarList
              items={usersByCountry.map((c) => ({
                label: c.country,
                value: c.count,
              }))}
            />
          )}
        </div>

        {/* Users by Source */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Users by Source</h2>
          {usersBySource.length === 0 ? (
            <p className="text-[13px] text-[var(--text-tertiary)]">
              No data yet.
            </p>
          ) : (
            <BarList
              items={usersBySource.map((s) => ({
                label: s.provider,
                value: s.count,
              }))}
            />
          )}
        </div>
      </div>
    </>
  );
}

function BarList({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-[13px] mb-1">
            <span className="text-[var(--text-secondary)]">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--glass-bg)]">
            <div
              className="h-2 rounded-full bg-[var(--accent)]"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
