import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const rows = [
  {
    id: 1,
    title: "First Album",
    description: "The first album",
    year: "2024",
    artistId: 10,
    imageUrl: "https://example.com/first.jpg",
    downloadUrl: null,
  },
  {
    id: 2,
    title: "Second Album",
    description: "The second album",
    year: "2025",
    artistId: 20,
    imageUrl: null,
    downloadUrl: "https://example.com/second.zip",
  },
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

const { getAlbums, getAlbumById, getAlbumsByArtistId } = await import("#services/albums.ts");

describe("Albums service", () => {
  beforeEach(() => {
    executeMock.mock.resetCalls();
  });

  it("returns the expected result for getAlbums", async () => {
    const albums = await getAlbums();

    assert.deepStrictEqual(albums, [
      {
        id: 1,
        title: "First Album",
        description: "The first album",
        year: "2024",
        artistId: 10,
        imageUrl: "https://example.com/first.jpg",
      },
      {
        id: 2,
        title: "Second Album",
        description: "The second album",
        year: "2025",
        artistId: 20,
        downloadUrl: "https://example.com/second.zip",
      },
    ]);
  });

  it("returns the expected result for getAlbumsById", async () => {
    const id = 2;
    const matchingRow = rows.find((row) => row.id === id);
    assert.ok(matchingRow);
    executeMock.mock.mockImplementationOnce(async () => ({ rows: [matchingRow] }));

    const album = await getAlbumById(id);

    assert.deepStrictEqual(album, {
      id: 2,
      title: "Second Album",
      description: "The second album",
      year: "2025",
      artistId: 20,
      downloadUrl: "https://example.com/second.zip",
    });
  });

  it("returns the expected result for getAlbumsByArtistId", async () => {
    const artistId = 10;
    const matchingRows = rows.filter((row) => row.artistId === artistId);
    executeMock.mock.mockImplementationOnce(async () => ({ rows: matchingRows }));

    const albums = await getAlbumsByArtistId(artistId);

    assert.deepStrictEqual(albums, [
      {
        id: 1,
        title: "First Album",
        description: "The first album",
        year: "2024",
        artistId: 10,
        imageUrl: "https://example.com/first.jpg",
      },
    ]);
  });
});
