import { formatDateTime, slugifyer } from "#services/util.ts";
import { getEvents } from "#services/events.ts";

interface Props {
  params: {
    title: string;
  };
}

export default class EventDetailsPage extends HTMLElement {
  #title: string;

  constructor({ params }: Props) {
    super();
    this.#title = params?.title ?? "No Title";
  }

  async connectedCallback() {
    const events = await getEvents();
    const event = events.find((event) => slugifyer(event?.title) === this.#title);

    this.innerHTML = `
      <head>
        <title>Analog Studios RI - ${event?.title}</title>
        <meta property="og:title" content="Analog Studios RI - ${event?.title}" />
      </head>
      <body>
        <div class="as-events-container as-route-event-details">
          <div id="as-event-detail-container">
            <as-social-share></as-social-share>
            <div id="as-event-info">
              <p>Event Title: ${event?.title}</p>
              <p>Event Date: ${formatDateTime(event?.startTime)}</p>
              <p>Event Info:</p>
              <p style="color: var(--color-primary)">${event?.description}</p>
            </div>
          </div>
        </div>
      </body>
    `;
  }
}

export const prerender = false;
