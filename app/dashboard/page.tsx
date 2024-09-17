import { AppSidebar } from "@/components/app-sidebar";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import {Dashboard } from "@/components/dashboard";
export default async function Page() {
  const { cookies } = await import("next/headers");
  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <AppSidebar />
      <main className="flex flex-1 flex-col justify-center items-center p-2 transition-all duration-300 ease-in-out ">
        <div className="h-full w-full max-w-[80rem] rounded-md border-2 border-dashed p-2">
          <SidebarTrigger />
          <Dashboard />
        </div>
      </main>
    </SidebarLayout>
  );
}
