import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../../config/httpClient";
import { PaymentSchedule } from "@types";

export const useGetAllPaymentSchedules = ({
  offset = 0,
  limit = 10,
}: {
  offset?: number;
  limit?: number;
}) => {
  const { telephonyApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["payment-schedules", offset, limit],
    queryFn: () =>
      telephonyApiClient
        .get<{ data: PaymentSchedule[] }>("/payment/schedules", {
          params: { offset, limit },
        })
        .then((res) => res.data),
  });

  return {
    paymentSchedules: data?.data,
    isFetchingPaymentSchedules: isLoading,
  };
};
