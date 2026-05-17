import type { Artist } from '#services/artists.ts';
import type { Album } from '#services/albums.ts';
// TODO: CSS Module Scripts do not work with SSR pages

const lorum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempor commodo dictum. Donec interdum finibus congue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer id accumsan ante. Suspendisse potenti. Nulla facilisi. Nullam mattis erat lectus, condimentum facilisis erat posuere sed. Maecenas quis lacinia lorem.`;

interface Details {
  imagePath: string,
  headingText: string,
  bodyText: string,
  imageAltText: string,
  link: string
}

// TODO: make links here and in modelArtist "url safe"
function modelAlbum(album: Album) {
  return {
    imagePath: album ? album.imageUrl : '',
    headingText: album ? album.title : '',
    // TODO: make content from APIs work
    // bodyText: album ? album.description : '',
    bodyText: album ? lorum : '',
    imageAltText: album ? album.title : '',
    link: album ? `/albums/${album.title.toLowerCase()}/` : '#'
  };
}

function modelArtist(artist: Artist) {
  return {
    imagePath: artist ? artist.imageUrl : '',
    headingText: artist ? artist.name : '',
    // TODO: make content from APIs work
    // bodyText: artist ? artist.bio : '',
    bodyText: artist ? lorum : '',
    imageAltText: artist ? artist.name : '',
    link: artist ? `/artists/${artist.name.toLowerCase()}/` : '#'
  };
}

export class CardComponent extends HTMLElement {
  #details: Details | undefined;

  connectedCallback() {
    this.#details = JSON.parse(this.getAttribute('details') ?? '{}');
    this.render();
  }

  render() {
    if(!this.#details) {
      return;
    }
   
    const { imagePath, imageAltText, bodyText, headingText, link } = this.#details;

    // TODO: # private references don't work with WCC?
    return (
      <div class="container as-card">
        <div class="row">
          {/* why doesn't col-xs-12 work here */}
          <div class="col-xs-12">

            <div class="card-row hidden-sm-down">
              <div class="media">
                <div class="media-left">
                  <a href={link} title={`Visit ${headingText}`}>
                    <img class="media-object" src={imagePath} alt={imageAltText}/>
                  </a>
                </div>

                <div class="media-body">
                  <h3 class="media-heading">
                    <a href={link} title={`Visit ${headingText}`}>
                      {headingText}
                    </a>
                  </h3>
                  <p>{bodyText}</p>
                </div>
              </div>
            </div>

            <a href={link} title={`Visit ${headingText}`}>
              <div class="card-row hidden-md-up">
                <h3>{headingText}</h3>
                <img src={imagePath} alt={imageAltText}/>
              </div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

customElements.define('as-card', CardComponent)

export {
  modelAlbum,
  modelArtist,
  type Details
};