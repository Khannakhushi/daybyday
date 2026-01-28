"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Target, TrendingUp } from "lucide-react";

export function StreakCounter() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const streak = useQuery(api.workouts.getStreak, userId ? { userId } : "skip");

  const today = new Date();
  const stats = useQuery(
    api.workouts.getMonthlyStats,
    userId
      ? { userId, month: today.getMonth() + 1, year: today.getFullYear() }
      : "skip"
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{streak ?? 0}</div>
          <p className="text-xs text-muted-foreground">consecutive days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{stats?.completed ?? 0}</span>
            <span className="text-sm text-muted-foreground">
              / {stats?.total ?? 0} days
            </span>
          </div>
          <Progress value={stats?.percentage ?? 0} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {stats?.percentage ?? 0}% completion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Keep Going!</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {(streak ?? 0) === 0
              ? "Start your streak today!"
              : (streak ?? 0) === 1
                ? "Great start! Keep it up!"
                : (streak ?? 0) < 7
                  ? `${7 - (streak ?? 0)} more days to a full week!`
                  : (streak ?? 0) < 30
                    ? `${30 - (streak ?? 0)} more days to a full month!`
                    : "Amazing dedication!"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
