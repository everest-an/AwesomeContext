import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminTabs from "@/components/admin/AdminTabs";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/dashboard");

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminTabs />
      {children}
    </div>
  );
}
