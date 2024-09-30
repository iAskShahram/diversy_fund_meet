import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/lib/validators/auth";
import { signIn } from "@/server/auth";
import { redirect } from "next/navigation";
export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export function LoginForm() {
  //   const { toast } = useToast();
  const onSubmit = async (formData: FormData) => {
    "use server";
    const formFields = await signInSchema.safeParseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!formFields.success) {
      return;
    }
    const { email, password } = formFields.data;
    let redirectUrl: string | null = null;
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      const callbackUrl = new URL(res as string).searchParams.get(
        "callbackUrl",
      );
      redirectUrl = callbackUrl ?? "/";
    } catch (err) {
      console.log({ err });
    } finally {
      if (redirectUrl) {
        redirect(redirectUrl);
      }
    }
  };
  return (
    <Card className="mx-auto min-w-full">
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>Enter your credentials to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
