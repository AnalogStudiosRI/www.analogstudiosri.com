import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const events = [
  {
    id: 1,
    title: "First Event",
    description: "First description",
    startTime: 1788303600,
    endTime: 1788314400,
    createdTime: "2026-08-01T12:00:00Z",
    link: "https://example.com/first",
    tags: ["concert"],
  },
  {
    id: 2,
    title: "Second Event",
    description: "Second description",
    startTime: 1790970600,
    endTime: 1790976000,
    createdTime: "2026-08-02T12:00:00Z",
    link: "https://example.com/second",
    tags: ["concert", "workshop"],
  },
];

const fetchMock = mock.fn(async () => new Response(JSON.stringify(events)));

mock.method(globalThis, "fetch", fetchMock);

const { getEvents, getEventById, getEventsByTag } = await import("#services/events/client.ts");

describe("Events client service", () => {
  beforeEach(() => {
    fetchMock.mock.resetCalls();
  });

  it("it should return the expected results from getEvents", async () => {
    const result = await getEvents();

    assert.deepStrictEqual(result, events);
  });

  it("it should return the expected results from getEventById", async () => {
    const matchingEvent = events.find((event) => event.id === 2);
    assert.ok(matchingEvent);
    fetchMock.mock.mockImplementationOnce(
      async () => new Response(JSON.stringify([matchingEvent])),
    );

    const result = await getEventById(2);

    assert.deepStrictEqual(result, matchingEvent);
  });

  it("it should return the expected results from getEventByTag", async () => {
    const matchingEvents = events.filter((event) => event.tags.includes("workshop"));
    fetchMock.mock.mockImplementationOnce(async () => new Response(JSON.stringify(matchingEvents)));

    const result = await getEventsByTag("workshop");

    assert.deepStrictEqual(result, matchingEvents);
  });
});
