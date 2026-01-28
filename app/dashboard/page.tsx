"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Briefcase, CreditCard } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const streak = useQuery(api.workouts.getStreak, userId ? { userId } : "skip");
  const jobStats = useQuery(api.jobApplications.getStats, userId ? { userId } : "skip");
  const subAnalytics = useQuery(api.subscriptions.getAnalytics, userId ? { userId } : "skip");

  const today = new Date();
  const workoutStats = useQuery(
    api.workouts.getMonthlyStats,
    userId
      ? { userId, month: today.getMonth() + 1, year: today.getFullYear() }
      : "skip"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your progress</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/gym">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gym Progress</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{streak ?? 0} day streak</div>
              <p className="text-xs text-muted-foreground">
                {workoutStats?.completed ?? 0} workouts this month ({workoutStats?.percentage ?? 0}%)
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/jobs">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobStats?.total ?? 0} applications</div>
              <p className="text-xs text-muted-foreground">
                {jobStats?.applied ?? 0} applied, {jobStats?.interviewing ?? 0} interviewing
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/subscriptions">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${((subAnalytics?.monthlyTotal ?? 0) / 100).toFixed(2)}/mo
              </div>
              <p className="text-xs text-muted-foreground">
                {subAnalytics?.activeCount ?? 0} active subscriptions
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
