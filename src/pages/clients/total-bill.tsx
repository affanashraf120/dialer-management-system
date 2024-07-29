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
import { useGetTotalBillingThisMonth } from "@lib/api";
import AuthManager from "@lib/hof/withAuth";
import { formatCurrency } from "@lib/utils";
import { GetServerSidePropsContext } from "next";

const TotalBill = () => {
  const { selectedPage, limit, offset, onPageChange } = usePagination();

  const { records, totalPages, isFetchingTotalBillingThisMonth } =
    useGetTotalBillingThisMonth({
      offset: offset,
      limit: limit,
    });

  return (
    <div>
      <div className="border rounded-md mt-6 text-xs">
        <Table>
          <TableHeader>
            <TableRow className="text-sm">
              <TableHead>Client ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Fees</TableHead>
              <TableHead>Direct Pays</TableHead>
              <TableHead>Cash Collected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetchingTotalBillingThisMonth && (
              <TableSkeleton columns={5} rows={15} cellClassName="py-2" />
            )}
            {!isFetchingTotalBillingThisMonth &&
              records.length > 0 &&
              records?.map((record: any, idx: number) => (
                <TableRow key={idx} className="text-xs">
                  <TableCell className="p-1 px-2">
                    {record?.client_id}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {record?.client_name}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCurrency(record?.fees)}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCurrency(record?.direct_pays)}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCurrency(record?.cash_collected)}
                  </TableCell>
                </TableRow>
              ))}
            {!isFetchingTotalBillingThisMonth && records.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="py-12 text-center">
                  No records found
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

export default TotalBill;

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
