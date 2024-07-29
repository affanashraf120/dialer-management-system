import { DataCard } from "@components/data-card";
import { usePageProps } from "@lib/context";
import { formatCurrency } from "@lib/utils";
import { ClientPageProps } from "@types";
import { Banknote, DollarSign, MailCheck, MessageSquare, Users } from "lucide-react";
import React from "react";

const ClientSummary = () => {
  const {
    summary: {
      total_accounts,
      total_email_sent,
      total_text_sent,
      total_balance,
      total_payments,
    },
  } = usePageProps<ClientPageProps>();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
      <DataCard
        title="Total Accounts"
        data={total_accounts.toLocaleString()}
        icon={Users}
        description="Total accounts attached the collector"
      />
      <DataCard
        title="Total Balance"
        data={formatCurrency(total_balance) || `$0`}
        icon={Banknote}
        description="Total balance of the client"
      />
      <DataCard
        title="Total Payment"
        data={formatCurrency(total_payments) || `$0`}
        icon={DollarSign}
        description="Total payment collected for the client"
      />
      <DataCard
        title="Total Emails"
        data={total_email_sent.toLocaleString()}
        icon={MailCheck}
        description="Total email sent for the client"
      />

      <DataCard
        title="Total SMS"
        data={total_text_sent.toLocaleString()}
        icon={MessageSquare}
        description="Total sms sent for the client"
      />
    </div>
  );
};

export default ClientSummary;
