import { Button } from "@components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/card";
import { DataItem } from "@components/data-card";
import { Pagination } from "@components/pagination";
import { Skeleton } from "@components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import { useGetAllPaymentSchedules } from "@lib/api";
import { formatCurrency } from "@lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PaymentSchedule } from "@types";
import {
  ArrowLeft,
  ArrowRight,
  FileX,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

const columns: ColumnDef<PaymentSchedule>[] = [
  {
    accessorKey: "account_number",
    header: "Account No",
    cell: ({ row }) => <div>{row.getValue("account_number")}</div>,
  },
  {
    accessorKey: "first_name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("first_name") ?? ""}</div>,
  },
  {
    accessorKey: "owed_amount",
    header: "Amount Owed",
    cell: ({ row }) => <div>{formatCurrency(row.getValue("owed_amount"))}</div>,
  },
  {
    accessorKey: "collected_amount",
    header: "Amount Paid",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("collected_amount"))}</div>
    ),
  },
  {
    accessorKey: "pending_amount",
    header: "Amount Pending",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("pending_amount"))}</div>
    ),
  },
  {
    accessorKey: "total_expected_count",
    header: "Number of payments",
    cell: ({ row }) => <div>{row.getValue("total_expected_count")}</div>,
  },
  {
    accessorKey: "collected_count",
    header: "Number of payments placed",
    cell: ({ row }) => <div>{row.getValue("collected_count")}</div>,
  },
  {
    accessorKey: "pending_count",
    header: "Number of payments Pending",
    cell: ({ row }) => <div>{row.getValue("pending_count")}</div>,
  },
  {
    accessorKey: "next_payment_amount",
    header: "Next Payment Amount",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("next_payment_amount"))}</div>
    ),
  },
  {
    accessorKey: "next_payment_date",
    header: "Next Payment Date",
    cell: ({ row }) => <div>{row.getValue("next_payment_date")}</div>,
  },
];

const PaymentSchedulesTableView = ({
  schedules,
  isLoading,
}: {
  schedules: PaymentSchedule[];
  isLoading: boolean;
}) => {
  const table = useReactTable({
    data: schedules ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className={
                  !row.getValue("account_number") ||
                  ["9291291"].includes(row.getValue("account_number"))
                    ? "hidden"
                    : ""
                }
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isLoading ? (
            <>
              {[...Array(10)].map((_, idx) => (
                <TableRow key={idx}>
                  {[...Array(columns.length)].map((_, idx) => (
                    <TableCell key={idx}>
                      <Skeleton className="w-full h-3 bg-gray-200 rounded-none max-w-[200px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const PaymentSchedulesGridView = ({
  schedules,
  isLoading,
}: {
  schedules: PaymentSchedule[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(12)].map((_, idx) => (
          <li key={idx}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  <Skeleton className="w-1/2 h-4 rounded-none" />
                </CardTitle>
                <Skeleton className="w-full h-2 rounded-none" />
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {[...Array(10)].map((_, idx) => (
                  <div key={idx}>
                    <Skeleton className="w-2/3 h-3 rounded-none" />
                    <Skeleton className="w-1/3 h-2 rounded-none mt-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    );
  }

  if (!isLoading && schedules.length === 0) {
    return (
      <div className="w-full py-24 text-center text-sm max-w-[400px] mx-auto">
        <FileX
          strokeWidth={1}
          className="mx-auto w-14 h-14 text-muted-foreground mb-1"
        />
        No results found. The data you requested is not available at this
        moment.
      </div>
    );
  }

  return (
    <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {schedules.map((schedule, idx) => (
        <li key={idx}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Account No: {schedule.account_number ?? "N/A"}
              </CardTitle>
              <CardDescription className="!text-xs">
                {schedule.first_name ?? ""} {schedule.last_name ?? ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <DataItem
                label="Amount Owed"
                data={formatCurrency(schedule.owed_amount)}
              />
              <DataItem
                label="Amount Paid"
                data={formatCurrency(schedule.collected_amount)}
              />
              <DataItem
                label="Amount Pending"
                data={formatCurrency(schedule.pending_amount)}
              />
              <DataItem
                label="Number of payments"
                data={schedule.total_expected_count}
              />
              <DataItem
                label="Number of payments placed"
                data={schedule.collected_count}
              />
              <DataItem
                label="Number of payments pending"
                data={schedule.pending_count}
              />
              <DataItem
                label="Next Payment Amount"
                data={formatCurrency(schedule.next_payment_amount)}
              />
              <DataItem
                label="Next Payment Date"
                data={schedule.next_payment_date}
              />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};

export const PaymentSchedules = () => {
  const router = useRouter();

  const selectedPage = useMemo(() => {
    const parsedPageNumber = Number(router.query["page"]);
    return isNaN(parsedPageNumber) ? 1 : parsedPageNumber;
  }, [router.query]);

  const { paymentSchedules, isFetchingPaymentSchedules } =
    useGetAllPaymentSchedules({ offset: (selectedPage - 1) * 15, limit: 15 });

  const isLargeDevice = useMediaQuery({
    query: "(min-width: 1024px)",
  });

  const onPageChange = (direction: "prev" | "next") => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: selectedPage + (direction === "prev" ? -1 : 1),
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <section className="mt-6 space-y-4">
      <Tabs
        key={isLargeDevice ? "table" : "grid"}
        defaultValue={isLargeDevice ? "table" : "grid"}
      >
        <TabsList className="ml-auto block max-w-fit">
          <TabsTrigger value="grid" className="p-2">
            <LayoutGrid className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="table" className="p-2">
            <TableIcon className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <PaymentSchedulesTableView
            schedules={paymentSchedules ?? []}
            isLoading={isFetchingPaymentSchedules}
          />
        </TabsContent>
        <TabsContent value="grid">
          <PaymentSchedulesGridView
            schedules={paymentSchedules ?? []}
            isLoading={isFetchingPaymentSchedules}
          />
        </TabsContent>
      </Tabs>
      <div className="flex items-center gap-2 justify-center w-full">
        <Button
          onClick={() => onPageChange("prev")}
          variant="outline"
          disabled={selectedPage === 1}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Prev
        </Button>
        <Button onClick={() => onPageChange("next")} variant="outline">
          Next
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
};
