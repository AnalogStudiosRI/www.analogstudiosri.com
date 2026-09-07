import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const artists = [
  { id: 1, name: "First Artist" },
  { id: 2, name: "Second Artist" },
];
const getArtistsMock = mock.fn(async () => artists);
const getArtistByIdMock = mock.fn(async (id: number) => artists.find((artist) => artist.id === id));

mock.module("#services/artists.ts", {
  namedExports: {
    getArtists: getArtistsMock,
    getArtistById: getArtistByIdMock,
  },
});

// Install the ESM mock before loading the module under test.
const { handler } = await import("#pages/api/artists.ts");

describe("Artists API", () => {
  beforeEach(() => {
    getArtistsMock.mock.resetCalls();
    getArtistByIdMock.mock.resetCalls();
  });

  it("should return all artists", async () => {
    const response = await handler(new Request("http://localhost:8080/api/artists"));

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(await response.json(), artists);
    assert.strictEqual(response.headers.get("cache-control"), "max-age=604800");
    assert.strictEqual(response.headers.get("content-type"), "application/json");
    assert.strictEqual(response.headers.get("access-control-allow-origin"), "*");
    assert.strictEqual(getArtistsMock.mock.callCount(), 1);
    assert.strictEqual(getArtistByIdMock.mock.callCount(), 0);
  });

  it("should return an artist by id", async () => {
    const id = 2;
    const matchingArtist = artists.find((artist) => artist.id === id);
    const response = await handler(new Request(`http://localhost:8080/api/artists?id=${id}`));

    assert.deepStrictEqual(await response.json(), matchingArtist);
    assert.deepStrictEqual(getArtistByIdMock.mock.calls[0].arguments, [id]);
    assert.strictEqual(getArtistsMock.mock.callCount(), 0);
  });
});
