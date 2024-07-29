import { CalendarDateRangePicker } from "@components/date-range-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/select";
import { cn } from "@lib/utils";
import {
  dateRangeSelectOptions,
  getDateOptionFromRange,
  getDateRangeFromOption,
} from "@lib/utils/date.util";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

const DateRangeOption = (
  {
    fromKey,
    toKey,
    containerClassName,
    align,
  }: {
    fromKey: string;
    toKey: string;
    containerClassName?: string;
    align?: "start" | "end" | "center";
  } = {
    fromKey: "from",
    toKey: "to",
  }
) => {
  const {
    selectedDateRangeOption,
    setSelectedDateRangeOption,
    onSelectDateRange,
    dateRangeSelectOptions,
    from,
    to,
  } = useDateRangeOption({ fromKey, toKey });

  return (
    <div className={cn("flex items-center gap-4", containerClassName)}>
      <Select
        value={selectedDateRangeOption}
        onValueChange={(value) => {
          setSelectedDateRangeOption(value);
          const dateRange = getDateRangeFromOption(value);
          onSelectDateRange({ from: dateRange?.from, to: dateRange?.to });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {dateRangeSelectOptions.map(({ label, value }) => (
              <SelectItem
                key={value}
                value={value}
                className={value === "custom" ? "hidden" : ""}
              >
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <CalendarDateRangePicker
        align={align}
        from={new Date(from)}
        to={new Date(to)}
        onSetDate={onSelectDateRange}
      />
    </div>
  );
};

export default DateRangeOption;

export const useDateRangeOption = (
  {
    fromKey,
    toKey,
  }: {
    fromKey: string;
    toKey: string;
  } = {
    fromKey: "from",
    toKey: "to",
  }
) => {
  const [selectedDateRangeOption, setSelectedDateRangeOption] =
    useState<string>("this-week");

  const router = useRouter();

  const onSelectDateRange = (dateRange: DateRange) => {
    if (dateRange.from && dateRange.to) {
      const option = getDateOptionFromRange(dateRange.from, dateRange.to);
      setSelectedDateRangeOption(option);
    }

    if (dateRange.from && dateRange.to) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            [fromKey]: format(dateRange.from, "yyy-MM-dd"),
            [toKey]: format(dateRange.to, "yyy-MM-dd"),
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const fromDateQueryParam = router.query[fromKey] as string;
  const toDateQueryParam = router.query[toKey] as string;

  const { from, to } = useMemo(() => {
    const defaultDateRange = getDateRangeFromOption(selectedDateRangeOption);

    if (fromDateQueryParam && toDateQueryParam) {
      const fromDate = new Date(fromDateQueryParam);
      const toDate = new Date(toDateQueryParam);
      if (
        fromDate.toString() === "Invalid Date" ||
        toDate.toString() === "Invalid Date"
      ) {
        return {
          from: format(defaultDateRange.from, "yyy-MM-dd"),
          to: format(defaultDateRange.to, "yyy-MM-dd"),
        };
      }

      return {
        from: format(fromDate, "yyy-MM-dd"),
        to: format(toDate, "yyy-MM-dd"),
      };
    }
    return {
      from: format(defaultDateRange.from, "yyy-MM-dd"),
      to: format(defaultDateRange.to, "yyy-MM-dd"),
    };
  }, [fromDateQueryParam, selectedDateRangeOption, toDateQueryParam]);

  return {
    from,
    to,
    selectedDateRangeOption,
    setSelectedDateRangeOption,
    onSelectDateRange,
    dateRangeSelectOptions,
  };
};
