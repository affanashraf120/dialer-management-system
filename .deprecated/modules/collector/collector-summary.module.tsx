import { DataCard } from "@components/data-card";
import { usePageProps } from "@lib/context";
import { formatCurrency } from "@lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CollectorPageProps } from "@types";
import {
  DollarSign,
  MailCheck,
  MessageSquare,
  Percent,
  PhoneCall,
} from "lucide-react";
import React from "react";
import { dashboardClient } from "../../config/httpClient";
import { useRouter } from "next/router";

export interface SuccessRateResponse {
  number_success: number;
  number_debts: number;
  success_rate: number;
}

const CollectorSummary = () => {
  const { collectorSummary, totalPayment } = usePageProps<CollectorPageProps>();

  const router = useRouter();

  const collectorId = router.query?.id as string;
  const { data: successRateResponse, isLoading: isSuccessRateResponseLoading } =
    useQuery({
      queryKey: ["success-rate-of-collection-attempts", collectorId],
      queryFn: () =>
        dashboardClient
          .get<SuccessRateResponse>("/success-rate-of-collection-attempts", {
            params: {
              collector_id: collectorId,
            },
          })
          .then((res) => res.data),
    });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
      <DataCard
        title="Total Payments"
        data={formatCurrency(totalPayment) || `$0`}
        icon={DollarSign}
        description="Total payment collected by the collector"
      />
      <DataCard
        title="Success Rate"
        showSkeleton={isSuccessRateResponseLoading}
        data={
          successRateResponse?.success_rate
            ? `${successRateResponse.success_rate.toLocaleString()}%`
            : "-"
        }
        icon={Percent}
        description="Success rate of collection attempts"
      />
      <DataCard
        title="Total Emails"
        data={collectorSummary.emails_sent}
        icon={MailCheck}
        description="Total email sent by the collector"
      />
      <DataCard
        title="Total Calls"
        data={collectorSummary.calls_made}
        icon={PhoneCall}
        description="Total calls made by the collector"
      />
      <DataCard
        title="Total SMS"
        data={collectorSummary.sms_sent}
        icon={MessageSquare}
        description="Total sms sent by the collector"
      />
    </div>
  );
};

export default CollectorSummary;
