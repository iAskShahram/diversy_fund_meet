import { Button } from "@/components/ui/button";
import { signOut } from "@/server/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

export const SignOut = ({ session }: { session: Session | null }) => {
  const handleClick = async () => {
    "use server";
    if (session?.user) {
      await signOut({
        redirect: false,
      });
      redirect("/");
    } else {
      redirect("/auth/signin");
    }
  };
  return (
    <form action={handleClick}>
      <Button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        type="submit"
      >
        {session?.user ? "Sign out" : "Sign in"}
      </Button>
    </form>
  );
};
