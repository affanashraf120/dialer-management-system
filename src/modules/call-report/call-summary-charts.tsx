import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/card";
import { formatCallDuration } from "@lib/utils";
import React from "react";
import Chart from "react-apexcharts";

const CallSummaryCharts = ({
  inComingCalls,
  outgoingCalls,
  missedCalls,
  unattendedMissedCalls,
  totalIncomingCallDuration,
  totalOutgoingCallDuration,
}: CallSummary) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 col-span-5 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Call Direction Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Chart
            width={375}
            type="pie"
            series={[inComingCalls, outgoingCalls]}
            options={{
              labels: ["Incoming", "Outgoing"],
              colors: ["#087c6d", "#0d5f9e"],
              legend: {
                position: "bottom",
              },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Call Duration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Chart
            width={375}
            // height={375}
            // width={375}
            type="pie"
            series={[totalIncomingCallDuration, totalOutgoingCallDuration]}
            options={{
              labels: ["Incoming", "Outgoing"],
              colors: ["#087c6d", "#0d5f9e"],
              tooltip: {
                enabled: true,
                y: {
                  formatter: (val: number) => {
                    return formatCallDuration(val);
                  },
                },
              },
              legend: {
                position: "bottom",
              },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Missed Call Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Chart
            width={375}
            // height={500}
            // width={500}
            type="pie"
            series={[
              missedCalls - unattendedMissedCalls,
              unattendedMissedCalls,
            ]}
            options={{
              labels: ["Attended", "Unattended"],
              colors: ["#087c6d", "#0d5f9e"],
              legend: {
                position: "bottom",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CallSummaryCharts;
