import { WorkoutCalendar } from "@/components/gym/workout-calendar";
import { StreakCounter } from "@/components/gym/streak-counter";

export default function GymPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gym Progress</h1>
        <p className="text-muted-foreground">Track your daily workouts</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <WorkoutCalendar />
        <StreakCounter />
      </div>
    </div>
  );
}
