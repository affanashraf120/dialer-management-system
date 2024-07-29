import AuthManager from "@lib/hof/withAuth";
import { GetServerSidePropsContext } from "next";
import React, { useMemo, useState } from "react";
import { useHttpClient } from "../config/httpClient";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { format, getDate, getMonth, getYear, lastDayOfMonth } from "date-fns";
import { cn, formatCurrency } from "@lib/utils";
import { Button } from "@components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from "@components/skeleton";

// 2024-03-01
const getDay = (date: string) => {
  return parseInt(date.split("-")[2]);
};

const sanitizePaymentData = (data: Payments) => {
  let obj: { [key: number]: string } = {};

  Object.keys(data).forEach((key) => {
    obj[getDay(key)] = data[key].toString();
  });

  return obj;
};

const Collections = () => {
  const { paymentApiClient, enableQuery } = useHttpClient();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const {
    currentYear,
    currentDay,
    startDate,
    endDate,
    days,
    currentMonthName,
  } = useMemo(() => {
    // Get current date
    const currentDate = new Date(`${selectedYear}-${selectedMonth}-01`);
    // Extract current month and year
    const currentMonth = getMonth(currentDate);
    const currentYear = getYear(currentDate);
    // Determine the last day of the current month
    const lastDay = lastDayOfMonth(currentDate);
    // Extract the day of the month
    const currentDay = getDate(currentDate);
    // Generate start and end dates in YYYY-MM-DD format
    const startDate = format(
      new Date(currentYear, currentMonth, 1),
      "yyyy-MM-dd"
    );
    const endDate = format(lastDay, "yyyy-MM-dd");
    // Get the name of the current month
    const currentMonthName = format(currentDate, "MMMM");
    // Determine the number of days in the current month
    const days = getDate(lastDay);

    return {
      currentYear,
      currentDay,
      startDate,
      endDate,
      days,
      currentMonthName,
    };
  }, [selectedMonth, selectedYear]);

  const { data: collectionData, isLoading } = useQuery({
    queryKey: ["collections", startDate, endDate],
    queryFn: () =>
      paymentApiClient
        .get<CollectionResponse>("/payment/stats", {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        })
        .then((res) => res.data),

    enabled: !!enableQuery,
  });

  const onIncreaseMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const onDecreaseMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const isCurrentDay = (day: number) => {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return (
      currentDay === day &&
      currentMonth === selectedMonth &&
      currentYear === selectedYear
    );
  };

  return (
    <main>
      <h1 className="text-2xl font-bold">Collections</h1>
      <div className="mt-6 flex items-center gap-1">
        <Button variant="outline" onClick={onDecreaseMonth}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button variant="outline">
          {currentMonthName}, {currentYear}
        </Button>
        <Button variant="outline" onClick={onIncreaseMonth}>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
      <div className="border mt-2 rounded-lg">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs border-r">Collector</TableHead>
              {Array.from({ length: days }).map((_, index) => (
                <TableHead
                  key={index}
                  className={cn("text-xs border-r", {
                    "bg-green-100": isCurrentDay(index + 1),
                  })}
                >
                  {index + 1}
                </TableHead>
              ))}
              <TableHead className="text-xs">Total</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <td className="text-xs p-1 border-r">
                    {" "}
                    <Skeleton className="w-full h-2" />
                  </td>
                  <>
                    {Array.from({ length: days }).map((_, index) => (
                      <td key={index} className="text-xs p-1 border-r">
                        <Skeleton className="w-full h-2" />
                      </td>
                    ))}
                  </>
                  <td className="text-xs p-1">
                    {" "}
                    <Skeleton className="w-full h-2" />
                  </td>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {collectionData &&
                collectionData?.data?.map((collection, index) => (
                  <TableRow key={index}>
                    <td className="text-xs p-1 border-r">
                      {collection.collector.name}
                    </td>
                    {Array.from({ length: days }).map((_, index) => (
                      <td
                        className={cn("text-xs p-1 border-r", {
                          "bg-green-100": isCurrentDay(index + 1),
                        })}
                        key={index}
                      >
                        {formatCurrency(
                          sanitizePaymentData(collection.payments)[index + 1]
                        ) || "-"}
                      </td>
                    ))}
                    <td className="text-xs p-1">
                      {formatCurrency(
                        Object.values(collection.payments).reduce(
                          (acc, curr) => acc + parseInt(curr),
                          0
                        )
                      )}
                    </td>
                  </TableRow>
                ))}
            </TableBody>
          )}
        </Table>
      </div>
    </main>
  );
};

export default Collections;

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
