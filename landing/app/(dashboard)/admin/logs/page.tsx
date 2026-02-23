import { prisma } from "@/lib/prisma";
import LogViewer from "@/components/admin/LogViewer";

export default async function AdminLogsPage() {
  const [logs, total] = await Promise.all([
    prisma.appLog.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.appLog.count(),
  ]);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Application Logs</h2>
      <LogViewer
        initialLogs={logs.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
        }))}
        initialTotal={total}
      />
    </div>
  );
}
