"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { StatusBadge } from "./status-badge";
import { JobForm } from "./job-form";
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

type JobStatus =
  | "not_applied"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

type Job = {
  _id: Id<"jobApplications">;
  companyName: string;
  position: string;
  status: JobStatus;
  dueDate?: string;
  appliedDate?: string;
  jobPostingUrl?: string;
  notes?: string;
  salary?: string;
  location?: string;
};

function EditJobDialog({
  job,
  open,
  onOpenChange,
}: {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useUser();
  const update = useMutation(api.jobApplications.update);

  const [companyName, setCompanyName] = useState(job.companyName);
  const [position, setPosition] = useState(job.position);
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [dueDate, setDueDate] = useState(job.dueDate ?? "");
  const [appliedDate, setAppliedDate] = useState(job.appliedDate ?? "");
  const [jobPostingUrl, setJobPostingUrl] = useState(job.jobPostingUrl ?? "");
  const [notes, setNotes] = useState(job.notes ?? "");
  const [salary, setSalary] = useState(job.salary ?? "");
  const [location, setLocation] = useState(job.location ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !companyName || !position) return;

    await update({
      id: job._id,
      companyName,
      position,
      status,
      dueDate: dueDate || undefined,
      appliedDate: appliedDate || undefined,
      jobPostingUrl: jobPostingUrl || undefined,
      notes: notes || undefined,
      salary: salary || undefined,
      location: location || undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as JobStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_applied">Not Applied</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote, NYC, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <DatePicker value={dueDate} onChange={setDueDate} />
            </div>
            <div className="space-y-2">
              <Label>Applied Date</Label>
              <DatePicker value={appliedDate} onChange={setAppliedDate} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="$100k - $150k"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Job Posting URL</Label>
            <Input
              id="url"
              type="url"
              value={jobPostingUrl}
              onChange={(e) => setJobPostingUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function JobList() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const jobs = useQuery(
    api.jobApplications.getAll,
    userId ? { userId } : "skip",
  );
  const removeJob = useMutation(api.jobApplications.remove);

  const filteredJobs = jobs?.filter(
    (job) => statusFilter === "all" || job.status === statusFilter,
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      await removeJob({ id: id as any });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as JobStatus | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not_applied">Not Applied</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredJobs?.length ?? 0} applications
          </span>
        </div>
        <JobForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  No applications yet. Add your first one!
                </TableCell>
              </TableRow>
            )}
            {filteredJobs?.map((job) => (
              <TableRow key={job._id}>
                <TableCell className="font-medium">{job.companyName}</TableCell>
                <TableCell>{job.position}</TableCell>
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>
                <TableCell>
                  {job.dueDate
                    ? format(new Date(job.dueDate), "MMM d, yyyy")
                    : "-"}
                </TableCell>
                <TableCell>{job.location || "-"}</TableCell>
                <TableCell>
                  {job.jobPostingUrl ? (
                    <a
                      href={job.jobPostingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingJob(job)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(job._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingJob && (
        <EditJobDialog
          job={editingJob}
          open={!!editingJob}
          onOpenChange={(open) => !open && setEditingJob(null)}
        />
      )}
    </div>
  );
}
