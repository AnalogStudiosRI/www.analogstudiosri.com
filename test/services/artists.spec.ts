import assert from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const rows = [
  {
    id: 1,
    name: "First Artist",
    bio: "The first artist",
    imageUrl: "https://example.com/first.jpg",
    isActive: 1,
    genre: "Rock",
    location: "Providence, RI",
    label: null,
    contactPhone: null,
    contactEmail: "first@example.com",
  },
  {
    id: 2,
    name: "Second Artist",
    bio: "The second artist",
    imageUrl: "https://example.com/second.jpg",
    isActive: 0,
    genre: null,
    location: null,
    label: "Example Records",
    contactPhone: "555-0100",
    contactEmail: null,
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

const { getArtists, getArtistById } = await import("#services/artists.ts");

describe("Artists service", () => {
  beforeEach(() => {
    executeMock.mock.resetCalls();
  });

  it("returns the expected result for getArtists", async () => {
    const artists = await getArtists();

    assert.deepStrictEqual(artists, [
      {
        id: 1,
        name: "First Artist",
        bio: "The first artist",
        imageUrl: "https://example.com/first.jpg",
        isActive: "1",
        genre: "Rock",
        location: "Providence, RI",
        contactEmail: "first@example.com",
      },
    ]);
  });

  it("returns the expected result for getArtistsById", async () => {
    const id = 2;
    const matchingRow = rows.find((row) => row.id === id);
    assert.ok(matchingRow);
    executeMock.mock.mockImplementationOnce(async () => ({ rows: [matchingRow] }));

    const artist = await getArtistById(id);

    assert.deepStrictEqual(artist, {
      id: 2,
      name: "Second Artist",
      bio: "The second artist",
      imageUrl: "https://example.com/second.jpg",
      isActive: "0",
      label: "Example Records",
      contactPhone: "555-0100",
    });
  });
});
