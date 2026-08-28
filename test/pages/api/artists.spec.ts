import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const rows = [
  { id: 1, name: "First Artist" },
  { id: 2, name: "Second Artist" },
];
const executeMock = mock.fn(async (statement: unknown) => {
  void statement;
  return { rows };
});
const createClientMock = mock.fn((config: unknown) => {
  void config;
  return { execute: executeMock };
});

mock.module("@libsql/client/web", {
  namedExports: {
    createClient: createClientMock,
  },
});

// Install the ESM mock before loading the module under test.
const { handler } = await import("#pages/api/artists.ts");

describe("Artists API", () => {
  beforeEach(() => {
    executeMock.mock.resetCalls();
    createClientMock.mock.resetCalls();
  });

  it("should return all artists", async () => {
    const response = await handler(new Request("http://localhost:8080/api/artists"));

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(await response.json(), rows);
    assert.strictEqual(response.headers.get("cache-control"), "max-age=604800");
    assert.strictEqual(response.headers.get("content-type"), "application/json");
    assert.strictEqual(response.headers.get("access-control-allow-origin"), "*");
    assert.strictEqual(createClientMock.mock.callCount(), 1);
    assert.strictEqual(executeMock.mock.callCount(), 1);
  });

  it("should return an artist by id", async () => {
    const id = 2;
    const matchingRows = rows.filter((row) => row.id === id);
    executeMock.mock.mockImplementationOnce(async (statement: unknown) => {
      void statement;
      return { rows: matchingRows };
    });
    const response = await handler(new Request(`http://localhost:8080/api/artists?id=${id}`));

    assert.deepStrictEqual(await response.json(), matchingRows);
    assert.strictEqual(createClientMock.mock.callCount(), 1);
    assert.strictEqual(executeMock.mock.callCount(), 1);
  });
});
