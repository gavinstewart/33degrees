import { parseLocalDate } from "@/lib/format";
import type { Show } from "@/lib/types";

export interface CalendarEvent {
  title: string;
  location: string;
  description: string;
  start: Date;
  end: Date; // exclusive — the day after `start` for a single-day, all-day event
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toDateStamp(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

function toISODateOnly(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function showToCalendarEvent(show: Show, bandName: string): CalendarEvent {
  const start = parseLocalDate(show.show_date);
  return {
    title: `${bandName} playing at ${show.title || show.venue}`,
    location: `${show.venue}, ${show.city}`,
    description: show.notes || "",
    start,
    end: addDays(start, 1),
  };
}

export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toDateStamp(event.start)}/${toDateStamp(event.end)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: toISODateOnly(event.start),
    enddt: toISODateOnly(event.end),
    allday: "true",
    location: event.location,
    body: event.description,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function buildICSContent(event: CalendarEvent, uid: string): string {
  const now = new Date();
  const dtstamp = `${toDateStamp(now)}T${pad(now.getUTCHours())}${pad(
    now.getUTCMinutes()
  )}${pad(now.getUTCSeconds())}Z`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Thirty Three Degrees//Shows//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${toDateStamp(event.start)}`,
    `DTEND;VALUE=DATE:${toDateStamp(event.end)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `LOCATION:${escapeICSText(event.location)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}
