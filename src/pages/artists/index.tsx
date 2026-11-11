import { getArtists } from "#services/artists.ts";
import type { Artist } from "#services/artists.ts";
import { modelArtist } from "#components/card/card.tsx";
import { slugifyer, escapeHtmlAttribute } from "#services/util.ts";
// TODO: import alias (#) does not seem to work here with WCC
// import '#components/card/card.tsx';
// https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/25
import "../../components/card/card.tsx";
import "../../components/quick-links/quick-links.tsx";

export default class ArtistsPage extends HTMLElement {
  #ANALOG_ID = 1;
  #artists: Artist[] = [];
  #featuredArtists: Artist[] = [];

  async connectedCallback() {
    const artists = await getArtists();

    // make sure "newer" artists are at the top
    const artistsList = artists.reverse().filter((artist) => artist.id !== this.#ANALOG_ID);
    const analog = artists.filter((artist) => artist.id === this.#ANALOG_ID)[0];
    this.#artists = artists;
    this.#featuredArtists = [analog, ...artistsList];
    this.render();
  }

  render() {
    return (
      <html>
        <head>
          <title>Analog Studios RI - Artists</title>
          <meta property="og:title" content="Analog Studios RI - Artists" />
          <meta name="description" content="Browse artists featured at Analog Studios" />
        </head>
        <body>
          <div class="container-flex as-route-artists">
            <div class="row">
              <div class="hidden-sm-down col-xs-3">
                <p>Quick Links</p>
                <as-quick-links
                  label="Select Artist"
                  links={escapeHtmlAttribute(
                    JSON.stringify(
                      this.#artists.map((artist) => ({
                        route: `/artists/${slugifyer(artist.name)}/`,
                        label: artist.name,
                      })),
                    ),
                  )}
                ></as-quick-links>
              </div>
              <div class="artist-cards-list">
                {this.#featuredArtists.map((artist) => (
                  <as-card
                    details={escapeHtmlAttribute(JSON.stringify(modelArtist(artist)))}
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
