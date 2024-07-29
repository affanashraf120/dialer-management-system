export interface NewBusinessMetrics {
  number_of_new_clients: number;
  number_of_new_accounts: number;
  total_balance: string;
  new_clients: NewClient[];
}

export interface NewClient {
  client_id: string;
  active_accounts_initial_balance: number;
  active_accounts_current_balance: number;
  total_active_accounts: number;
  all_accounts_initial_balance: number;
  all_accounts_current_balance: number;
  total_accounts: number;
}
