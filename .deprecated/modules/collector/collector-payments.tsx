import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { dashboardClient } from "../../config/httpClient";
import format from "date-fns/format";
import sub from "date-fns/sub";
import { CollectorPayment } from "@types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { formatCurrency } from "@lib/utils";
import { Pagination } from "@components/pagination";
import { CalendarDateRangePicker } from "@components/date-range-picker";
import { DateRange } from "react-day-picker";
import Link from "next/link";
import { Button } from "@components/button";

const CollectorPayments = () => {
  const router = useRouter();
  const collectorId = router.query?.id as string;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const paymentPage = router.query?.payment_page as string;
    if (paymentPage) {
      const parsedPaymentPage = Number(paymentPage);
      if (!Number.isNaN(parsedPaymentPage)) {
        setCurrentPage(parsedPaymentPage);
      }
    }
  }, [router.query.payment_page]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, payment_page: page },
      },
      undefined,
      { shallow: true }
    );
  };

  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: format(sub(new Date(), { months: 1 }), "yyy-MM-dd"),
    endDate: format(new Date(), "yyy-MM-dd"),
  });

  const { data: payments, isFetching } = useQuery({
    queryKey: [
      "collectors-payment",
      collectorId,
      dateRange.startDate,
      dateRange.endDate,
      currentPage,
    ],
    queryFn: () =>
      dashboardClient
        .get<CollectorPayment[]>(
          `/total-payments?start_date=${dateRange.startDate}&end_date=${
            dateRange.endDate
          }&collector_id=${collectorId}&limit=10&offset=${
            (currentPage - 1) * 10
          }`
        )
        .then((res) => res.data),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const onSelectDateRange = (dateRange: DateRange) => {
    if (dateRange.from && dateRange.to) {
      setDateRange({
        startDate: format(dateRange.from, "yyy-MM-dd"),
        endDate: format(dateRange.to, "yyy-MM-dd"),
      });
    }
  };

  return (
    <div>
      <div className="py-4 flex justify-end">
        <CalendarDateRangePicker
          from={new Date(dateRange.startDate)}
          to={new Date(dateRange.endDate)}
          onSetDate={onSelectDateRange}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Total Payment</TableHead>
              <TableHead>Payment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments && payments.length ? (
              payments.map(
                (
                  {
                    client_name,
                    client_number,
                    balance,
                    payment_date,
                    total_payments,
                  },
                  idx
                ) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Link
                        className="underline"
                        title={client_name}
                        href={`/clients/${client_number}`}
                      >
                        {client_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        className="underline"
                        title={client_name}
                        href={`/clients/${client_number}`}
                      >
                        {client_number}
                      </Link>
                    </TableCell>
                    <TableCell>{formatCurrency(balance)}</TableCell>
                    <TableCell>{formatCurrency(total_payments)}</TableCell>
                    <TableCell>{payment_date}</TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {isFetching ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {payments && payments.length && (
        <div className="my-6 flex justify-center md:justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={100}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CollectorPayments;
