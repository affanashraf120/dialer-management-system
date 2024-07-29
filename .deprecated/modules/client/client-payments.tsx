import { CalendarDateRangePicker } from "@components/date-range-picker";
import { Pagination } from "@components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { usePageProps } from "@lib/context";
import { formatCurrency } from "@lib/utils";
import { ClientPageProps } from "@types";
import format from "date-fns/format";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { DateRange } from "react-day-picker";

const ClientPayments = () => {
  const {
    payments,
    paymentsDateRange: { from, to },
  } = usePageProps<ClientPageProps>();

  const router = useRouter();

  const onPageChange = (page: number) => {
    router.push({ ...router, query: { ...router.query, page } });
  };

  const currentPage = router.query?.page || 1;

  const onSelectDateRange = (dateRange: DateRange) => {
    if (dateRange.from && dateRange.to) {
      router.push({
        ...router,
        query: {
          ...router.query,
          from: format(dateRange.from, "yyy-MM-dd"),
          to: format(dateRange.to, "yyy-MM-dd"),
        },
      });
    }
  };

  return (
    <div>
      <div className="py-4 flex justify-between w-full items-center">
        <h2 className="text-2xl font-bold tracking-tight capitalize">
          Payments
        </h2>
        <CalendarDateRangePicker
          from={new Date(from)}
          to={new Date(to)}
          onSetDate={onSelectDateRange}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment</TableHead>
              <TableHead>Collector</TableHead>
              <TableHead>Payment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments && payments.length ? (
              payments.map(
                (
                  {
                    balance,
                    collector_first_name,
                    collector_id,
                    payment_date,
                    total_payments,
                  },
                  idx
                ) => (
                  <TableRow key={idx}>
                    <TableCell>{formatCurrency(total_payments)}</TableCell>
                    <TableCell>
                      <Link
                        className="underline"
                        href={`/collectors/${collector_id}`}
                        title={collector_first_name}
                      >
                        {collector_first_name}
                      </Link>
                    </TableCell>
                    <TableCell>{payment_date}</TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {payments && payments.length > 0 && (
        <div className="py-6 flex justify-center md:justify-end">
          <Pagination
            totalPages={100}
            currentPage={Number(currentPage)}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ClientPayments;
