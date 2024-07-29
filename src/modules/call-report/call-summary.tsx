import { DataCard } from "@components/data-card";
import React, { useMemo } from "react";
import { useHttpClient } from "../../config/httpClient";
import { useGetCallSummary } from "@services/dialer.service";
import { formatAvgPercentage, formatCallDuration } from "@lib/utils";
import dynamic from "next/dynamic";
import { useDateRangeOption } from "@components/date-range-option/date-range-option";

const CallSummaryCharts = dynamic(() => import("./call-summary-charts"), {
  ssr: false,
});

const CallSummary = () => {
  const { from, to } = useDateRangeOption({
    fromKey: "from",
    toKey: "to",
  });

  const { callSummary, isFetchingCallSummary } = useGetCallSummary({
    params: {
      fromDate: from,
      toDate: to,
    },
  });

  return (
    <div className="gap-6">
      <div className="col-span-3">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DataCard
            title="Total Calls"
            data={callSummary?.totalCalls ?? 0}
            showSkeleton={isFetchingCallSummary}
          />
          <DataCard
            title="Total Call Duration"
            data={
              callSummary?.totalCallDuration
                ? formatCallDuration(callSummary.totalCallDuration)
                : "0s"
            }
            description={`Avarage call duration ${
              callSummary?.averageCallDuration
                ? formatCallDuration(callSummary.averageCallDuration)
                : "0s"
            }`}
            showSkeleton={isFetchingCallSummary}
          />
          <DataCard
            title="Incoming Calls (Includes Missed Calls)"
            data={callSummary?.inComingCalls ?? 0}
            description={`Avarage incoming calls ${
              callSummary?.averageIncomingCalls
                ? formatAvgPercentage(callSummary.averageIncomingCalls)
                : "0%"
            }`}
            showSkeleton={isFetchingCallSummary}
          />
          <DataCard
            title="Outgoing Calls"
            data={callSummary?.outgoingCalls ?? 0}
            description={`Avarage outgoing calls ${
              callSummary?.averageOutgoingCallDuration
                ? formatAvgPercentage(callSummary.averageOutgoingCalls)
                : "0%"
            }`}
            showSkeleton={isFetchingCallSummary}
          />
          <DataCard
            title="Total Incoming Call Duration"
            data={
              callSummary?.totalIncomingCallDuration
                ? formatCallDuration(callSummary.totalIncomingCallDuration)
                : "0s"
            }
            description={`Avarage incoming call duration ${
              callSummary?.averageIncomingCallDuration
                ? formatCallDuration(callSummary.averageIncomingCallDuration)
                : "0s"
            }`}
            showSkeleton={isFetchingCallSummary}
          />

          <DataCard
            title="Total Outgoing Call Duration"
            data={
              callSummary?.totalOutgoingCallDuration
                ? formatCallDuration(callSummary.totalOutgoingCallDuration)
                : "0s"
            }
            description={`Avarage outgoing call duration ${
              callSummary?.averageOutgoingCallDuration
                ? formatCallDuration(callSummary.averageOutgoingCallDuration)
                : "0s"
            }`}
            showSkeleton={isFetchingCallSummary}
          />

          <DataCard
            title="Missed Calls"
            data={callSummary?.missedCalls ?? 0}
            description={`Avarage missed calls ${
              callSummary?.averageMissedCalls
                ? formatAvgPercentage(callSummary.averageMissedCalls)
                : "0%"
            }`}
            showSkeleton={isFetchingCallSummary}
          />
          <DataCard
            title="Unattended Missed Calls"
            data={callSummary?.unattendedMissedCalls ?? 0}
            description={`Avarage unattended missed calls ${
              callSummary?.averageUnattendedMissedCalls
                ? formatAvgPercentage(callSummary.averageUnattendedMissedCalls)
                : "0%"
            }`}
            showSkeleton={isFetchingCallSummary}
          />
        </div>
      </div>
      {callSummary && <CallSummaryCharts {...callSummary} />}
    </div>
  );
};

export default CallSummary;
