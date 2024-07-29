import {
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  isEqual,
} from "date-fns";

interface DateRange {
  from: Date;
  to: Date;
}

export function getDateRangeFromOption(value: string): DateRange {
  const today = new Date();
  switch (value) {
    case "today":
      return { from: startOfToday(), to: endOfToday() };
    case "this-week":
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      };
    case "this-month":
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case "last-month":
      const startLastMonth = startOfMonth(subMonths(today, 1));
      return { from: startLastMonth, to: endOfMonth(startLastMonth) };
    case "last-6-months":
      const sixMonthsAgo = subMonths(today, 6);
      return {
        from: startOfMonth(sixMonthsAgo),
        to: endOfMonth(subMonths(today, 1)),
      };
    default:
      return {
        from: new Date(),
        to: new Date(),
      };
  }
}

export function getDateOptionFromRange(from: Date, to: Date): string {
  const today = new Date();
  if (isEqual(from, startOfToday()) && isEqual(to, endOfToday())) {
    return "today";
  } else if (
    isEqual(from, startOfWeek(today, { weekStartsOn: 1 })) &&
    isEqual(to, endOfWeek(today, { weekStartsOn: 1 }))
  ) {
    return "this-week";
  } else if (
    isEqual(from, startOfMonth(today)) &&
    isEqual(to, endOfMonth(today))
  ) {
    return "this-month";
  } else if (
    isEqual(from, startOfMonth(subMonths(today, 1))) &&
    isEqual(to, endOfMonth(subMonths(today, 1)))
  ) {
    return "last-month";
  } else if (
    isEqual(from, startOfMonth(subMonths(today, 6))) &&
    isEqual(to, endOfMonth(subMonths(today, 1)))
  ) {
    return "last-6-months";
  } else {
    return "custom";
  }
}

export const dateRangeSelectOptions = [
//   {
//     label: "Today",
//     value: "today",
//   },
  {
    label: "This Week",
    value: "this-week",
  },
  {
    label: "This Month",
    value: "this-month",
  },
  {
    label: "Last Month",
    value: "last-month",
  },
  {
    label: "Last 6 Months",
    value: "last-6-months",
  },
  {
    label: "Custom",
    value: "custom",
  },
];
