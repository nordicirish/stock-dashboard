import { SignUp } from "@clerk/nextjs";
export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 pb-20  sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <SignUp />
    </div>
  );
}   
