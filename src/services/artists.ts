import { createClient } from "@libsql/client/web";

export interface Artist {
  id: number;
  name: string;
  bio: string;
  imageUrl: string;
  isActive: string;
  genre?: string;
  location?: string;
  label?: string;
  contactPhone?: string;
  contactEmail?: string;
}

const client = createClient({
  url: process.env.DATABASE_URL ?? "",
  authToken: process.env.DATABASE_TOKEN,
});

function mapRowToArtist(row: Record<string, unknown>): Artist {
  return {
    id: Number(row.id),
    name: String(row.name),
    bio: String(row.bio),
    imageUrl: String(row.imageUrl),
    isActive: String(row.isActive),
    ...(typeof row.genre === "string" ? { genre: row.genre } : {}),
    ...(typeof row.location === "string" ? { location: row.location } : {}),
    ...(typeof row.label === "string" ? { label: row.label } : {}),
    ...(typeof row.contactPhone === "string" ? { contactPhone: row.contactPhone } : {}),
    ...(typeof row.contactEmail === "string" ? { contactEmail: row.contactEmail } : {}),
  };
}

// ensure only active artists are shown on the front end
function isActive(artist: Artist): boolean {
  return parseInt(artist.isActive, 10) === 1;
}

async function getArtists(): Promise<Artist[]> {
  const { rows } = await client.execute("SELECT * FROM artists");
  return rows.map(mapRowToArtist).filter(isActive);
}

async function getArtistById(id: number): Promise<Artist> {
  const { rows } = await client.execute({
    sql: "SELECT * FROM artists WHERE id = ?",
    args: [id],
  });

  return mapRowToArtist(rows[0]);
}

export { getArtists, getArtistById };
