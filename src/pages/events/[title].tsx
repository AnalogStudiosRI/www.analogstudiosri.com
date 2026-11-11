// match runtime TZ to publish TZ
// https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/41
process.env.TZ = "America/New_York";

import { formatDateTime, slugifyer } from "#services/util.ts";
import { getEvents } from "#services/events/server.ts";
import type { Event } from "#services/events/types.ts";

interface Props {
  params: {
    title: string;
  };
}

export default class EventDetailsPage extends HTMLElement {
  #event: Event | undefined;
  #title: string;

  constructor({ params }: Props) {
    super();
    this.#title = params?.title ?? "No Title";
  }

  async connectedCallback() {
    const events = await getEvents();

    this.#event = events.find((event) => slugifyer(event?.title) === this.#title);
    this.render();
  }

  render() {
    return (
      <html>
        <head>
          <title>Analog Studios RI - {this.#event?.title}</title>
          <meta property="og:title" content={`Analog Studios RI - ${this.#event?.title}`} />
        </head>
        <body>
          <div class="as-events-container as-route-event-details">
            <div id="as-event-detail-container">
              <as-social-share></as-social-share>
              <div id="as-event-info">
                <p>Event Title: {this.#event?.title}</p>
                <p>Event Date: {formatDateTime(this.#event?.startTime)}</p>
                <p>Event Info:</p>
                <p style="color: var(--color-primary)">{this.#event?.description}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }
}

export const prerender = false;
