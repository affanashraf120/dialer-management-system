import React from "react";
import CollectorSummary from "./collector-summary.module";
import { usePageProps } from "@lib/context";
import { CollectorPageProps } from "@types";
import CollectorDebtStatusTable from "./collector-debt-status-table.module";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import CollectorPayments from "./collector-payments";
import { useRouter } from "next/router";

const CollectorModule = () => {
  const {
    collector: { fullName },
    collectorStatuses,
  } = usePageProps<CollectorPageProps>();

  const router = useRouter();
  const activeTab = router.query.tab as string;

  const handleTabClick = (tab: "status" | "payments") => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, tab } },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight capitalize">
          {fullName}
        </h2>
        <CollectorSummary />
      </div>
      <Tabs defaultValue={activeTab ?? "status"}>
        <TabsList>
          <TabsTrigger onClick={() => handleTabClick("status")} value="status">
            Status
          </TabsTrigger>
          <TabsTrigger
            onClick={() => handleTabClick("payments")}
            value="payments"
          >
            Payments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <CollectorDebtStatusTable />
        </TabsContent>
        <TabsContent value="payments">
          <CollectorPayments />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollectorModule;
