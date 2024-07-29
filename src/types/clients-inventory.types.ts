export interface ClientsInventory {
  client_id: string;
  client_name: string;
  total_agency_payments: number;
  total_client_payments: number;
  total_current_balance: number;
  total_initial_balance: number;
  total_payments: number;
}

export interface ClientPagination {
  count: number;
  next: string;
  previous: string;
}
