import { AppLogo } from "@/app/(protected)/_components/app-logo";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";

const Page = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="container relative grid h-full flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Login
      </Link> */}
        <div className="relative hidden h-full flex-col bg-muted p-20 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-[url('/signin.png')]"
            style={{
              backgroundImage: "url('/static/signin.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <AppLogo />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="space-y-6 px-20 text-black">
              <h1 className="text-[4vw] font-bold leading-tight">
                Unlock A Stronger Financial Future
              </h1>
              <p className="text-lg">
                With DiversyFund, you get more than just an investment platform.
                You gain a team of partners committed to your financial success.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials below to login to your account
              </p>
            </div>
            <LoginForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account? Contact{" "}
              <Link
                href="mailto:nico.valdez@diversyfund.com"
                target="_blank"
                className="underline underline-offset-4 hover:text-primary"
              >
                Support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
