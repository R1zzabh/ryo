import { SignIn } from "~~/components/sign-in";
import { auth } from "~~/lib/auth";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">RYO FORMS</h1>
      <p className="mb-8 text-2xl">Use AI to create forms</p>
      <SignIn />
    </div>
  );
}
