import { Temporal } from "temporal-polyfill";

export const TIME_ZONE = "America/New_York" as const;

function slugifyer(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// we have a lot of inconsistent formatting in our API data
// should clean it up, ideally
function escapeHtmlAttribute(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;");
}

function toTimestampInSeconds(dateTime: string): number {
  let instant: Temporal.Instant;

  try {
    instant = Temporal.Instant.from(dateTime);
  } catch {
    // Contentful can return event times without an offset; those are local New York times.
    instant = Temporal.PlainDateTime.from(dateTime).toZonedDateTime(TIME_ZONE).toInstant();
  }

  return instant.epochMilliseconds / 1000;
}

function formatDateTime(timestampInSeconds: number | undefined): string {
  if (timestampInSeconds === undefined) {
    return "";
  }

  const dateTime = Temporal.Instant.fromEpochMilliseconds(
    timestampInSeconds * 1000,
  ).toZonedDateTimeISO(TIME_ZONE);
  const date = dateTime.toPlainDate().toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = dateTime.toPlainTime().toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${date}, ${time}`.toUpperCase();
}

export { slugifyer, escapeHtmlAttribute, toTimestampInSeconds, formatDateTime };
