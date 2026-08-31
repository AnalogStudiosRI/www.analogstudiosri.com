import { getArtists, getArtistById } from "#services/artists.ts";

export async function handler(request: Request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
  const artistId = params.has("id") ? params.get("id") : null;
  const artists = artistId ? await getArtistById(parseInt(artistId, 10)) : await getArtists();

  return new Response(JSON.stringify(artists), {
    headers: new Headers({
      "Cache-Control": "max-age=604800",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
  });
}
