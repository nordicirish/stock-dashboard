
import { UserDashboard } from "@/components/user-dashboard";

export default async function Page() {
 
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="h-full rounded-md border-2 border-dashed my-4 w-full max-w-[82rem] mx-auto">
        <UserDashboard />
      </div>
    </div>
  );
}
