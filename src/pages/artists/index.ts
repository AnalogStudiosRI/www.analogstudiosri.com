import { getArtists } from "#services/artists.ts";
import { modelArtist } from "#components/card/card.tsx";
// TODO: import alias (#) does not seem to work here with WCC
// import '#components/card/card.tsx';
import "../../components/card/card.tsx";
import "../../components/quick-links/quick-links.tsx";

export default class ArtistsPage extends HTMLElement {
  #ANALOG_ID = 1;

  async connectedCallback() {
    const artists = await getArtists();

    // make sure "newer" artists are at the top
    const artistsList = artists.reverse().filter((artist) => artist.id !== this.#ANALOG_ID);
    const analog = artists.filter((artist) => artist.id === this.#ANALOG_ID)[0];
    const artistsCardsHtml = [analog, ...artistsList].map(artist => {
      return `<as-card details='${JSON.stringify(modelArtist(artist))}'></as-card>`;
    }).join('\n');

    this.innerHTML = `
      <body>
        <div class="container-flex as-route-artists">
          <div class="row">

            <div class="hidden-sm-down col-xs-3">
              <p>Quick Links</p>
              <as-quick-links
                options='${JSON.stringify(artists.map(artist => ({ value: artist.name, id: artist.id })))}'
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
