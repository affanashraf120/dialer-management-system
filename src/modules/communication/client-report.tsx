import { Skeleton } from "@components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columns: ColumnDef<ClientReport>[] = [
  {
    accessorKey: "client_name",
    header: "Client Name",
    cell: ({ row }) => <div>{row.getValue("client_name") ?? ""}</div>,
  },
  {
    accessorKey: "failed_deliveries",
    header: "Failed Deliveries",
    cell: ({ row }) => <div>{row.getValue("failed_deliveries")}</div>,
  },
  {
    accessorKey: "successful_deliveries",
    header: "Successful Deliveries",
    cell: ({ row }) => <div>{row.getValue("successful_deliveries")}</div>,
  },
  {
    accessorKey: "total_messages_sent",
    header: "Total Messages Sent",
    cell: ({ row }) => <div>{row.getValue("total_messages_sent")}</div>,
  },
];

const ClientReportView = ({
  reports,
  isLoading,
}: {
  reports: ClientReport[];
  isLoading: boolean;
}) => {
  const table = useReactTable({
    data: reports ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, i) => (
            <TableRow key={i}>
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
        <TableBody className="h-40 overflow-y-auto">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
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
              {[...Array(5)].map((_, idx) => (
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

interface Props {
  reports: ClientReport[];
  isFetchingStatsByClient: boolean;
}

export default function ClientReport({
  reports,
  isFetchingStatsByClient,
}: Props) {
  return (
    <section className="mt-6 h-full space-y-4">
      <ClientReportView reports={reports} isLoading={isFetchingStatsByClient} />
    </section>
  );
}
