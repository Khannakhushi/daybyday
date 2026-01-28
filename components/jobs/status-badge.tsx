"use client";

import { Badge } from "@/components/ui/badge";

type JobStatus = "not_applied" | "applied" | "interviewing" | "offer" | "rejected";

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  not_applied: { label: "Not Applied", variant: "secondary" },
  applied: { label: "Applied", variant: "default" },
  interviewing: { label: "Interviewing", variant: "outline" },
  offer: { label: "Offer", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
