import { User } from "@supabase/supabase-js";

export interface UserDetails extends User {
  user_metadata: {
    firstName: string;
    lastName: string;
    isAdmin?: boolean;
  };
  access_token: string;
}

export interface StatusDetail {
  id: number;
  status_code: string;
  status: string;
  description?: string;
  number_accounts: number;
}

export interface CollectorApiData {
  last_name?: string;
  id: number | string;
  first_name: string;
  email: string;
  middle_name?: string;
}

export interface Collector
  extends Omit<CollectorApiData, "first_name" | "last_name" | "middle_name"> {
  fullName: string;
}

export interface CollectorSummary {
  collector_id: number | string;
  emails_sent: number;
  sms_sent: number;
  calls_made: number;
}

export interface CollectorDebtStatusDetail {
  collector_id: number | string;
  debt_status_code: string;
  number_debtors: number;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  count: number;
  total: number;
  pagination: Pagination;
}

export interface Pagination {
  previous?: string;
  next?: string;
}

export interface ClientDetail {
  client_id: string;
  account_balance?: number;
  client_name: string;
  active_client?: any;
  contact_name?: string;
}

export interface CollectorPayment {
  collector_id: number;
  collector_email: string;
  collector_first_name: string;
  client_name: string;
  client_number: string;
  balance: number;
  total_payments: number;
  payment_date: string;
}

export interface CollectorTotalPayment {
  collector_id: number;
  collector_email: string;
  collector_first_name: string;
  total_balance: number;
  total_payments: number;
}

export interface ClientSummary {
  client_number: string;
  client_name: string;
  total_balance: number;
  total_payments: number;
  total_accounts: number;
  total_account: number;
  total_email_sent: number;
  total_text_sent: number;
}

/* -------------------------------------------------------------------------- */
/*                                 page props                                 */
/* -------------------------------------------------------------------------- */

export interface PageProps {
  user: UserDetails;
}

/* ------------------------------ overview page ----------------------------- */

export interface OverviewProps {
  totalDebts: number | string;
  totalClients: number | string;
  statuses: StatusDetail[];
  totalNewBusiness: number | string;
  totalAccountClosed: number | string;
}

export type OverviewPageProps = PageProps & OverviewProps;

/* ----------------------------- collectors page ---------------------------- */

export interface CollectorsProps {
  collectors: Collector[];
}

export type CollectorsPageProps = PageProps & CollectorsProps;

/* ----------------------------- collector page ----------------------------- */

export interface CollectorDebtStatusPageDetails
  extends CollectorDebtStatusDetail {
  status: string;
}

export interface CollectorProps {
  collector: Collector;
  collectorSummary: CollectorSummary;
  collectorStatuses: CollectorDebtStatusPageDetails[];
  totalPayment: number;
  collectorStatusDateRange: {
    from: string;
    to: string;
  };
}

export type CollectorPageProps = PageProps & CollectorProps;

/* ------------------------------ clients page ------------------------------ */
export interface ClientsProps {
  clients: {
    data: ClientDetail[];
    total: number;
    count: number;
  };
}

export type ClientsPageProps = PageProps & ClientsProps;

/* ------------------------------- client page ------------------------------ */
export interface ClientProps {
  summary: ClientSummary;
  payments: CollectorPayment[];
  paymentsDateRange: {
    from: string;
    to: string;
  };
}

export type ClientPageProps = PageProps & ClientProps;
