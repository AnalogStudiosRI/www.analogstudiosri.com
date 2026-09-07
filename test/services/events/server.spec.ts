import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const entries = [
  {
    sys: { createdAt: "2026-08-01T12:00:00Z" },
    fields: {
      id: 1,
      description: { value: "First description" },
      startTime: "2026-09-01T19:00:00-04:00",
      endTime: "2026-09-01T22:00:00-04:00",
      title: "First Event",
      link: "https://example.com/first",
    },
    metadata: { tags: [{ sys: { id: "concert" } }] },
  },
  {
    sys: { createdAt: "2026-08-02T12:00:00Z" },
    fields: {
      id: 2,
      description: { value: "Second description" },
      startTime: "2026-10-02T18:30:00-04:00",
      endTime: "2026-10-02T20:00:00-04:00",
      title: "Second Event",
      link: "https://example.com/second",
    },
    metadata: { tags: [{ sys: { id: "concert" } }, { sys: { id: "workshop" } }] },
  },
];

const events = [
  {
    id: 1,
    title: "First Event",
    description: "<p>First description</p>",
    startTime: new Date("2026-09-01T19:00:00-04:00").getTime() / 1000,
    endTime: new Date("2026-09-01T22:00:00-04:00").getTime() / 1000,
    createdTime: "2026-08-01T12:00:00Z",
    link: "https://example.com/first",
    tags: ["concert"],
  },
  {
    id: 2,
    title: "Second Event",
    description: "<p>Second description</p>",
    startTime: new Date("2026-10-02T18:30:00-04:00").getTime() / 1000,
    endTime: new Date("2026-10-02T20:00:00-04:00").getTime() / 1000,
    createdTime: "2026-08-02T12:00:00Z",
    link: "https://example.com/second",
    tags: ["concert", "workshop"],
  },
];

const getEntriesMock = mock.fn(async () => ({ items: entries }));
const createClientMock = mock.fn(() => ({ getEntries: getEntriesMock }));
const renderMock = mock.fn((description: unknown) => {
  const { value } = description as { value: string };
  return `<p>${value}</p>`;
});

mock.module("contentful", {
  namedExports: {
    createClient: createClientMock,
  },
});

mock.module("@contentful/rich-text-html-renderer", {
  namedExports: {
    documentToHtmlString: renderMock,
  },
});

const { getEvents, getEventById, getEventsByTag } = await import("#services/events/server.ts");

describe("Events server service", () => {
  beforeEach(() => {
    getEntriesMock.mock.resetCalls();
    renderMock.mock.resetCalls();
  });

  it("it should return the expected results from getEvents", async () => {
    const result = await getEvents();

    assert.deepStrictEqual(result, events);
  });

  it("it should return the expected results from getEventById", async () => {
    const matchingEvent = events.find((event) => event.id === 2);
    assert.ok(matchingEvent);

    const result = await getEventById(2);

    assert.deepStrictEqual(result, matchingEvent);
  });

  it("it should return the expected results from getEventsByTag", async () => {
    const matchingEvents = events.filter((event) => event.tags.includes("workshop"));

    const result = await getEventsByTag("workshop");

    assert.deepStrictEqual(result, matchingEvents);
  });
});
