"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

type JobStatus = "not_applied" | "applied" | "interviewing" | "offer" | "rejected";

interface JobFormProps {
  job?: {
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
  onClose?: () => void;
}

export function JobForm({ job, onClose }: JobFormProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const [companyName, setCompanyName] = useState(job?.companyName ?? "");
  const [position, setPosition] = useState(job?.position ?? "");
  const [status, setStatus] = useState<JobStatus>(job?.status ?? "not_applied");
  const [dueDate, setDueDate] = useState(job?.dueDate ?? "");
  const [appliedDate, setAppliedDate] = useState(job?.appliedDate ?? "");
  const [jobPostingUrl, setJobPostingUrl] = useState(job?.jobPostingUrl ?? "");
  const [notes, setNotes] = useState(job?.notes ?? "");
  const [salary, setSalary] = useState(job?.salary ?? "");
  const [location, setLocation] = useState(job?.location ?? "");

  const create = useMutation(api.jobApplications.create);
  const update = useMutation(api.jobApplications.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !companyName || !position) return;

    if (job) {
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
    } else {
      await create({
        userId: user.id,
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
    }

    setOpen(false);
    onClose?.();
    if (!job) {
      setCompanyName("");
      setPosition("");
      setStatus("not_applied");
      setDueDate("");
      setAppliedDate("");
      setJobPostingUrl("");
      setNotes("");
      setSalary("");
      setLocation("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        {job ? "Edit" : "Add Application"}
      </button>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Application" : "Add Application"}</DialogTitle>
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
              <Select value={status} onValueChange={(v) => setStatus(v as JobStatus)}>
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
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appliedDate">Applied Date</Label>
              <Input
                id="appliedDate"
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
              />
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{job ? "Save Changes" : "Add Application"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Separate edit button for use in dropdowns
export function JobEditButton({
  job,
  onEdit
}: {
  job: JobFormProps["job"];
  onEdit: () => void;
}) {
  return (
    <button
      onClick={onEdit}
      className="focus:bg-accent focus:text-accent-foreground gap-2 rounded-sm px-2 py-1.5 text-sm relative flex cursor-default items-center outline-hidden select-none w-full"
    >
      Edit
    </button>
  );
}
