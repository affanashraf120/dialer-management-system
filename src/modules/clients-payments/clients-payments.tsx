import { Button } from "@components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/card";
import { useDashboardDateRange } from "@components/dashboard-layout";
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
import { useGetAllClientsPayments } from "@lib/api";
import { formatCurrency } from "@lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ClientsPayments } from "@types";
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

const columns: ColumnDef<ClientsPayments>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "account_number",
    header: "Account Number",
    cell: ({ row }) => <div>{row.getValue("account_number") ?? ""}</div>,
  },
  {
    accessorKey: "payment_amount",
    header: "Payment Amount",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("payment_amount"))}</div>
    ),
  },
  {
    accessorKey: "transaction_amount",
    header: "Transaction Amount",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("transaction_amount"))}</div>
    ),
  },
  {
    accessorKey: "processing_fee",
    header: "Processing Fee",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("processing_fee"))}</div>
    ),
  },
  {
    accessorKey: "payment_date",
    header: "Payment Date",
    cell: ({ row }) => <div>{row.getValue("payment_date")}</div>,
  },
  {
    accessorKey: "a_r_trans_id",
    header: "A R Transaction Id",
    cell: ({ row }) => <div>{row.getValue("a_r_trans_id")}</div>,
  },
  {
    accessorKey: "payment_type",
    header: "Payment Type",
    cell: ({ row }) => <div>{row.getValue("payment_type")}</div>,
  },
];

const ClientsPaymentsTableView = ({
  payments,
  isLoading,
}: {
  payments: ClientsPayments[];
  isLoading: boolean;
}) => {
  const table = useReactTable({
    data: payments ?? [],
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
                  !row.getValue("id") ||
                  ["9291291"].includes(row.getValue("id"))
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

const ClientsPaymentsGridView = ({
  payments,
  isLoading,
}: {
  payments: ClientsPayments[];
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

  if (!isLoading && payments.length === 0) {
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
      {payments?.map((payment, idx) => (
        <li key={idx}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Payment Id: {payment.id ?? "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <DataItem label="Payment Id" data={payment.id} />
              <DataItem
                label="Payment Amount"
                data={formatCurrency(payment.payment_amount)}
              />
              <DataItem
                label="Transaction Amount"
                data={formatCurrency(payment.transaction_amount)}
              />
              <DataItem label="Payment Date" data={payment.payment_date} />
              <DataItem
                label="Processing Fee"
                data={formatCurrency(payment.processing_fee)}
              />
              <DataItem label="Payment Type" data={payment.payment_type} />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};

export const ClientsPaymentsView = () => {
  const router = useRouter();

  const { start_date, end_date } = useDashboardDateRange();

  const selectedPage = useMemo(() => {
    const parsedPageNumber = Number(router.query["page"]);
    return isNaN(parsedPageNumber) ? 1 : parsedPageNumber;
  }, [router.query]);

  const { ClientsPayments, isFetchingClientsPayments } =
    useGetAllClientsPayments({
      offset: (selectedPage - 1) * 15,
      limit: 15,
      start_date,
      end_date,
      payment_type: "",
    });

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
          <ClientsPaymentsTableView
            payments={ClientsPayments ?? []}
            isLoading={isFetchingClientsPayments}
          />
        </TabsContent>
        <TabsContent value="grid">
          <ClientsPaymentsGridView
            payments={ClientsPayments ?? []}
            isLoading={isFetchingClientsPayments}
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
