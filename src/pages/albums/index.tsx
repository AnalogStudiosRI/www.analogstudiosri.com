import { getAlbums } from "#services/albums.ts";
import type { Album } from "#services/albums.ts";
import { slugifyer, escapeHtmlAttribute } from "#services/util.ts";
import { modelAlbum } from "#components/card/card.tsx";
// TODO: import alias (#) does not seem to work here with WCC
// import '#components/card/card.tsx';
// https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/25
import "../../components/card/card.tsx";
import "../../components/quick-links/quick-links.tsx";

export default class AlbumsPage extends HTMLElement {
  #albums: Album[] = [];

  async connectedCallback() {
    this.#albums = await getAlbums();
    this.render();
  }

  render() {
    return (
      <html>
        <head>
          <title>Analog Studios RI - Albums</title>
          <meta property="og:title" content="Analog Studios RI - Albums" />
          <meta name="description" content="Browse all albums produced at Analog Studios" />
        </head>
        <body>
          <div class="container-flex as-route-albums">
            <div class="row">
              <div class="hidden-sm-down col-xs-3">
                <p>Quick Links</p>
                <as-quick-links
                  label="Select Album"
                  links={escapeHtmlAttribute(
                    JSON.stringify(
                      this.#albums.map((album) => ({
                        route: `/albums/${slugifyer(album.title)}/`,
                        label: album.title,
                      })),
                    ),
                  )}
                ></as-quick-links>
              </div>
              <div class="albums-cards-list">
                {this.#albums.map((album) => (
                  <as-card
                    details={escapeHtmlAttribute(JSON.stringify(modelAlbum(album)))}
                  ></as-card>
                ))}
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }
}
