import DashboardLayout from "@components/dashboard-layout";
import { usePagination } from "@components/pagination";
import { PaginationExtended } from "@components/pagination/pagination-extended";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@components/table";
import AuthManager from "@lib/hof/withAuth";
import { formatCurrency } from "@lib/utils";
import { useGetClientInventory } from "@services/inventory.service";
import { GetServerSidePropsContext } from "next";

const InventorySummary = () => {
  const { selectedPage, onPageChange } = usePagination();

  const { summaries, isFetchingSummaries, totalPages } = useGetClientInventory({
    page_num: selectedPage,
  });

  return (
    <div>
      <div className="border rounded-md mt-6 text-xs">
        <Table>
          <TableHeader>
            <TableRow className="text-sm">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Agency Payments</TableHead>
              <TableHead>Client Payments</TableHead>
              <TableHead>Initial Balance</TableHead>
              <TableHead>Current Balance</TableHead>
              <TableHead>Total Payments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetchingSummaries && (
              <TableSkeleton columns={7} rows={25} cellClassName="py-2" />
            )}
            {!isFetchingSummaries &&
              summaries.length > 0 &&
              summaries?.map((summary, idx) => (
                <TableRow key={summary.client_id} className="text-xs">
                  <TableCell className="p-1 px-2">
                    {summary.client_id}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {summary.client_name}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCurrency(summary.total_agency_payments) || "-"}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCurrency(summary.total_client_payments) || "-"}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCurrency(summary.total_initial_balance) || "-"}
                  </TableCell>

                  <TableCell className="p-1 px-2">
                    {formatCurrency(summary.total_current_balance) || "-"}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCurrency(summary.total_payments) || "-"}
                  </TableCell>
                </TableRow>
              ))}
            {!isFetchingSummaries && summaries.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="py-12 text-center">
                  No summaries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center flex-col w-full mt-6 space-y-4">
          <PaginationExtended
            totalPages={totalPages}
            currentPage={selectedPage}
            onPageChange={onPageChange}
          />
          <p className="text-sm">
            Showing page {selectedPage} of {totalPages} pages
          </p>
        </div>
      )}
    </div>
  );
};

const ClientInventorySummary = () => (
  <DashboardLayout title="Inventory Summary" showDateRange={false}>
    <InventorySummary />
  </DashboardLayout>
);

export default ClientInventorySummary;

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
