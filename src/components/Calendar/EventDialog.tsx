/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type Recurrence = "none" | "daily" | "weekly" | "monthly";

export interface DraftRange {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface EventDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  draft: DraftRange | null; // date range selected in calendar
  initialTitle?: string;
  initialRRule?: any; // existing rrule if we’re editing
  onSave: (payload: {
    id?: string;
    groupId?: string;
    title: string;
    rrule?: any;
    duration?: number;
    start?: Date;
    end?: Date;
    allDay: boolean;
  }) => void;
}

const weekDayItems = [
  { value: "mo", label: "Mon" },
  { value: "tu", label: "Tue" },
  { value: "we", label: "Wed" },
  { value: "th", label: "Thu" },
  { value: "fr", label: "Fri" },
  { value: "sa", label: "Sat" },
  { value: "su", label: "Sun" },
];

export function EventDialog({
  open,
  onOpenChange,
  draft,
  initialTitle = "",
  initialRRule,
  onSave,
}: EventDialogProps) {
  /* local form state */
  const [title, setTitle] = useState(initialTitle);
  const [repeat, setRepeat] = useState<Recurrence>("none");
  const [interval, setInterval] = useState(1);
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [until, setUntil] = useState<Date | null>(null);

  /* load existing rrule when dialog opens in edit mode */
  useEffect(() => {
    if (open && initialRRule) {
      setRepeat(initialRRule.freq ?? "none");
      setInterval(initialRRule.interval ?? 1);
      setWeekdays(initialRRule.byweekday ?? []);
      setUntil(initialRRule.until ? new Date(initialRRule.until) : null);
    } else if (open) {
      // new event -> reset
      setRepeat("none");
      setInterval(1);
      setWeekdays([]);
      setUntil(null);
      setTitle(initialTitle ?? "");
    }
  }, [open, initialRRule, initialTitle]);

  /* construct payload and bubble up */
  const handleSubmit = () => {
    if (!draft || !title.trim()) return;

    const base = {
      id: uuid(),
      title: title.trim(),
      allDay: draft.allDay,
    };

    if (repeat === "none") {
      onSave({ ...base, start: draft.start, end: draft.end });
    } else {
      const rrule: any = {
        freq: repeat,
        interval,
        dtstart: draft.start.toISOString(),
      };
      if (repeat === "weekly" && weekdays.length) rrule.byweekday = weekdays;
      if (until) rrule.until = until.toISOString();

      const duration = draft.allDay
        ? undefined
        : Math.abs(draft.end.getTime() - draft.start.getTime());

      onSave({ ...base, rrule, duration });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialRRule ? "Edit event" : "Add event"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          {/* recurrence */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Repeat</label>
            <Select
              value={repeat}
              onValueChange={(v) => setRepeat(v as Recurrence)}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            {repeat !== "none" && (
              <div className="flex items-center gap-2">
                every
                <Input
                  type="number"
                  min={1}
                  className="w-16"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                />
                {repeat === "daily"
                  ? "day(s)"
                  : repeat === "weekly"
                  ? "week(s)"
                  : "month(s)"}
              </div>
            )}

            {repeat === "weekly" && (
              <div className="flex flex-wrap gap-2">
                {weekDayItems.map((w) => (
                  <label
                    key={w.value}
                    className="flex items-center gap-1 text-sm"
                  >
                    <Checkbox
                      checked={weekdays.includes(w.value)}
                      onCheckedChange={(c) =>
                        setWeekdays((prev) =>
                          c
                            ? [...prev, w.value]
                            : prev.filter((v) => v !== w.value)
                        )
                      }
                    />
                    {w.label}
                  </label>
                ))}
              </div>
            )}

            {repeat !== "none" && (
              <div className="flex items-center gap-2">
                <label className="text-sm">Until</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm"
                  value={until ? until.toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    setUntil(e.target.value ? new Date(e.target.value) : null)
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
