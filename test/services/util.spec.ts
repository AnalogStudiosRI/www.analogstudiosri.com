import assert from "node:assert";
import { describe, it } from "node:test";
import { Temporal } from "temporal-polyfill";
import { escapeHtmlAttribute, formatDateTime, slugifyer } from "#services/util.ts";

const epochSeconds = (instant: string): number =>
  Temporal.Instant.from(instant).epochMilliseconds / 1000;

describe("Util service", () => {
  describe("slugifyer", () => {
    it("should slugify an artist name", () => {
      assert.strictEqual(slugifyer("Metal Wings"), "metal-wings");
    });

    it("should slugify an album name with colons", () => {
      assert.strictEqual(slugifyer("BI Music Fest : Porch Gigs"), "bi-music-fest--porch-gigs");
    });

    it("should slugify an album name with parenthesis and hyphens", () => {
      assert.strictEqual(
        slugifyer("Live - From The Basement (Set 1)"),
        "live---from-the-basement-set-1",
      );
    });

    it("should slugify an event title", () => {
      assert.strictEqual(slugifyer("BLISS RI 2026 (DAY 1)"), "bliss-ri-2026-day-1");
    });
  });

  describe("escapeHtmlAttribute", () => {
    it("should escape special characters in an HTML attribute", () => {
      assert.strictEqual(
        escapeHtmlAttribute(`Analog & "Studios" <'Rhode Island'>`),
        "Analog &amp; &quot;Studios&quot; &lt;&#39;Rhode Island&#39;&gt;",
      );
    });
  });

  describe("formatDateTime", () => {
    it("should return an empty string when the timestamp is undefined", () => {
      assert.strictEqual(formatDateTime(undefined), "");
    });

    it("should format a timestamp in seconds using the New York time zone", () => {
      const timestamp = epochSeconds("2026-09-07T13:05:00Z");

      assert.strictEqual(formatDateTime(timestamp), "MONDAY, SEPTEMBER 7, 2026, 9:05 AM");
    });

    it("should use the New York date when UTC has crossed into the next day", () => {
      const timestamp = epochSeconds("2026-01-01T02:30:00Z");

      assert.strictEqual(formatDateTime(timestamp), "WEDNESDAY, DECEMBER 31, 2025, 9:30 PM");
    });

    it("should account for the start of daylight saving time", () => {
      const beforeTransition = epochSeconds("2026-03-08T06:59:00Z");
      const afterTransition = epochSeconds("2026-03-08T07:00:00Z");

      assert.strictEqual(formatDateTime(beforeTransition), "SUNDAY, MARCH 8, 2026, 1:59 AM");
      assert.strictEqual(formatDateTime(afterTransition), "SUNDAY, MARCH 8, 2026, 3:00 AM");
    });

    it("should account for the end of daylight saving time", () => {
      const beforeTransition = epochSeconds("2026-11-01T05:59:00Z");
      const afterTransition = epochSeconds("2026-11-01T06:00:00Z");

      assert.strictEqual(formatDateTime(beforeTransition), "SUNDAY, NOVEMBER 1, 2026, 1:59 AM");
      assert.strictEqual(formatDateTime(afterTransition), "SUNDAY, NOVEMBER 1, 2026, 1:00 AM");
    });
  });
});
