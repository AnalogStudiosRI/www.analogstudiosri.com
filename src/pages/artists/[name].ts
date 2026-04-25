import { getArtists, getArtistById } from '#services/artists.ts';
import type { Artist } from '#services/artists.ts';

// TODO: types for all this from Greenwood: StaticPaths / Params / SSR page / etc?  can they be inferred?
interface StaticPaths {
  params: {
    name: string;
    id: number;
  }
}

interface StaticParams {
  artist: Artist
}

interface PageProps {
  params: {
    artist: Artist;
  }
}

export async function getStaticPaths(): Promise<StaticPaths[]> {
  const artists = await getArtists();

  return artists.map(artist => {
    return {
      params: {
        name: artist.name.toLowerCase().replace(/ /g, '-'),
        id: artist.id,
      }
    }
  });
}

export async function getStaticParams({ params }: StaticPaths): Promise<StaticParams> {
  const artist = await getArtistById(params.id);

  return { artist };
}

export default class ArtistDetailsPage extends HTMLElement {
  #artist: Artist;

  constructor({ params }: PageProps) {
    super();
    this.#artist = params?.artist;
  }

  connectedCallback() {
    this.innerHTML = `
      <body>
        <a href="/">&lt; Back</a>
        <hr/>
        <h2>${this.#artist.name}</h2>
        <p><i>${this.#artist.bio}</i></p>
        <hr/>
        <pre>${JSON.stringify(this.#artist)}</pre>
      </body>
    `;
  }
}