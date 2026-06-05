import { modelAlbum } from '#components/card/card.tsx';
import { slugifyer } from '#services/util.ts';
import { getAlbums, getAlbumById } from '#services/albums.ts';
import type { Album } from '#services/albums.ts';
// TODO: import alias (#) does not seem to work here with WCC
// import '#components/card/card.tsx';
import "../../components/card/card.tsx";

// TODO: types for all this from Greenwood: StaticPaths / Params / SSR page / etc?  can they be inferred?
interface StaticPaths {
  params: {
    name: string;
    id: number;
  }
}

interface StaticParams {
  album: Album
}

interface PageProps {
  params: {
    album: Album;
  }
}

export async function getStaticPaths(): Promise<StaticPaths[]> {
  const albums = await getAlbums();

  return albums.map(album => {
    return {
      params: {
        name: slugifyer(album.title),
        id: album.id,
      }
    }
  });
}

export async function getStaticParams({ params }: StaticPaths): Promise<StaticParams> {
  const album = await getAlbumById(params.id);

  return { album };
}

export default class AlbumDetailsPage extends HTMLElement {
  #album: Album;

  constructor({ params }: PageProps) {
    super();
    this.#album = params?.album;
  }

  static getDownloadLink(album: Album): string {
    if (album.downloadUrl) {
      return `
        <a class="download-url as-link" href="${album.downloadUrl}" rel="noopener noreferrer">Download Link</a>
      `;
    }
    return '';
  }

  connectedCallback() {
    const formattedTitle = `${this.#album.title} (${this.#album.year})`;
    // don't need links on details pages
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { link, ...rest } = modelAlbum(this.#album);

    this.innerHTML = `
      <body>
        <div class="container-flex as-routes-album-details">
          <div class="row">

            <div class="col-xs-4 hidden-sm-down">
              <as-social-share></as-social-share>
            </div>

            <div class="col-xs-6">
              <div class="card-row hidden-sm-down">
                ${AlbumDetailsPage.getDownloadLink(this.#album)}
                <as-card details='${JSON.stringify(rest)}'></as-card>
              </div>

              <div class="card-row hidden-md-up">
                <h4>${formattedTitle}</h4>
                <img src="${this.#album.imageUrl}" alt="${formattedTitle}"/>
                <p>${this.#album.description}</p>
              </div>
            </div>

          </div>
        </div>
      </body>
    `;
  }
}