"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function WorkoutCalendar() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const workouts = useQuery(
    api.workouts.getWorkouts,
    userId ? { userId, month, year } : "skip",
  );

  const toggleWorkout = useMutation(api.workouts.toggleWorkout);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const isCompleted = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return workouts?.some((w) => w.date === dateStr && w.completed) ?? false;
  };

  const handleDayClick = async (day: number) => {
    if (!userId) return;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const completed = isCompleted(day);
    await toggleWorkout({ userId, date: dateStr, completed: !completed });
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear();

  const isFuture = (day: number) => {
    const checkDate = new Date(year, month - 1, day);
    return checkDate > today;
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {MONTHS[month - 1]} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const completed = isCompleted(day);
          const future = isFuture(day);

          return (
            <Button
              key={day}
              variant="ghost"
              size="icon"
              onClick={() => !future && handleDayClick(day)}
              disabled={future}
              className={cn(
                "aspect-square h-auto w-auto rounded-md flex items-center justify-center text-sm relative transition-colors",
                isToday(day) && "ring-2 ring-primary",
                completed && "bg-green-500 text-white hover:bg-green-600",
                future && "text-muted-foreground/50 cursor-not-allowed",
              )}
            >
              {day}
              {completed && (
                <Check className="h-3 w-3 absolute bottom-0.5 right-0.5" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
