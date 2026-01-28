import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">DayByDay</h1>
        <p className="text-xl text-muted-foreground">
          Your personal life dashboard. Track your gym progress, job applications, and subscriptions all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-up"
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/80",
              "h-10 px-4"
            )}
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all",
              "border border-border bg-background hover:bg-muted hover:text-foreground shadow-xs",
              "h-10 px-4"
            )}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
