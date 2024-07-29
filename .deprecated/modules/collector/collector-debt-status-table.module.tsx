import { Button } from "@components/button";
import { CalendarDateRangePicker } from "@components/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/dropdown";
import { Input } from "@components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { usePageProps } from "@lib/context";
import { createAccessorKeyHeaderObject } from "@lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CollectorDebtStatusPageDetails,
  CollectorPageProps,
  CollectorsPageProps,
} from "@types";
import format from "date-fns/format";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { DateRange } from "react-day-picker";

const columns: ColumnDef<CollectorDebtStatusPageDetails>[] = [
  {
    accessorKey: "debt_status_code",
    header: "Status Code",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("debt_status_code")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "number_debtors",
    header: "Total Debtors",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("number_debtors")}</div>
    ),
  },
];

const CollectorDebtStatusTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const {
    collectorStatuses,
    collectorStatusDateRange: { from, to },
  } = usePageProps<CollectorPageProps>();

  const table = useReactTable({
    data: collectorStatuses,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const router = useRouter();

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
    <div className="w-full">
      <div className="flex items-center py-4 justify-between gap-4">
        <Input
          placeholder="Filter status..."
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <CalendarDateRangePicker
          from={new Date(from)}
          to={new Date(to)}
          onSetDate={onSelectDateRange}
        />
      </div>
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} Statuses.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectorDebtStatusTable;
