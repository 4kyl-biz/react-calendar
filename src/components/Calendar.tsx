"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // drag & drop / select
import { DateSelectArg, EventDropArg, EventInput } from "@fullcalendar/core";
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

export default function CalendarPage() {
  /* calendar data */
  const [events, setEvents] = useState<EventInput[]>([]);

  /* dialog + form state */
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [draft, setDraft] = useState<{
    start: Date;
    end: Date;
    allDay: boolean;
  } | null>(null);

  /* single-click empty cell → create all-day draft */
  const handleDateClick = (info: DateClickArg) => {
    setDraft({ start: info.date, end: info.date, allDay: true });
    setOpen(true);
  };

  /* drag-select range → create draft */
  const handleSelect = (info: DateSelectArg) => {
    setDraft({ start: info.start, end: info.end, allDay: info.allDay });
    info.view.calendar.unselect(); // clear highlight
    setOpen(true);
  };

  /* Save dialog → create event */
  const saveEvent = () => {
    if (!draft || !title.trim()) return;
    setEvents((prev) => [
      ...prev,
      { id: uuid(), title: title.trim(), ...draft },
    ]);
    resetForm();
  };

  /* drag existing event to new date/time */
  const handleEventDrop = (info: EventDropArg) => {
    const { id, start, end, allDay } = info.event;

    setEvents((prev) => {
      const updatedEvents = prev.map((ev) => {
        if (ev.id === id && start && end) {
          return { ...ev, start, end, allDay };
        }
        return ev;
      });
      return updatedEvents;
    });
  };

  const resetForm = () => {
    setTitle("");
    setDraft(null);
    setOpen(false);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // ① default month grid
        selectable
        editable // ② enable drag & drop
        events={events}
        dateClick={handleDateClick}
        select={handleSelect}
        eventDrop={handleEventDrop} // updates state after drag
        height="auto"
      />

      {/* Dialog for new event */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>

          {/* ③ form captures Enter to submit */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEvent();
            }}
            className="space-y-4"
          >
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />

            {draft && (
              <p className="text-sm text-muted-foreground">
                {draft.allDay
                  ? draft.start.toLocaleDateString()
                  : `${draft.start.toLocaleString()} – ${draft.end.toLocaleString()}`}
              </p>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Save</Button> {/* hitting Enter triggers */}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
