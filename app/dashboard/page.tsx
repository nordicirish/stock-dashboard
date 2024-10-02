import UserDashboard from "@/components/user-dashboard";

export default async function Page() {
  return (
    <div className="flex flex-1 mb-6 flex-col h-full rounded-md border-2 border-gray-800/50 dark:border-gray-200/50 border-dashed w-full max-w-[82rem] mx-auto">
      <UserDashboard />
    </div>
  );
}
