import { redirect } from "next/navigation";
import UserDashboard from "@/components/user-dashboard";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="flex flex-1 mb-6 flex-col h-full rounded-md border-2 border-gray-800/50 dark:border-gray-200/50 border-dashed w-full mx-auto">
      <UserDashboard />
    </div>
  );
}
