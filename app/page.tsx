import { auth } from "@/auth";
import { redirect } from "next/navigation";

//use async function as getServerSession is promise
export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }
if (session?.user) {
    redirect("/dashboard");
  }


  return null
}
