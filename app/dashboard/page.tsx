import { AppSidebar } from "@/components/app-sidebar";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { UserDashboard } from "@/components/user-dashboard";

export default async function Page() {
  const { cookies } = await import("next/headers");
  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <AppSidebar />
      <div className="flex flex-1 flex-col items-center">
        <div className="h-full w-full max-w-[82rem] rounded-md border-2 border-dashed my-4">
          <SidebarTrigger />
          <UserDashboard />
        </div>
      </div>
    </SidebarLayout>
  );
}
