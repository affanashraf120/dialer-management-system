import { Badge } from "@components/badge";
import { Button } from "@components/button";
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
import { ClientsPageProps } from "@types";
import Link from "next/link";
import { useRouter } from "next/router";

const ClientsModule = () => {
  const { clients } = usePageProps<ClientsPageProps>();
  const router = useRouter();

  const onPageChange = (page: number) => {
    router.push({ ...router, query: { ...router.query, page } });
  };

  const currentPage = router.query?.page || 1;

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight capitalize">
        All Clients
      </h2>
      <div className="w-full rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Client Status</TableHead>
              <TableHead>Account Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.data.map(
              ({ client_id, client_name, account_balance, active_client }) => (
                <TableRow key={client_id}>
                  <TableCell>
                    <Link
                      className="underline"
                      href={`/clients/${client_id}`}
                      title={client_name}
                    >
                      {client_id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="underline"
                      href={`/clients/${client_id}`}
                      title={client_name}
                    >
                      {client_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(account_balance)}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center flex-col md:flex-row md:justify-between mt-4 gap-4">
        <div className="text-sm">
          Showing {currentPage} of {clients.total}{" "}
          {clients.total > 1 ? "Pages" : "Page"}
        </div>
        <Pagination
          totalPages={clients.total}
          currentPage={Number(currentPage)}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default ClientsModule;
