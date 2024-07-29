import React from "react";
import { NewClient } from "../../types/new-business.types";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn, formatCurrency } from "@lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { Skeleton } from "@components/skeleton";

const columns: ColumnDef<NewClient>[] = [
  {
    accessorKey: "client_id",
    header: "Client ID",
    cell: ({ row }) => <div>{row.getValue("client_id")}</div>,
  },
  {
    accessorKey: "active_accounts_initial_balance",
    header: "Total Initial Balance (Active)",
    cell: ({ row }) =>
      formatCurrency(row.getValue<number>("active_accounts_initial_balance")),
  },
  {
    accessorKey: "all_accounts_initial_balance",
    header: "Total Initial Balance",
    cell: ({ row }) =>
      formatCurrency(row.getValue<number>("all_accounts_initial_balance")),
  },
  {
    accessorKey: "active_accounts_current_balance",
    header: "Total Current Balance (Active)",
    cell: ({ row }) =>
      formatCurrency(row.getValue<number>("active_accounts_current_balance")),
  },
  {
    accessorKey: "all_accounts_current_balance",
    header: "Total Current Balance",
    cell: ({ row }) =>
      formatCurrency(row.getValue<number>("all_accounts_current_balance")),
  },
  {
    accessorKey: "total_active_accounts",
    header: "Total Accounts (Active)",
    cell: ({ row }) =>
      row.getValue<number>("total_active_accounts")?.toLocaleString() ?? "-",
  },
  {
    accessorKey: "total_accounts",
    header: "Total Accounts",
    cell: ({ row }) =>
      row.getValue<number>("total_accounts")?.toLocaleString() ?? "-",
  },
];

const NewClientsHistoryTable = ({
  newClients,
  isLoading,
}: {
  newClients?: NewClient[];
  isLoading: boolean;
}) => {
  const table = useReactTable({
    data: newClients ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
                    <TableCell
                      key={cell.id}
                      className={cn("text-[13px] font-medium")}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
    </div>
  );
};

export default NewClientsHistoryTable;
