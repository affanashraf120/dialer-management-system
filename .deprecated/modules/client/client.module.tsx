import { usePageProps } from "@lib/context";
import { ClientPageProps } from "@types";
import React from "react";
import ClientSummary from "./client-summary";
import ClientPayments from "./client-payments";

const ClientModule = () => {
  const {
    summary: { client_name },
  } = usePageProps<ClientPageProps>();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight capitalize">
          {client_name}
        </h2>
        <ClientSummary />
      </div>
      <div>
        <ClientPayments />
      </div>
    </div>
  );
};

export default ClientModule;
