import { prisma } from "@/lib/prisma";
import PaymentManager from "@/components/admin/PaymentManager";

export default async function AdminPaymentsPage() {
  const [payments, users, totalRevenue] = await Promise.all([
    prisma.payment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "completed" },
    }),
  ]);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Payments</h2>
      <PaymentManager
        payments={payments.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        }))}
        users={users}
        totalRevenue={totalRevenue._sum.amount ?? 0}
      />
    </div>
  );
}
