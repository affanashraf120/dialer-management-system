import { useDateRangeOption } from "@components/date-range-option/date-range-option";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import {
  formatAvgPercentage,
  formatCallDuration,
  getDateRange,
} from "@lib/utils";
import { useGetAgentsCallSummary } from "@services/dialer.service";
import React, { useMemo } from "react";

const AgentsCallSummary = () => {
  const { from, to } = useDateRangeOption({
    fromKey: "from",
    toKey: "to",
  });

  const { callSummary, isFetchingCallSummary } = useGetAgentsCallSummary({
    params: {
      fromDate: from,
      toDate: to,
    },
  });

  if (!callSummary) return null;

  return (
    <div className="mt-6 border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead>Agent</TableHead>
            <TableHead>Total Calls</TableHead>
            <TableHead>Total Call Duration</TableHead>
            <TableHead>Average Call Duration</TableHead>
            <TableHead>Total Incoming Calls</TableHead>
            <TableHead>Total Incoming Calls Duration</TableHead>
            <TableHead>Avarage Incoming Calls Duration</TableHead>
            <TableHead>Total Outgoing Calls</TableHead>
            <TableHead>Total Outgoing Calls Duration</TableHead>
            <TableHead>Avarage Outgoing Calls Duration</TableHead>
            <TableHead>Total Attended Missed Calls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {callSummary?.map(({ summary, agent }, idx) => (
            <TableRow key={idx}>
              <TableHead>{agent.email}</TableHead>
              <TableHead>{summary.totalCalls}</TableHead>
              <TableHead>
                {formatCallDuration(summary.totalCallDuration)}
              </TableHead>
              <TableHead>
                {formatCallDuration(summary.averageCallDuration)}
              </TableHead>
              <TableHead>
                {summary.inComingCalls} (
                {formatAvgPercentage(summary.averageIncomingCalls)})
              </TableHead>
              <TableHead>
                {formatCallDuration(summary.totalIncomingCallDuration)}
              </TableHead>
              <TableHead>
                {formatCallDuration(summary.averageIncomingCallDuration)}
              </TableHead>
              <TableHead>
                {summary.outgoingCalls} (
                {formatAvgPercentage(summary.averageOutgoingCalls)})
              </TableHead>
              <TableHead>
                {formatCallDuration(summary.totalOutgoingCallDuration)}
              </TableHead>
              <TableHead>
                {formatCallDuration(summary.averageOutgoingCallDuration)}
              </TableHead>
              <TableHead>{summary.missedCalls}</TableHead>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentsCallSummary;



