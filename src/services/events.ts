interface Event {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  createdTime: string;
  tags?: string[];
}

const EVENTS_API_PATH = "/api/events";
// handle for isomorphic data fetching
// TODO: better environment variable management / client side vs SSR
// https://github.com/ProjectEvergreen/greenwood/discussions/1530
// TODO: need to update this when adopting the new domain name, or possibly when bringing over the backend, or use process.env.API_BACKEND_HOSTNAME
const EVENTS_API_URL =
  typeof window === "undefined"
    ? `${process.env.API_BACKEND_HOSTNAME}${EVENTS_API_PATH}`
    : EVENTS_API_PATH;

async function getEvents(): Promise<Event[]> {
  return fetch(EVENTS_API_URL).then((resp) => resp.json());
}

async function getEventById(id: number): Promise<Event> {
  return fetch(`${EVENTS_API_URL}?id=${id}`)
    .then((resp) => resp.json())
    .then((resp) => resp[0]);
}

export { getEvents, getEventById };

export type { Event };
