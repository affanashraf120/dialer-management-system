import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@lib/utils";
import { Button } from "@components/button";
import { Calendar } from "@components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/popover";

interface CalendarDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  from?: Date;
  to?: Date;
  onSetDate?: (dateRange: DateRange) => void;
  align?: "start" | "end" | "center";
}

export function CalendarDateRangePicker({
  className,
  from,
  to,
  onSetDate,
  align = "end",
}: CalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({ from, to });
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate({ from, to });
  }, [from, to]);

  const onSelectDate = (dateRange: DateRange | undefined) => {
    setDate(dateRange);
    if (onSetDate && dateRange && dateRange.from && dateRange.to) {
      onSetDate(dateRange);
      // setOpen(false);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover onOpenChange={() => setOpen(!open)} open={open}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            onClick={() => {
              if (!open) {
                // setDate(undefined);
              }
              setOpen(!open);
            }}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelectDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
