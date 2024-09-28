import UserDashboard from "@/components/user-dashboard";

export default async function Page() {
  return (
    <div className="flex flex-grow flex-col h-full rounded-md border-2 border-dashed mb-16 w-full max-w-[82rem] mx-auto">
      <UserDashboard />
    </div>
  );
}
