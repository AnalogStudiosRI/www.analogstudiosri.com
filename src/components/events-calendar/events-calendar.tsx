// TODO: page load hangs if we use import aliases (e.g. #)
// https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/25
import { Temporal } from "temporal-polyfill";
import { getEvents } from "../../services/events.ts";
import eventsCalendarSheet from "./events-calendar.css" with { type: "css" };
import eventsSheet from "../../styles/events.css" with { type: "css" };
import themeSheet from "../../styles/theme.css" with { type: "css" };
import { slugifyer } from "../../services/util.ts";
import type { Event } from "#services/events.ts";

const TIME_ZONE = "America/New_York";

interface Day {
  date: number | null;
  hasEvents: boolean;
  events: Event[];
}

type Week = Day[];
export class EventsCalendarComponent extends HTMLElement {
  #DAYS_IN_WEEK = 7;
  #MAX_CALENDAR_SPACES = 42;
  #events: Event[] = [];
  #currentMonth: Temporal.PlainYearMonth;
  #currentMonthData: Week[] = [];

  constructor() {
    super();
    this.#currentMonth = Temporal.Now.plainDateISO(TIME_ZONE).toPlainYearMonth();
  }

  async connectedCallback() {
    this.#events = await getEvents();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this?.shadowRoot?.adoptedStyleSheets?.push(themeSheet, eventsSheet, eventsCalendarSheet);
    this.#calculateCurrentMonthData();
    this.render();
  }

  #calculateCurrentMonthData(): void {
    this.#currentMonthData = [];
    let week: Week = [];
    let monthDateCounter = 1;
    const firstDayOfMonth = this.#currentMonth.toPlainDate({ day: 1 });
    // Temporal uses Monday = 1 through Sunday = 7. The calendar starts on Sunday.
    const startingDayOfMonth = firstDayOfMonth.dayOfWeek % this.#DAYS_IN_WEEK;
    const eventsByDate = new Map<string, Event[]>();

    for (const event of this.#events) {
      const eventDate = Temporal.Instant.fromEpochMilliseconds(event.startTime * 1000)
        .toZonedDateTimeISO(TIME_ZONE)
        .toPlainDate();

      if (
        eventDate.year === this.#currentMonth.year &&
        eventDate.month === this.#currentMonth.month
      ) {
        const dateKey = eventDate.toString();
        const events = eventsByDate.get(dateKey) ?? [];

        events.push(event);
        eventsByDate.set(dateKey, events);
      }
    }

    for (let i = 0, j = this.#MAX_CALENDAR_SPACES; i < j; i += 1) {
      // use null as date default to block out tiles in our calender that aren't in the month
      // while still keeping the calendar looking "full"
      const day: Day = {
        date: null,
        hasEvents: false,
        events: [],
      };

      if (i >= startingDayOfMonth && monthDateCounter <= this.#currentMonth.daysInMonth) {
        const date = firstDayOfMonth.add({ days: monthDateCounter - 1 });

        day.date = date.day;
        day.events = eventsByDate.get(date.toString()) ?? [];
        day.hasEvents = day.events.length > 0;

        monthDateCounter += 1;
      }

      week.push(day);

      if (week.length === this.#DAYS_IN_WEEK) {
        this.#currentMonthData.push(week);
        week = [];
      }
    }
  }

  #calculatePreviousMonth(): void {
    this.#currentMonth = this.#currentMonth.subtract({ months: 1 });
    this.#calculateCurrentMonthData();
  }

  #calculateNextMonth(): void {
    this.#currentMonth = this.#currentMonth.add({ months: 1 });
    this.#calculateCurrentMonthData();
  }

  #getHeaderText(): string {
    return this.#currentMonth.toPlainDate({ day: 1 }).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  // TODO: private methods are not supported by WCC <> JSX event handlers
  // https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/20
  shiftToPreviousMonth(): void {
    this.#calculatePreviousMonth();
    this.render();
  }

  // TODO: private methods are not supported by WCC <> JSX event handlers
  // https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/20
  shiftToNextMonth(): void {
    this.#calculateNextMonth();
    this.render();
  }

  render() {
    const html = this.#currentMonthData
      .map((week) => {
        return `
        <div class="as-events-calendar__week">
          ${week.map((day) => {
            const dayNotInMonthContent = !day.date ? "<div></div>" : "";
            const dayInMonthContent = day.date && !day.hasEvents ? day.date : "";
            const eventsInDayContent = day.hasEvents
              ? day.events.map((event) => {
                  return `
                    <span class="as-events-calendar__day-event">
                      <a class="as-events-calendar__day-event" href="/events/${slugifyer(event.title)}/" title="${event.title}">
                        <i class="fa fa-calendar-check-o"></i>
                      </a>
                    </span>
                  `;
                })
              : "";

            return `
                <div class="as-events-calendar__day">
                  <!--day not in month-->
                  ${dayNotInMonthContent}

                  <!--day in month without event-->
                  ${dayInMonthContent}

                  <!--day with event if there's an event-->
                  ${eventsInDayContent}
                </div>
              `;
          })}
        </div>
      `;
      })
      .join("");
    const headerText = this.#getHeaderText();

    return (
      <div class="as-events-calendar">
        <div class="as-events-calendar__header">
          <button
            type="button"
            class="btn btn-default btn-sm as-events-calendar__btn"
            onclick={this.shiftToPreviousMonth}
            tabindex={-1}
            aria-label="goto previous month"
          >
            <i class="fa fa-arrow-left"></i>
          </button>

          <h3 class="as-events-calendar__header-text">
            Event Calendar
            <br />
            <span class="as-events-calendar__month">{headerText}</span>
          </h3>

          <button
            type="button"
            class="btn btn-default btn-sm as-events-calendar__btn"
            onclick={this.shiftToNextMonth}
            tabindex={-1}
            aria-label="goto next month"
          >
            <i class="fa fa-arrow-right"></i>
          </button>
        </div>

        <div class="as-events-calendar__days">
          <div class="as-events-calendar__day-name">Sun</div>
          <div class="as-events-calendar__day-name">Mon</div>
          <div class="as-events-calendar__day-name">Tue</div>
          <div class="as-events-calendar__day-name">Wed</div>
          <div class="as-events-calendar__day-name">Thu</div>
          <div class="as-events-calendar__day-name">Fri</div>
          <div class="as-events-calendar__day-name">Sat</div>
        </div>

        {html}
      </div>
    );
  }
}

customElements.define("as-events-calendar", EventsCalendarComponent);
