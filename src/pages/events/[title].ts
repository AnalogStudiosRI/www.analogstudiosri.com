interface Props {
  params: {
    title: string
  }
}

export default class EventDetailPage extends HTMLElement {
  #title: string;

  constructor({ params }: Props) {
    super();
    this.#title = params?.title ?? 'No Title';
  }

  async connectedCallback() {
    console.log('EventDetailPage connected', this.#title);
    this.innerHTML = `
      <div class="as-events-container">
        <as-events-calendar></as-events-calendar>
      </div>
    `
  }
}