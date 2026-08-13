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
// TODO: handle for isomorphic data fetching
// https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/11
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
