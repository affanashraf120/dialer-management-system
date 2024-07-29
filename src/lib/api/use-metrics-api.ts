import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../../config/httpClient";
import {
  ClientsPaymentsResponse,
  ClientsPaymentsTopResponse,
  ClientsScheduled,
  NewBusinessMetrics,
  NewClient,
} from "@types";
import { useEffect } from "react";

export const useGetTodaysPayment = () => {
  const { adminApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["todays-payment"],
    queryFn: () =>
      adminApiClient
        .get<{ data: { total_amount_posted_today: number } }>(
          "/api/metrics/payments/summary"
        )
        .then((res) => res.data),
  });

  return {
    totalPaymentAmountToday: data?.data.total_amount_posted_today,
    isFetchingTotalPaymentAmountToday: isLoading,
  };
};

export const useGetPaidTodaysTrends = () => {
  const { adminApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["paid-todays-trends"],
    queryFn: () =>
      adminApiClient
        .get("/api/metrics/payments/paid_today_with_trends")
        .then((res) => res.data),
  });

  return {
    directPay: data?.data.direct_pay,
    cashCollections: data?.data.cash_collections,
    isFetchingPaidTodaysTrends: isLoading,
  };
};

export const useGetMostDollarsPlacedByClient = () => {
  const { adminApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["most-dollars-placed-by-client"],
    queryFn: () =>
      adminApiClient
        .get("/api/metrics/payments/most_dollars_placed_by_client")
        .then((res) => res.data?.data),
  });

  return {
    clientName: data?.client_name || "",
    clientNum: data?.client_num || "",
    dollarsCollected: data?.dollars_collected || 0,
    noOfAccounts: data?.no_of_accounts || 0,
    percentageCollected: data?.percentage_collected || 0,
    totalDollarPlaced: data?.total_dollar_placed || 0,
    isFetchingMostDollarsPlacedByClient: isLoading,
  };
};

export const useGetNewBusinesses = ({
  start_date,
  end_date,
  offset = 0,
  limit = 10,
}: {
  start_date: string;
  end_date: string;
  offset?: number;
  limit?: number;
}) => {
  const { adminApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["new-business", start_date, end_date, offset, limit],
    queryFn: () =>
      adminApiClient
        .get<{ data: NewClient[] }>("/api/metrics/business/clients", {
          params: { start_date, end_date, offset, limit },
        })
        .then((res) => res.data),
  });
  return {
    clients: data?.data,
    isFetchingNewBusinesses: isLoading,
  };
};

export const useNewBusinessJobSummary = (params: {
  start_date: string;
  end_date: string;
}) => {
  const { adminApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["new-business-summary", params.start_date, params.end_date],
    queryFn: () =>
      adminApiClient
        .get<{ data: NewBusinessMetrics }>(
          "/api/metrics/business/jobs/summary",
          {
            params,
          }
        )
        .then((res) => res.data),
  });

  return {
    newBusinessMetrics: data?.data,
    isFetchingNewBusinessMetrics: isLoading,
  };
};

export const useGetAllClientsScheduled = ({
  offset = 0,
  limit = 10,
  start_date,
  end_date,
}: {
  offset?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}) => {
  const { adminApiClient } = useHttpClient();
  const { data, isLoading } = useQuery({
    queryKey: ["clients-scheduled", offset, limit, start_date, end_date],
    queryFn: () =>
      adminApiClient
        .get<{ data: ClientsScheduled[] }>(
          "/api/metrics/payments/scheduled/clients",
          {
            params: { offset, limit, start_date, end_date },
          }
        )
        .then((res) => res.data),
  });

  return {
    clientsScheduled: data?.data,
    isFetchingClientsScheduled: isLoading,
  };
};

export const useGetTotalBillingThisMonth = ({
  offset = 0,
  limit = 25,
}: {
  offset?: number;
  limit?: number;
}) => {
  const { adminApiClient } = useHttpClient();
  const { data, isLoading } = useQuery({
    queryKey: ["total-billing-this-month", offset, limit],
    queryFn: () =>
      adminApiClient
        .get("/api/metrics/payments/total_billing_this_month", {
          params: { offset, limit },
        })
        .then((res) => res.data),
  });

  return {
    records: data?.data?.records,
    totalPages: data?.data?.total_records
      ? Math.ceil(data?.data?.total_records / 15)
      : 0,
    isFetchingTotalBillingThisMonth: isLoading,
  };
};

export const useGetAllClientsPayments = ({
  offset = 0,
  limit = 25,
  start_date,
  end_date,
  payment_type,
}: {
  offset?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  payment_type?: string;
}) => {
  const { adminApiClient } = useHttpClient();
  const { data, isLoading } = useQuery({
    queryKey: [
      "clients-payments",
      offset,
      limit,
      start_date,
      end_date,
      payment_type,
    ],
    queryFn: () =>
      adminApiClient
        .get<{ data: ClientsPaymentsResponse }>(
          "/api/metrics/client/payments",
          {
            params: { offset, limit, start_date, end_date, payment_type },
          }
        )
        .then((res) => res.data),
  });

  return {
    ClientsPayments: data?.data?.payments,
    isFetchingClientsPayments: isLoading,
  };
};

export const useGetAllClientsPaymentsTop = ({
  offset = 0,
  limit = 25,
  start_date,
  end_date,
  payment_type,
}: {
  offset?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  payment_type?: string;
}) => {
  const { adminApiClient } = useHttpClient();
  const { data, isLoading } = useQuery({
    queryKey: [
      "clients-payments",
      offset,
      limit,
      start_date,
      end_date,
      payment_type,
    ],
    queryFn: () =>
      adminApiClient
        .get<{ data: ClientsPaymentsTopResponse }>(
          "/api/metrics/client/payments/top",
          {
            params: { offset, limit, start_date, end_date, payment_type },
          }
        )
        .then((res) => res.data),
  });

  return {
    ClientsPaymentsTop: data?.data?.payments,
    isFetchingClientsPaymentsTop: isLoading,
  };
};
