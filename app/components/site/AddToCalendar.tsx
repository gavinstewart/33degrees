"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildGoogleCalendarUrl,
  buildICSContent,
  buildOutlookCalendarUrl,
  showToCalendarEvent,
} from "@/lib/calendar";
import type { Show } from "@/lib/types";

export default function AddToCalendar({
  show,
  bandName,
}: {
  show: Show;
  bandName: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const event = showToCalendarEvent(show, bandName);

  function downloadICS() {
    const ics = buildICSContent(event, `show-${show.id}@thirtythreedegreesband`);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title}.ics`.replace(/[^\w.-]+/g, "-");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <div className="add-to-calendar" ref={ref}>
      <button
        type="button"
        className="btn btn--ghost btn--small"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        + Calendar
      </button>
      {open && (
        <div className="add-to-calendar-menu">
          <a
            href={buildGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Google Calendar
          </a>
          <a
            href={buildOutlookCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Outlook
          </a>
          <button type="button" onClick={downloadICS}>
            Apple / Other (.ics)
          </button>
        </div>
      )}
    </div>
  );
}
