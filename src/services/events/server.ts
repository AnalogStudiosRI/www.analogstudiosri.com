import * as contentful from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { Event, EventsService } from "#services/events/types.ts";

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

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE ?? "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? "",
});

const getEvents: EventsService["getEvents"] = async () => {
  return (await client.getEntries<EventEntrySkeleton>({ content_type: "event" })).items.map(
    (event): Event => {
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
        createdTime: event.sys.createdAt,
        link,
        tags: tags.map((tag) => tag.sys.id),
      };
    },
  );
};

const getEventById: EventsService["getEventById"] = async (id) => {
  const events = await getEvents();
  return events.find((event) => event.id === id);
};

const getEventsByTag: EventsService["getEventsByTag"] = async (tag) => {
  const events = await getEvents();
  return events.filter((event) => event.tags?.includes(tag));
};

export { getEvents, getEventById, getEventsByTag };
