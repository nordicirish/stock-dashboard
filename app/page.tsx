import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

//use async function as getServerSession is promise
export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 mt-8">
      <h1>Hello {session?.user?.name}! </h1>
      <p>
        {" "}
        Please visit your{" "}
        <Link className="underline" href="/dashboard">
          Dashboard
        </Link>{" "}
        to see your portfolio
      </p>
    </div>
  );
}
