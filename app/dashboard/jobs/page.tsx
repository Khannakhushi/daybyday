"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { JobList } from "@/components/jobs/job-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PageTransition,
  FadeText,
  AnimatedContainer,
  AnimatedItem,
} from "@/components/motion";

export default function JobsPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const stats = useQuery(
    api.jobApplications.getStats,
    userId ? { userId } : "skip"
  );

  return (
    <PageTransition className="space-y-6">
      <FadeText delay={0.1}>
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-muted-foreground">Track your job search progress</p>
      </FadeText>

      <AnimatedContainer
        className="grid gap-4 md:grid-cols-5"
        delay={0.2}
        staggerDelay={0.08}
      >
        <AnimatedItem>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Not Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.not_applied ?? 0}</div>
            </CardContent>
          </Card>
        </AnimatedItem>
        <AnimatedItem>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.applied ?? 0}</div>
            </CardContent>
          </Card>
        </AnimatedItem>
        <AnimatedItem>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Interviewing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.interviewing ?? 0}</div>
            </CardContent>
          </Card>
        </AnimatedItem>
        <AnimatedItem>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.offer ?? 0}</div>
            </CardContent>
          </Card>
        </AnimatedItem>
        <AnimatedItem>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.rejected ?? 0}</div>
            </CardContent>
          </Card>
        </AnimatedItem>
      </AnimatedContainer>

      <AnimatedItem>
        <JobList />
      </AnimatedItem>
    </PageTransition>
  );
}
