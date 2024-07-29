import DashboardLayout from "@components/dashboard-layout";
import { Skeleton } from "@components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/search-params-tabs";
import { usePageProps } from "@lib/context";
import AuthManager from "@lib/hof/withAuth";
import {
  ClientReport,
  DeliveryStatusTable,
  SendBulkEmail,
} from "@modules/communication";
import { useGetEmailTemplates } from "@services/email.service";
import {
  useGetEmailDeliveryStatus,
  useGetEmailPercentageByDomain,
  useGetEmailStatsByClient,
} from "@services/reporting.service";
import { ServerSideService } from "@services/server-side.service";
import { SendBulkEmailType, StatusDetail, UserDetails } from "@types";
import { GetServerSidePropsContext } from "next/types";
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

const Email = () => {
  const { debt_statuses } = usePageProps<{
    user: UserDetails;
    debt_statuses: StatusDetail[];
  }>();
  const { sendBulkEmail, isSendingBulkEmail } = useGetEmailTemplates();

  const { isFetchingEmailDeliveryStatus, deliveryStatusesByDate } =
    useGetEmailDeliveryStatus();

  const { reports, isFetchingEmailStatsByClient } = useGetEmailStatsByClient();

  const { deliveryPercentages, isFetchingEmailDeliveryPercentages } =
    useGetEmailPercentageByDomain();

  const handleSendBulkEmail = async (data: SendBulkEmailType) => {
    await sendBulkEmail(data);
  };
  return (
    <Tabs defaultValue="delivery-status" className="w-full">
      <div className="flex justify-between">
        <TabsList className="grid max-w-fit grid-cols-3 mb-5">
          <TabsTrigger value="delivery-status">Delivery Status</TabsTrigger>
          <TabsTrigger value="delivery-report">Delivery Report</TabsTrigger>
          <TabsTrigger value="client-report">Client Report</TabsTrigger>
        </TabsList>
        <SendBulkEmail
          loading={isSendingBulkEmail}
          onSend={handleSendBulkEmail}
          debt_statuses={debt_statuses}
        />
      </div>
      <TabsContent
        className="h-[calc(100vh-9rem)] overflow-y-auto"
        value="delivery-status"
      >
        <DeliveryStatusTable
          deliveryStatusesByDate={deliveryStatusesByDate}
          isFetchingDeliveryStatus={isFetchingEmailDeliveryStatus}
        />
      </TabsContent>
      <TabsContent
        className="h-[calc(100vh-9rem)] overflow-y-auto"
        value="delivery-report"
      >
        <DeliveryReportPercentage
          reports={deliveryPercentages}
          isFetchingStatsByClient={isFetchingEmailDeliveryPercentages}
        />
      </TabsContent>
      <TabsContent
        className="h-[calc(100vh-9rem)] overflow-y-auto"
        value="client-report"
      >
        <DashboardLayout title="Client Report">
          <ClientReport
            reports={reports}
            isFetchingStatsByClient={isFetchingEmailStatsByClient}
          />
        </DashboardLayout>
      </TabsContent>
    </Tabs>
  );
};

export default Email;

const columns: ColumnDef<ClientReportPercentage>[] = [
  {
    accessorKey: "domain",
    header: "Domain",
    cell: ({ row }) => <div>{row.getValue("domain") ?? ""}</div>,
  },
  {
    accessorKey: "total_emails_sent",
    header: "Total Emails Sent",
    cell: ({ row }) => <div>{row.getValue("total_emails_sent")}</div>,
  },
  {
    accessorKey: "successful_deliveries",
    header: "Successful Deliveries",
    cell: ({ row }) => <div>{row.getValue("successful_deliveries")}</div>,
  },
  {
    accessorKey: "delivery_percentage",
    header: "Delivery Percentage",
    cell: ({ row }) => <div>{row.getValue("delivery_percentage")}</div>,
  },
];

const ClientReportView = ({
  reports,
  isLoading,
}: {
  reports: ClientReportPercentage[];
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
  reports: ClientReportPercentage[];
  isFetchingStatsByClient: boolean;
}

function DeliveryReportPercentage({ reports, isFetchingStatsByClient }: Props) {
  return (
    <section className="mt-6 h-full space-y-4">
      <h1 className="font-bold text-2xl">Delivery Report</h1>

      <ClientReportView reports={reports} isLoading={isFetchingStatsByClient} />
    </section>
  );
}

const authManager = new AuthManager();

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { props } = await authManager.authenticate(ctx);

  const serverSideService = new ServerSideService(
    (props as any).user?.access_token
  );

  return {
    props: {
      user: (props as any).user,
      debt_statuses: await serverSideService.getAllStatuses(),
    },
  };
};
