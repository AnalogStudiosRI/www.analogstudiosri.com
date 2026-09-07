import assert from "node:assert";
import { describe, it } from "node:test";

import { escapeHtmlAttribute, slugifyer } from "#services/util.ts";

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
});
