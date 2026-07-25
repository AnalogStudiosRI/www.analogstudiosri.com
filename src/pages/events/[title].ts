import { slugifyer } from "#services/util.ts";
import type { Event } from "#services/events.ts";

interface Props {
  params: {
    title: string;
  };
}

export default class EventDetailsPage extends HTMLElement {
  #MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  #DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  #title: string;

  constructor({ params }: Props) {
    super();
    this.#title = params?.title ?? "No Title";
  }

  // EEEE, MMMM d, yyyy, h:mm a
  // SATURDAY, FEBRUARY 6, 2016, 9:00 PM
  formatEventTime(timestamp: number | undefined): string {
    if (!timestamp) return "";

    const dateObj = new Date(timestamp * 1000);
    const day = this.#DAYS[dateObj.getDay()].toUpperCase();
    const month = this.#MONTHS[dateObj.getMonth()].toUpperCase();
    const date = dateObj.getDate();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const hour = hours <= 12 ? hours : hours - 12;
    const minutes = dateObj.getMinutes();
    const minute = minutes <= 9 ? `0${minutes}` : minutes;
    const ampm = hours <= 11 ? "AM" : "PM";

    return `${day}, ${month} ${date}, ${year}, ${hour}:${minute} ${ampm}`;
  }

  async connectedCallback() {
    // TODO: better environment variable management / client side vs SSR
    // https://github.com/ProjectEvergreen/greenwood/discussions/1530
    // TODO: need to update this when adopting the new domain name, or possibly when bringing over the backend, or use process.env.API_BACKEND_HOSTNAME
    const events = await fetch("http://www.analogstudios.net/api/events")
      .then((resp) => resp.json())
      .then((resp) => resp as Event[]);
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
            <i class="cal-icon fa fa-calendar-o" style="font-size: 5rem;width:10%"></i>
            <div id="as-event-info">
              <p>Event Title: ${event?.title}</p>
              <p>Event Date: ${this.formatEventTime(event?.startTime)}</p>
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
