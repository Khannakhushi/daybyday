"use client";

import { WorkoutCalendar } from "@/components/gym/workout-calendar";
import { StreakCounter } from "@/components/gym/streak-counter";
import {
  PageTransition,
  FadeText,
  AnimatedContainer,
  AnimatedItem,
} from "@/components/motion";

export default function GymPage() {
  return (
    <PageTransition className="space-y-6">
      <FadeText delay={0.1}>
        <h1 className="text-3xl font-bold">Gym Progress</h1>
        <p className="text-muted-foreground">Track your daily workouts</p>
      </FadeText>

      <AnimatedContainer
        className="grid gap-6 lg:grid-cols-[1fr_300px]"
        delay={0.2}
        staggerDelay={0.15}
      >
        <AnimatedItem>
          <WorkoutCalendar />
        </AnimatedItem>
        <AnimatedItem>
          <StreakCounter />
        </AnimatedItem>
      </AnimatedContainer>
    </PageTransition>
  );
}
