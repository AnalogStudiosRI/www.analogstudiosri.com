import { createClient } from "@libsql/client/web";
export interface Album {
  id: number;
  title: string;
  description: string;
  year: string;
  artistId: number;
  imageUrl?: string;
  downloadUrl?: string;
}

const client = createClient({
  url: process.env.DATABASE_URL ?? "",
  authToken: process.env.DATABASE_TOKEN,
});

function toAlbum(row: Record<string, unknown>): Album {
  return {
    id: Number(row.id),
    title: String(row.title),
    description: String(row.description),
    year: String(row.year),
    artistId: Number(row.artistId),
    ...(typeof row.imageUrl === "string" ? { imageUrl: row.imageUrl } : {}),
    ...(typeof row.downloadUrl === "string" ? { downloadUrl: row.downloadUrl } : {}),
  };
}

async function getAlbums(): Promise<Album[]> {
  const { rows } = await client.execute("SELECT * FROM albums");
  return rows.map(toAlbum);
}

async function getAlbumById(id: number): Promise<Album> {
  const { rows } = await client.execute({
    sql: "SELECT * FROM albums WHERE id = ?",
    args: [id],
  });

  return toAlbum(rows[0]);
}

async function getAlbumsByArtistId(id: number): Promise<Album[]> {
  const { rows } = await client.execute({
    sql: "SELECT * FROM albums WHERE artistId = ?",
    args: [id],
  });

  return rows.map(toAlbum);
}

export { getAlbums, getAlbumById, getAlbumsByArtistId };
