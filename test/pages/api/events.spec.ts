import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const firstDescription = { nodeType: "document", value: "First description" };
const secondDescription = { nodeType: "document", value: "Second description" };
const entries = [
  {
    fields: {
      id: 1,
      description: firstDescription,
      startTime: "2026-09-01T19:00:00-04:00",
      endTime: "2026-09-01T22:00:00-04:00",
      title: "First Event",
      link: "https://example.com/first",
    },
    metadata: { tags: [{ sys: { id: "concert" } }] },
  },
  {
    fields: {
      id: 2,
      description: secondDescription,
      startTime: "2026-10-02T18:30:00-04:00",
      endTime: "2026-10-02T20:00:00-04:00",
      title: "Second Event",
      link: "https://example.com/second",
    },
    metadata: { tags: [{ sys: { id: "concert" } }, { sys: { id: "workshop" } }] },
  },
];

const getEntriesMock = mock.fn(async (query: unknown) => {
  void query;
  return { items: entries };
});
const createClientMock = mock.fn((config: unknown) => {
  void config;
  return { getEntries: getEntriesMock };
});
const renderMock = mock.fn((description: unknown, options: unknown) => {
  void options;
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

// Install the ESM mocks before loading the module under test.
const { handler } = await import("#pages/api/events.ts");

const expectedEvents = [
  {
    id: 1,
    description: "<p>First description</p>",
    startTime: new Date("2026-09-01T19:00:00-04:00").getTime() / 1000,
    endTime: new Date("2026-09-01T22:00:00-04:00").getTime() / 1000,
    title: "First Event",
    link: "https://example.com/first",
    tags: ["concert"],
  },
  {
    id: 2,
    description: "<p>Second description</p>",
    startTime: new Date("2026-10-02T18:30:00-04:00").getTime() / 1000,
    endTime: new Date("2026-10-02T20:00:00-04:00").getTime() / 1000,
    title: "Second Event",
    link: "https://example.com/second",
    tags: ["concert", "workshop"],
  },
];

describe("Events API", () => {
  beforeEach(() => {
    getEntriesMock.mock.resetCalls();
    createClientMock.mock.resetCalls();
    renderMock.mock.resetCalls();
  });

  it("should return all mapped events", async () => {
    const response = await handler(new Request("http://localhost:8080/api/events"));

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(await response.json(), expectedEvents);
    assert.strictEqual(response.headers.get("cache-control"), "max-age=604800");
    assert.strictEqual(response.headers.get("content-type"), "application/json");
    assert.strictEqual(response.headers.get("access-control-allow-origin"), "*");
    assert.strictEqual(createClientMock.mock.callCount(), 1);
    assert.strictEqual(getEntriesMock.mock.callCount(), 1);
    assert.strictEqual(renderMock.mock.callCount(), 2);
  });

  it("should render embedded assets as lazy-loaded images", async () => {
    await handler(new Request("http://localhost:8080/api/events"));

    const renderOptions = renderMock.mock.calls[0].arguments[1] as {
      renderNode: Record<
        string,
        (node: { data: { target: { fields: { file: { url: string } } } } }) => string
      >;
    };
    const embeddedAsset = {
      data: { target: { fields: { file: { url: "//images.example.com/event.jpg" } } } },
    };

    assert.strictEqual(
      renderOptions.renderNode["embedded-asset-block"](embeddedAsset),
      '<img src="//images.example.com/event.jpg" loading="lazy"/>',
    );
  });

  it("should return an event by id", async () => {
    const id = 2;
    const matchingEvents = expectedEvents.filter((event) => event.id === id);
    const response = await handler(new Request(`http://localhost:8080/api/events?id=${id}`));

    assert.deepStrictEqual(await response.json(), matchingEvents);
  });

  it("should return an empty array when an id is not found", async () => {
    const id = 999;
    const matchingEvents = expectedEvents.filter((event) => event.id === id);
    const response = await handler(new Request(`http://localhost:8080/api/events?id=${id}`));

    assert.deepStrictEqual(await response.json(), matchingEvents);
  });

  it("should return events matching a tag", async () => {
    const tag = "workshop";
    const matchingEvents = expectedEvents.filter((event) => event.tags.includes(tag));
    const response = await handler(new Request(`http://localhost:8080/api/events?tag=${tag}`));

    assert.deepStrictEqual(await response.json(), matchingEvents);
  });

  it("should prioritize id when id and tag are both provided", async () => {
    const id = 1;
    const tag = "workshop";
    const matchingEvents = expectedEvents.filter((event) => event.id === id);
    const response = await handler(
      new Request(`http://localhost:8080/api/events?id=${id}&tag=${tag}`),
    );

    assert.deepStrictEqual(await response.json(), matchingEvents);
  });
});
