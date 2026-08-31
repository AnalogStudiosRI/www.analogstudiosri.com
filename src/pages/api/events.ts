// match runtime TZ to publish TZ
// https://github.com/AnalogStudiosRI/www.analogstudios.net/issues/75
// https://github.com/AnalogStudiosRI/api/pull/10
process.env.TZ = "America/New_York";

import { getEvents, getEventById, getEventsByTag } from "#services/events/server.ts";
import type { Event } from "#services/events/types.ts";

export async function handler(request: Request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
  const eventId = params.has("id") ? params.get("id") : null;
  const tag = params.has("tag") ? params.get("tag") : null;
  let events: Event[];

  if (eventId) {
    const event = await getEventById(parseInt(eventId, 10));
    events = event ? [event] : [];
  } else if (tag) {
    events = await getEventsByTag(tag);
  } else {
    events = await getEvents();
  }

  return new Response(JSON.stringify(events), {
    headers: new Headers({
      "Cache-Control": "max-age=604800",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
  });
}
