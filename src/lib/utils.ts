import { ColumnDef } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import format from "date-fns/format";
import sub from "date-fns/sub";
import { twMerge } from "tailwind-merge";
import {
  PhoneNumberFormat as PNF,
  PhoneNumberUtil,
} from "google-libphonenumber";
import axios from "axios";

const phoneUtil = PhoneNumberUtil.getInstance();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPhoneNumber = (phoneNumber?: string) => {
  try {
    return phoneUtil.format(
      phoneUtil.parse(phoneNumber, "US"),
      PNF.INTERNATIONAL
    );
  } catch (error) {
    return phoneNumber;
  }
};

export function createAccessorKeyHeaderObject<T>(
  columns: ColumnDef<T>[]
): Record<string, string> {
  const accessorKeyHeaderObject: Record<string, string> = {};

  columns.forEach((column) => {
    //@ts-ignore
    const { accessorKey, header } = column;
    //@ts-ignore
    accessorKeyHeaderObject[accessorKey] = header;
  });

  return accessorKeyHeaderObject;
}

export function formatCurrency(amount: number | string | undefined | null) {
  try {
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return "-";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parsedAmount);
  } catch (error) {}
  return "-";
}

export function getDateRange({
  from,
  to,
  subDuration,
}: {
  from?: string;
  to?: string;
  subDuration?: Duration;
}) {
  const isValidDate = (dateString: string) => !isNaN(Date.parse(dateString));

  if (from && to && isValidDate(from) && isValidDate(to)) {
    const formattedStartDate = format(new Date(from), "yyyy-MM-dd");
    const formattedEndDate = format(new Date(to), "yyyy-MM-dd");

    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  }

  const endDate = new Date();
  const startDate = sub(endDate, subDuration ?? { years: 1 });
  return {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };
}

export function getPercentage(part: number, whole: number): number {
  if (whole === 0) {
    return 0;
  }
  return Number(((part / whole) * 100).toFixed(2));
}

export function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString);
  return (
    !isNaN(date.getTime()) && dateString === date.toISOString().slice(0, 10)
  );
}

export function formatCallDuration(seconds: number): string {
  seconds = Math.round(seconds);

  const hours = Math.floor(seconds / 3600); // 3600 seconds in an hour
  const minutes = Math.floor((seconds % 3600) / 60); // Remaining seconds divided by 60
  const remainingSeconds = seconds % 60; // Seconds left after extracting hours and minutes

  const parts = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

  return parts.join(" ") || "0s"; // Return the joined string or '0 seconds' if all are zero
}

export function formatAvgPercentage(num: number): string {
  return `${(num * 100).toFixed(2)}%`;
}

export const formatCallDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return format(date, "yyyy-MM-dd HH:mm:ss");
};

export const validateAdminAccess = async (email: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_MISC_API_BASE_URL}/admin/validate-access`,
      {
        params: {
          email,
        },
      }
    );
    return !!data;
  } catch (error) {
    return false;
  }
};
