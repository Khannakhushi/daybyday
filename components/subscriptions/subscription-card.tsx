"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

type BillingCycle = "monthly" | "yearly" | "weekly";

const CATEGORIES = [
  "Streaming",
  "Software",
  "Fitness",
  "News & Media",
  "Cloud Storage",
  "Music",
  "Gaming",
  "Productivity",
  "Education",
  "Other",
];

interface Subscription {
  _id: Id<"subscriptions">;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  category: string;
  nextBillingDate: string;
  isActive: boolean;
  url?: string;
  notes?: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
}

const cycleLabels: Record<BillingCycle, string> = {
  weekly: "/week",
  monthly: "/mo",
  yearly: "/year",
};

function EditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
}: {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const update = useMutation(api.subscriptions.update);

  const [name, setName] = useState(subscription.name);
  const [amount, setAmount] = useState((subscription.amount / 100).toFixed(2));
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.billingCycle);
  const [category, setCategory] = useState(subscription.category);
  const [nextBillingDate, setNextBillingDate] = useState(subscription.nextBillingDate);
  const [url, setUrl] = useState(subscription.url ?? "");
  const [notes, setNotes] = useState(subscription.notes ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !nextBillingDate) return;

    const amountInCents = Math.round(parseFloat(amount) * 100);

    await update({
      id: subscription._id,
      name,
      amount: amountInCents,
      billingCycle,
      category,
      nextBillingDate,
      url: url || undefined,
      notes: notes || undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle">Billing Cycle</Label>
              <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as BillingCycle)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextBilling">Next Billing *</Label>
              <Input
                id="nextBilling"
                type="date"
                value={nextBillingDate}
                onChange={(e) => setNextBillingDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const toggleActive = useMutation(api.subscriptions.toggleActive);
  const remove = useMutation(api.subscriptions.remove);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      await remove({ id: subscription._id });
    }
  };

  const displayAmount = (subscription.amount / 100).toFixed(2);

  return (
    <>
      <Card className={!subscription.isActive ? "opacity-60" : ""}>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-base">{subscription.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {subscription.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={subscription.isActive}
              onCheckedChange={() => toggleActive({ id: subscription._id })}
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">
            ${displayAmount}
            <span className="text-sm font-normal text-muted-foreground">
              {cycleLabels[subscription.billingCycle]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Next billing: {format(new Date(subscription.nextBillingDate), "MMM d, yyyy")}
          </p>
          {subscription.url && (
            <a
              href={subscription.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Visit site
            </a>
          )}
        </CardContent>
      </Card>

      <EditSubscriptionDialog
        subscription={subscription}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
