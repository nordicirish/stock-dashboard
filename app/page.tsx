import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

//use async function as getServerSession is promise
export default async function Home() {
  const session = await getServerSession(authOptions);
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