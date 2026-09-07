import assert from "node:assert";
import { describe, it } from "node:test";
import { escapeHtmlAttribute, formatDateTime, slugifyer } from "#services/util.ts";

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
      const timestamp = Date.UTC(2026, 8, 7, 13, 5) / 1000;

      assert.strictEqual(formatDateTime(timestamp), "MONDAY, SEPTEMBER 7, 2026, 9:05 AM");
    });

    it("should use the New York date when UTC has crossed into the next day", () => {
      const timestamp = Date.UTC(2026, 0, 1, 2, 30) / 1000;

      assert.strictEqual(formatDateTime(timestamp), "WEDNESDAY, DECEMBER 31, 2025, 9:30 PM");
    });

    it("should account for the start of daylight saving time", () => {
      const beforeTransition = Date.UTC(2026, 2, 8, 6, 59) / 1000;
      const afterTransition = Date.UTC(2026, 2, 8, 7) / 1000;

      assert.strictEqual(formatDateTime(beforeTransition), "SUNDAY, MARCH 8, 2026, 1:59 AM");
      assert.strictEqual(formatDateTime(afterTransition), "SUNDAY, MARCH 8, 2026, 3:00 AM");
    });

    it("should account for the end of daylight saving time", () => {
      const beforeTransition = Date.UTC(2026, 10, 1, 5, 59) / 1000;
      const afterTransition = Date.UTC(2026, 10, 1, 6) / 1000;

      assert.strictEqual(formatDateTime(beforeTransition), "SUNDAY, NOVEMBER 1, 2026, 1:59 AM");
      assert.strictEqual(formatDateTime(afterTransition), "SUNDAY, NOVEMBER 1, 2026, 1:00 AM");
    });
  });
});
