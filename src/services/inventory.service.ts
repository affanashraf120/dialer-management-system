import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../config/httpClient";

export const useGetClientInventory = ({ page_num }: { page_num: number }) => {
  const { adminApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["client-inventory-summary", page_num],
    queryFn: () =>
      adminApiClient
        .get<{
          data: { client_inventory_summary: ClientsInventory[] };
          pagination: ClientPagination;
        }>("/api/client_management/client_inventory_summary", {
          params: {
            page_num,
          },
        })
        .then((res) => res.data),
  });

  return {
    summaries: data?.data.client_inventory_summary ?? [],
    total: data?.pagination.count ?? 0,
    totalPages: data?.pagination ? Math.ceil(data.pagination.count / 25) : 0,
    isFetchingSummaries: isLoading,
  };
};
