/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import { EventDialog } from "@/components/Calendar/EventDialog";

export default function CalendarPage() {
  const [events, setEvents] = useState<EventInput[]>([]);

  // dialog control
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDraft, setDialogDraft] = useState<{
    range: { start: Date; end: Date; allDay: boolean } | null;
    title?: string;
    rrule?: any;
    id?: string;
    groupId?: string;
  }>({
    range: null,
  });

  /* ---------- open dialog helpers ---------- */
  const openNewDialog = (range: {
    start: Date;
    end: Date;
    allDay: boolean;
  }) => {
    setDialogDraft({ range });
    setDialogOpen(true);
  };

  const openEditDialog = (info: EventClickArg) => {
    // 1) The clicked occurrence:
    const inst = info.event;
    // 2) The underlying “definition” object that owns the RRULE:
    const def = inst._def; // FullCalendar internal
    const rrule = (def as any).recurringDef?.typeData?.rrule ?? null;

    setDialogDraft({
      range: {
        start: inst.start!,
        end: inst.end ?? inst.start!,
        allDay: inst.allDay,
      },
      title: inst.title,
      rrule, // will be null for one-off events
      id: def.publicId || inst.id, // stable id
      groupId: inst.groupId || undefined,
    });
    setDialogOpen(true);
  };

  /* ---------- Calendar callbacks ---------- */
  const handleDateClick = (info: DateClickArg) =>
    openNewDialog({ start: info.date, end: info.date, allDay: true });

  const handleSelect = (info: DateSelectArg) => {
    openNewDialog({ start: info.start, end: info.end, allDay: info.allDay });
    info.view.calendar.unselect();
  };

  const handleEventDrop = (info: EventDropArg) => {
    const { groupId } = info.event;
    const deltaMs = info.delta.milliseconds;
    setEvents((prev) =>
      prev.map((ev) =>
        groupId
          ? ev.groupId === groupId
            ? shiftEvent(ev, deltaMs)
            : ev
          : ev.id === info.event.id
          ? { ...ev, start: info.event.start!, end: info.event.end! }
          : ev
      )
    );
  };

  const shiftEvent = (ev: EventInput, deltaMs: number): EventInput => {
    const r = (ev as any).rrule;
    if (r?.dtstart) {
      const newStart = new Date(new Date(r.dtstart).getTime() + deltaMs);
      return { ...ev, rrule: { ...r, dtstart: newStart.toISOString() } };
    }
    // non-recurring fallback
    // return {
    //   ...ev,
    //   start: new Date(ev.start!.getTime() + deltaMs),
    //   end:   ev.end ? new Date(ev.end.getTime() + deltaMs) : undefined,
    // }

    return ev;
  };

  /* ---------- save from dialog ---------- */
  const handleSave = (payload: EventInput) => {
    if (dialogDraft.id) {
      // editing: replace by id or groupId
      setEvents((prev) =>
        prev.map((ev) =>
          dialogDraft.groupId
            ? ev.groupId === dialogDraft.groupId
              ? { ...ev, ...payload }
              : ev
            : ev.id === dialogDraft.id
            ? { ...ev, ...payload }
            : ev
        )
      );
    } else {
      setEvents((prev) => [...prev, payload]);
    }
  };

  return (
    <>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          rrulePlugin,
        ]}
        initialView="dayGridMonth"
        selectable
        editable
        events={events}
        dateClick={handleDateClick}
        select={handleSelect}
        eventClick={openEditDialog}
        eventDrop={handleEventDrop}
        height="auto"
      />

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        draft={dialogDraft.range}
        initialTitle={dialogDraft.title}
        initialRRule={dialogDraft.rrule}
        onSave={handleSave}
      />
    </>
  );
}
