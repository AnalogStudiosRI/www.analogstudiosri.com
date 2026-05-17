import { getAlbums } from "#services/albums.ts";
import { modelAlbum } from "#components/card/card.tsx";
// TODO: import alias (#) does not seem to work here with WCC
// import '#components/card/card.tsx';
import "../../components/card/card.tsx";
import "../../components/quick-links/quick-links.tsx";

export default class ArtistsPage extends HTMLElement {
  async connectedCallback() {
    const albums = await getAlbums();
    const artistsCardsHtml = albums.map(album => {
      return `<as-card details='${JSON.stringify(modelAlbum(album))}'></as-card>`;
    }).join('\n');

    this.innerHTML = `
      <body>
        <div class="container-flex as-route-artists">
          <div class="row">

            <div class="hidden-sm-down col-xs-3">
              <p>Quick Links</p>
              <as-quick-links
                options='${JSON.stringify(albums.map(album => ({ value: album.title, id: album.id })))}'
              ></as-quick-links>
            </div>

            <div class="col-xs-7">
              <div class="artist-cards-list">
                ${artistsCardsHtml}
              </div>
            </div>

          </div>
        </div>
      </body>
    `;
  }
}
