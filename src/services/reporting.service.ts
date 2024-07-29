import { useQuery } from "@tanstack/react-query";
import { useCommunicationClient } from "../config/httpClient";

function groupByDate(data: DeliveryStatus[]) {
  return data.reduce(
    (
      acc: {
        [date: string]: {
          sent: number;
          delivered: number;
          undelivered: number;
        };
      },
      item
    ) => {
      const date = item.day;
      const status = item.status;
      const count = item.count;

      if (!acc[date]) {
        acc[date] = {
          sent: 0,
          delivered: 0,
          undelivered: 0,
        };
      }

      if (status === "sent") {
        acc[date].sent += count;
      } else if (status === "delivered") {
        acc[date].delivered += count;
      } else if (status === "undelivered") {
        acc[date].undelivered += count;
      }

      return acc;
    },
    {}
  );
}

function aggregateLatestDateCounts(
  data: DeliveryStatus[]
): DeliveryStatusResponse {
  // Find the latest date in the input data
  let latestDate = data.reduce((maxDate, entry) => {
    return entry.day > maxDate ? entry.day : maxDate;
  }, data[0].day);

  // Initialize an object to hold the aggregated counts for the latest date
  const result = { delivered: 0, undelivered: 0, sent: 0 };

  // Iterate over each object in the input array
  data.forEach((entry) => {
    const { day, status, count } = entry;

    // Aggregate counts only for the latest date
    if (day === latestDate) {
      result[status as "delivered" | "undelivered" | "sent"] += count;
    }
  });

  // Format the latest date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(latestDate));

  return { date: formattedDate, ...result };
}

export const useGetEmailDeliveryStatus = () => {
  const { reportingClient } = useCommunicationClient();
  const { data, isLoading } = useQuery({
    queryKey: ["email-delivery-status"],
    queryFn: () =>
      reportingClient
        .get<DeliveryStatus[]>(`/email/delivery_status`)
        .then((res) => res.data),
  });

  return {
    deliveryStatuses:
      data && data.length > 0 ? aggregateLatestDateCounts(data) : [],
    deliveryStatusesByDate: groupByDate(data || []) || [],
    isFetchingEmailDeliveryStatus: isLoading,
  };
};

export const useGetEmailPercentageByDomain = () => {
  const { reportingClient } = useCommunicationClient();
  const { data, isLoading } = useQuery({
    queryKey: ["email-delivery-percentage"],
    queryFn: () =>
      reportingClient
        .get<DeliveryPercentage[]>(`/email/delivery_percentage_by_domain`)
        .then((res) => res.data),
  });

  return {
    deliveryPercentages: data || [],
    isFetchingEmailDeliveryPercentages: isLoading,
  };
};

export const useGetSMSDeliveryStatus = () => {
  const { reportingClient } = useCommunicationClient();
  const { data, isLoading } = useQuery({
    queryKey: ["sms-delivery-status"],
    queryFn: () =>
      reportingClient
        .get<DeliveryStatus[]>(`/sms/delivery_status`)
        .then((res) => res.data),
  });

  return {
    deliveryStatuses:
      data && data.length > 0 ? aggregateLatestDateCounts(data) : [],
    deliveryStatusesByDate: groupByDate(data || []) || [],
    isFetchingSMSDeliveryStatus: isLoading,
  };
};

export const useGetSMSStatsByClient = ({
  from,
  to,
}: {
  from: string;
  to: string;
}) => {
  const { reportingClient } = useCommunicationClient();
  const { data, isLoading } = useQuery({
    queryKey: ["sms-client-stats"],
    queryFn: () =>
      reportingClient
        .get<ClientReport[]>(
          `/sms/stats_by_client?start_date=${from}&end_date=${to}&limit=5`
        )
        .then((res) => res.data),
  });

  return {
    reports: data || [],
    isFetchingSMSStatsByClient: isLoading,
  };
};

export const useGetEmailStatsByClient = () => {
  const { reportingClient } = useCommunicationClient();
  const { data, isLoading } = useQuery({
    queryKey: ["email-client-stats"],
    queryFn: () =>
      reportingClient
        .get<ClientReport[]>(`/email/stats_by_client`)
        .then((res) => res.data),
  });

  return {
    reports: data || [],
    isFetchingEmailStatsByClient: isLoading,
  };
};
