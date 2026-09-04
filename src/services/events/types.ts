interface Event {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  createdTime: string;
  link?: string;
  tags?: string[];
}

interface EventsService {
  getEvents: () => Promise<Event[]>;
  getEventById: (id: number) => Promise<Event | undefined>;
  getEventsByTag: (tag: string) => Promise<Event[]>;
}

export type { Event, EventsService };
