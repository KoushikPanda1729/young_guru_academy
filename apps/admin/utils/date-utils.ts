import { isAfter, isBefore } from "date-fns";

function isInRange(date: Date, start: Date, end: Date) {
  return (
    (isAfter(date, start) || date.getTime() === start.getTime()) &&
    (isBefore(date, end) || date.getTime() === end.getTime())
  )
}