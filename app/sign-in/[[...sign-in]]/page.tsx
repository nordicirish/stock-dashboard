import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 pb-20  sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <SignIn />
    </div>
  );
}
