import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../config/httpClient";

interface IuseGetCallSummary {
  params: {
    fromDate: string;
    toDate: string;
  };
}

export const useGetCallSummary = ({
  params: { fromDate, toDate },
}: IuseGetCallSummary) => {
  const { dialerApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["call-summary", fromDate, toDate],
    queryFn: () =>
      dialerApiClient
        .get<CallSummary>("/v1/analytics/call/summary", {
          params: {
            fromDate,
            toDate,
          },
        })
        .then((res) => res.data),
  });

  return {
    callSummary: data,
    isFetchingCallSummary: isLoading,
  };
};

export const useGetAgentsCallSummary = ({
  params: { fromDate, toDate },
}: IuseGetCallSummary) => {
  const { dialerApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["call-summary-agents", fromDate, toDate],
    queryFn: () =>
      dialerApiClient
        .get<AgnentCallSummary[]>("/v1/analytics/call/summary/agents", {
          params: {
            fromDate,
            toDate,
          },
        })
        .then((res) => res.data),
  });

  return {
    callSummary: data,
    isFetchingCallSummary: isLoading,
  };
};

export const useGetAllCallLogs = ({
  fromDate,
  toDate,
  page,
  callDirection,
}: {
  fromDate: string;
  toDate: string;
  page: number;
  callDirection?: string;
}) => {
  const { dialerApiClient } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["call-summary-agents", fromDate, toDate, page, callDirection],
    queryFn: () =>
      dialerApiClient
        .get<{ logs: CallLog[]; total: number }>("/v1/call/logs", {
          params: {
            fromDate: new Date(fromDate).toISOString(),
            toDate: new Date(toDate).toISOString(),
            page,
            limit: 15,
            sort: "dateCreated",
            order: "desc",
            callDirection,
          },
        })
        .then((res) => res.data),
  });

  return {
    logs: data?.logs ?? [],
    total: data?.total ?? 0,
    totalPages: data?.total ? Math.ceil(data.total / 15) : 0,
    isFetchingLogs: isLoading,
  };
};

export const useGetCallRecordings = (sid?: string) => {
  const { dialerApiClient, enableQuery } = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ["call-recording", sid],
    queryFn: () =>
      dialerApiClient
        .get<Recording[]>(`/v1/call/recordings/${sid}`)
        .then((res) => res.data),
    enabled: !!enableQuery && !!sid,
  });

  return {
    recordings: data,
    isFetchingRecordings: isLoading,
  };
};
