import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const albums = [
  { id: 1, artistId: 10, title: "First Album" },
  { id: 2, artistId: 20, title: "Second Album" },
];
const getAlbumsMock = mock.fn(async () => albums);
const getAlbumByIdMock = mock.fn(async (id: number) => albums.find((album) => album.id === id));
const getAlbumsByArtistIdMock = mock.fn(async (artistId: number) =>
  albums.filter((album) => album.artistId === artistId),
);

mock.module("#services/albums.ts", {
  namedExports: {
    getAlbums: getAlbumsMock,
    getAlbumById: getAlbumByIdMock,
    getAlbumsByArtistId: getAlbumsByArtistIdMock,
  },
});

// Install the ESM mock before loading the module under test.
const { handler } = await import("#pages/api/albums.ts");

describe("Albums API", () => {
  beforeEach(() => {
    getAlbumsMock.mock.resetCalls();
    getAlbumByIdMock.mock.resetCalls();
    getAlbumsByArtistIdMock.mock.resetCalls();
  });

  it("should return all albums", async () => {
    const response = await handler(new Request("http://localhost:8080/api/albums"));

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(await response.json(), albums);
    assert.strictEqual(response.headers.get("cache-control"), "max-age=604800");
    assert.strictEqual(response.headers.get("content-type"), "application/json");
    assert.strictEqual(response.headers.get("access-control-allow-origin"), "*");
    assert.strictEqual(getAlbumsMock.mock.callCount(), 1);
    assert.strictEqual(getAlbumByIdMock.mock.callCount(), 0);
    assert.strictEqual(getAlbumsByArtistIdMock.mock.callCount(), 0);
  });

  it("should return an album by id", async () => {
    const id = 2;
    const matchingAlbum = albums.find((album) => album.id === id);
    const response = await handler(new Request(`http://localhost:8080/api/albums?id=${id}`));

    assert.deepStrictEqual(await response.json(), matchingAlbum);
    assert.deepStrictEqual(getAlbumByIdMock.mock.calls[0].arguments, [id]);
    assert.strictEqual(getAlbumsMock.mock.callCount(), 0);
    assert.strictEqual(getAlbumsByArtistIdMock.mock.callCount(), 0);
  });

  it("should return albums by artist id", async () => {
    const artistId = 20;
    const matchingAlbums = albums.filter((album) => album.artistId === artistId);
    const response = await handler(
      new Request(`http://localhost:8080/api/albums?artistId=${artistId}`),
    );

    assert.deepStrictEqual(await response.json(), matchingAlbums);
    assert.deepStrictEqual(getAlbumsByArtistIdMock.mock.calls[0].arguments, [artistId]);
    assert.strictEqual(getAlbumsMock.mock.callCount(), 0);
    assert.strictEqual(getAlbumByIdMock.mock.callCount(), 0);
  });
});
