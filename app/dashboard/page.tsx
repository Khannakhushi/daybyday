"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Briefcase, CreditCard } from "lucide-react";
import Link from "next/link";
import {
  PageTransition,
  AnimatedContainer,
  AnimatedItem,
  FadeText,
  AnimatedCard,
} from "@/components/motion";

export default function DashboardPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const streak = useQuery(api.workouts.getStreak, userId ? { userId } : "skip");
  const jobStats = useQuery(
    api.jobApplications.getStats,
    userId ? { userId } : "skip"
  );
  const subAnalytics = useQuery(
    api.subscriptions.getAnalytics,
    userId ? { userId } : "skip"
  );

  const today = new Date();
  const workoutStats = useQuery(
    api.workouts.getMonthlyStats,
    userId
      ? { userId, month: today.getMonth() + 1, year: today.getFullYear() }
      : "skip"
  );

  return (
    <PageTransition className="space-y-6">
      <FadeText delay={0.1}>
        <h1 className="text-3xl font-bold">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your progress
        </p>
      </FadeText>

      <AnimatedContainer
        className="grid gap-4 md:grid-cols-3"
        delay={0.2}
        staggerDelay={0.1}
      >
        <AnimatedItem>
          <Link href="/dashboard/gym">
            <AnimatedCard className="hover:glow-primary transition-shadow rounded-xl">
              <Card className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gym Progress
                  </CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {streak ?? 0} day streak
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {workoutStats?.completed ?? 0} workouts this month (
                    {workoutStats?.percentage ?? 0}%)
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          </Link>
        </AnimatedItem>

        <AnimatedItem>
          <Link href="/dashboard/jobs">
            <AnimatedCard className="hover:glow-primary transition-shadow rounded-xl">
              <Card className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Job Applications
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {jobStats?.total ?? 0} applications
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {jobStats?.applied ?? 0} applied, {jobStats?.interviewing ?? 0}{" "}
                    interviewing
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          </Link>
        </AnimatedItem>

        <AnimatedItem>
          <Link href="/dashboard/subscriptions">
            <AnimatedCard className="hover:glow-primary transition-shadow rounded-xl">
              <Card className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
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
            </AnimatedCard>
          </Link>
        </AnimatedItem>
      </AnimatedContainer>
    </PageTransition>
  );
}
