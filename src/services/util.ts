import { Temporal } from "temporal-polyfill";

const TIME_ZONE = "America/New_York";

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

export { slugifyer, escapeHtmlAttribute, formatDateTime };
