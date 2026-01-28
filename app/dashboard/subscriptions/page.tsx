"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { SubscriptionForm } from "@/components/subscriptions/subscription-form";
import { SpendingChart } from "@/components/subscriptions/spending-chart";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import {
  PageTransition,
  FadeText,
  AnimatedContainer,
  AnimatedItem,
} from "@/components/motion";

export default function SubscriptionsPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const subscriptions = useQuery(
    api.subscriptions.getAll,
    userId ? { userId } : "skip"
  );
  const analytics = useQuery(
    api.subscriptions.getAnalytics,
    userId ? { userId } : "skip"
  );

  const activeSubscriptions = subscriptions?.filter((s) => s.isActive) ?? [];
  const inactiveSubscriptions = subscriptions?.filter((s) => !s.isActive) ?? [];

  return (
    <PageTransition className="space-y-6">
      <FadeText delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscriptions</h1>
            <p className="text-muted-foreground">
              Manage your recurring payments
            </p>
          </div>
          <SubscriptionForm />
        </div>
      </FadeText>

      <AnimatedContainer
        className="grid gap-4 md:grid-cols-3"
        delay={0.2}
        staggerDelay={0.1}
      >
        <AnimatedItem>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Spending
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${((analytics?.monthlyTotal ?? 0) / 100).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">per month</p>
            </CardContent>
          </Card>
        </AnimatedItem>

        <AnimatedItem>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Yearly Projection
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${((analytics?.yearlyTotal ?? 0) / 100).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">per year</p>
            </CardContent>
          </Card>
        </AnimatedItem>

        <AnimatedItem>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Subscriptions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.activeCount ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">services</p>
            </CardContent>
          </Card>
        </AnimatedItem>
      </AnimatedContainer>

      <AnimatedContainer
        className="grid gap-6 lg:grid-cols-[1fr_350px]"
        delay={0.4}
        staggerDelay={0.15}
      >
        <AnimatedItem>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Active Subscriptions</h2>
            {activeSubscriptions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No active subscriptions. Add your first one!
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeSubscriptions.map((sub, index) => (
                  <div
                    key={sub._id}
                    className="hover:glow-primary transition-shadow rounded-xl"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <SubscriptionCard subscription={sub} />
                  </div>
                ))}
              </div>
            )}

            {inactiveSubscriptions.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mt-8">
                  Inactive Subscriptions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {inactiveSubscriptions.map((sub) => (
                    <SubscriptionCard key={sub._id} subscription={sub} />
                  ))}
                </div>
              </>
            )}
          </div>
        </AnimatedItem>

        <AnimatedItem>
          <SpendingChart data={analytics?.byCategory ?? []} />
        </AnimatedItem>
      </AnimatedContainer>
    </PageTransition>
  );
}
