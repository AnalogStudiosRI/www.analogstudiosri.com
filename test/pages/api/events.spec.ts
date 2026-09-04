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

const getEventsMock = mock.fn(async () => events);
const getEventByIdMock = mock.fn(async (id: number) => events.find((event) => event.id === id));
const getEventsByTagMock = mock.fn(async (tag: string) =>
  events.filter((event) => event.tags.includes(tag)),
);

mock.module("#services/events/server.ts", {
  namedExports: {
    getEvents: getEventsMock,
    getEventById: getEventByIdMock,
    getEventsByTag: getEventsByTagMock,
  },
});

const { handler } = await import("#pages/api/events.ts");

describe("Events API", () => {
  beforeEach(() => {
    getEventsMock.mock.resetCalls();
    getEventByIdMock.mock.resetCalls();
    getEventsByTagMock.mock.resetCalls();
  });

  it("should return all events", async () => {
    const response = await handler(new Request("http://localhost:8080/api/events"));

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(await response.json(), events);
    assert.strictEqual(response.headers.get("cache-control"), "max-age=604800");
    assert.strictEqual(response.headers.get("content-type"), "application/json");
    assert.strictEqual(response.headers.get("access-control-allow-origin"), "*");
    assert.strictEqual(getEventsMock.mock.callCount(), 1);
    assert.strictEqual(getEventByIdMock.mock.callCount(), 0);
    assert.strictEqual(getEventsByTagMock.mock.callCount(), 0);
  });

  it("should return an event by id", async () => {
    const id = 2;
    const matchingEvent = events.find((event) => event.id === id);
    const response = await handler(new Request(`http://localhost:8080/api/events?id=${id}`));

    assert.deepStrictEqual(await response.json(), matchingEvent ? [matchingEvent] : []);
    assert.deepStrictEqual(getEventByIdMock.mock.calls[0].arguments, [id]);
    assert.strictEqual(getEventsMock.mock.callCount(), 0);
    assert.strictEqual(getEventsByTagMock.mock.callCount(), 0);
  });

  it("should return an empty array when an id is not found", async () => {
    const id = 999;
    const response = await handler(new Request(`http://localhost:8080/api/events?id=${id}`));

    assert.deepStrictEqual(await response.json(), []);
  });

  it("should return events matching a tag", async () => {
    const tag = "workshop";
    const matchingEvents = events.filter((event) => event.tags.includes(tag));
    const response = await handler(new Request(`http://localhost:8080/api/events?tag=${tag}`));

    assert.deepStrictEqual(await response.json(), matchingEvents);
    assert.deepStrictEqual(getEventsByTagMock.mock.calls[0].arguments, [tag]);
    assert.strictEqual(getEventsMock.mock.callCount(), 0);
    assert.strictEqual(getEventByIdMock.mock.callCount(), 0);
  });

  it("should prioritize id when id and tag are both provided", async () => {
    const id = 1;
    const tag = "workshop";
    const matchingEvent = events.find((event) => event.id === id);
    const response = await handler(
      new Request(`http://localhost:8080/api/events?id=${id}&tag=${tag}`),
    );

    assert.deepStrictEqual(await response.json(), matchingEvent ? [matchingEvent] : []);
    assert.deepStrictEqual(getEventByIdMock.mock.calls[0].arguments, [id]);
    assert.strictEqual(getEventsByTagMock.mock.callCount(), 0);
  });
});
