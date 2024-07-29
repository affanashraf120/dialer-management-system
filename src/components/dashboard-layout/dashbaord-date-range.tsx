import { CalendarDateRangePicker } from "@components/date-range-picker";
import format from "date-fns/format";
import startOfMonth from "date-fns/startOfMonth";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { DateRange } from "react-day-picker";

const DashboardDateRange = () => {
  const router = useRouter();
  const { start_date, end_date } = useDashboardDateRange();

  const onSelectDateRange = (dateRange: DateRange) => {
    if (dateRange.from && dateRange.to) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            from: format(dateRange.from, "yyy-MM-dd"),
            to: format(dateRange.to, "yyy-MM-dd"),
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <CalendarDateRangePicker
      from={new Date(start_date)}
      to={new Date(end_date)}
      onSetDate={onSelectDateRange}
      className="w-full"
    />
  );
};

export default DashboardDateRange;

export const useDashboardDateRange = () => {
  const router = useRouter();
  const startDateQueryParam = router.query["from"] as string;
  const endDateQueryParam = router.query["to"] as string;

  const { start_date, end_date } = useMemo(() => {
    return {
      start_date:
        startDateQueryParam ?? format(startOfMonth(new Date()), "yyy-MM-dd"),
      end_date: endDateQueryParam ?? format(new Date(), "yyy-MM-dd"),
    };
  }, [startDateQueryParam, endDateQueryParam]);

  const isCurrentMonthSelected = useMemo(() => {
    return !startDateQueryParam && !endDateQueryParam;
  }, [startDateQueryParam, endDateQueryParam]);

  return {
    start_date,
    end_date,
    isCurrentMonthSelected,
    startDateQueryParam,
    endDateQueryParam,
  };
};
