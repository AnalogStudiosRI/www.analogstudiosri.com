import { getAlbums, getAlbumById, getAlbumsByArtistId } from "#services/albums.ts";

export async function handler(request: Request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
  const albumId = params.has("id") ? params.get("id") : null;
  const artistId = params.has("artistId") ? params.get("artistId") : null;
  const albums = albumId
    ? await getAlbumById(parseInt(albumId, 10))
    : artistId
      ? await getAlbumsByArtistId(parseInt(artistId, 10))
      : await getAlbums();

  return new Response(JSON.stringify(albums), {
    headers: new Headers({
      "Cache-Control": "max-age=604800",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
  });
}
