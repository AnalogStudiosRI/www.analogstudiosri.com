// match runtime TZ to publish TZ
// https://github.com/AnalogStudiosRI/www.analogstudios.net/issues/75
// https://github.com/AnalogStudiosRI/api/pull/10
process.env.TZ = "America/New_York";

// https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
import * as contentful from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const { CONTENTFUL_SPACE, CONTENTFUL_ACCESS_TOKEN } = process.env;

interface Event {
  id: number;
  description: string;
  endTime: number;
  startTime: number;
  title: string;
  link: string;
  tags: Array<string>;
}

interface EventEntry {
  id: contentful.EntryFieldTypes.Number;
  description: contentful.EntryFieldTypes.RichText;
  endTime: contentful.EntryFieldTypes.Date;
  startTime: contentful.EntryFieldTypes.Date;
  title: contentful.EntryFieldTypes.Text;
  link: contentful.EntryFieldTypes.Text;
  metadata: {
    tags: Array<string>;
  };
}

interface EventEntrySkeleton {
  contentTypeId: "event";
  fields: EventEntry;
}

export async function handler(request: Request) {
  const client = contentful.createClient({
    space: CONTENTFUL_SPACE ?? "",
    accessToken: CONTENTFUL_ACCESS_TOKEN ?? "",
  });
  const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
  const id = params.has("id") ? params.get("id") : null;
  const tag = params.has("tag") ? params.get("tag") : null;
  const events: Event[] = (
    await client.getEntries<EventEntrySkeleton>({ content_type: "event" })
  ).items.map((event): Event => {
    const { id, description, endTime, startTime, title, link } = event.fields;
    const { tags } = event.metadata;

    return {
      id,
      title,
      description: documentToHtmlString(description, {
        // https://github.com/contentful/rich-text/issues/61
        renderNode: {
          "embedded-asset-block": (node) =>
            `<img src="${node.data.target.fields.file.url}" loading="lazy"/>`,
        },
      }),
      startTime: new Date(startTime).getTime() / 1000,
      endTime: new Date(endTime).getTime() / 1000,
      link,
      tags: tags.map((tag) => {
        return tag.sys.id;
      }),
    };
  });
  let results: Array<Event> | [] = events;

  if (id || tag) {
    if (id) {
      const event = events.find((event) => event.id === parseInt(id, 10));

      results = event ? [event] : [];
    } else if (tag) {
      results = events.filter((event) => event.tags.includes(tag));
    }
  }

  return new Response(JSON.stringify(results), {
    headers: new Headers({
      "Cache-Control": "max-age=604800",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
  });
}
