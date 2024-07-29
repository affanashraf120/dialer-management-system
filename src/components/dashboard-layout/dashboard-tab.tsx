import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import { useRouter } from "next/router";
import React from "react";

const tabList = [
  {
    label: "Overview",
    value: "/",
  },
  {
    label: "Payment Report",
    value: "/payment-report",
  },
];

const DashboardTab = () => {
  const router = useRouter();

  return (
    <Tabs
      value={router.pathname}
      className="w-[400px] mt-6"
      onValueChange={(value) => {
        router.push(value);
      }}
    >
      <TabsList>
        {tabList.map(({ label, value }, idx) => (
          <TabsTrigger value={value} key={idx}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default DashboardTab;
