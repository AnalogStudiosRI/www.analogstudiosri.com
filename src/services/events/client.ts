import type { Event, EventsService } from "#services/events/types.ts";

const EVENTS_API_PATH = "/api/events";

const getEvents: EventsService["getEvents"] = async () => {
  return fetch(EVENTS_API_PATH).then((response) => response.json());
};

const getEventById: EventsService["getEventById"] = async (id) => {
  return fetch(`${EVENTS_API_PATH}?id=${id}`)
    .then((response) => response.json() as Promise<Event[]>)
    .then((events) => events[0]);
};

const getEventsByTag: EventsService["getEventsByTag"] = async (tag) => {
  return fetch(`${EVENTS_API_PATH}?tag=${encodeURIComponent(tag)}`).then((response) =>
    response.json(),
  );
};

export { getEvents, getEventById, getEventsByTag };
