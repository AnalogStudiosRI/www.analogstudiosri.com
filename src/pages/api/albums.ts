import { createClient } from "@libsql/client/web";

export async function handler(request: Request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
  const id = params.has("id") ? params.get("id") : null;
  const artistId = params.has("artistId") ? params.get("artistId") : null;
  const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_TOKEN,
  });
  const { rows } = id
    ? await client.execute({ sql: "SELECT * FROM albums WHERE id = ?", args: [id] })
    : artistId
      ? await client.execute({ sql: "SELECT * FROM albums WHERE artistId = ?", args: [artistId] })
      : await client.execute("SELECT * FROM albums");

  return new Response(JSON.stringify(rows), {
    headers: new Headers({
      "Cache-Control": "max-age=604800",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
  });
}
