"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // 👈 关键
import { v4 as uuid } from "uuid"; // 生成唯一 id
import { EventInput } from "@fullcalendar/core/index.js";

export default function CalendarPage() {
  // 事件状态
  const [events, setEvents] = useState<EventInput[]>([
    { id: "1", title: "既有事件", start: "2025-07-24" },
  ]);

  // 单击日期格子：创建一天事件
  const handleDateClick = (info: EventInput) => {
    const title = prompt("事件标题？");
    if (!title) {
      info.view.calendar.unselect(); // 👈 立即清除当前选区
      return;
    }
    setEvents((prev) => [
      ...prev,
      { id: uuid(), title, start: info.dateStr, allDay: true },
    ]);
    info.view.calendar.unselect();
  };

  // 拖拽选择：创建区间事件
  const handleSelect = (info: EventInput) => {
    const title = prompt("事件标题？");
    if (!title) return;
    setEvents((prev) => [
      ...prev,
      {
        id: uuid(),
        title,
        start: info.startStr,
        end: info.endStr, // FullCalendar 区间结束是“开区间”﹣自动减 1ms
        allDay: info.allDay,
      },
    ]);
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        events={events}
        dateClick={handleDateClick} // 单击空白
        selectable // 启用拉选
        select={handleSelect} // 选择完成回调
        editable // 允许拖动事件
      />
    </div>
  );
}
