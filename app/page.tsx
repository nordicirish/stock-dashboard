import { auth, signIn, signOut } from "@/auth";

//use async function as getServerSession is promise
export default async function Home() {
   const session = await auth();
  console.log("Session:", session);

  return (
    <div className="flex justify-center items-center w-full">
      {session?.user ? (
        <div>Welcome, {session.user.name} </div>
      ) : (
        <div>Please sign in to continue</div>
      )}
    </div>
  );
}
