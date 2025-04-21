import { Event } from "../../event-details/types";

export const eventToDbFormat = (event: Event) => {
  return {
    id: event.id,
    title: event.title,
    date: event.date.toISOString(),
    location: event.location,
    uniform_notes: event.uniformNotes,
    shift_notes: event.shiftNotes,
    booker_notes: event.bookerNotes,
    booker: event.booker,
    branch_id: event.branchId,
    user_id: event.user_id
  };
};