import { Button } from "~~/components/ui/button";
import { signIn } from "~~/lib/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("discord", { redirectTo: "/home" });
      }}
    >
      <Button type="submit">Signin with Discord</Button>
    </form>
  );
}
