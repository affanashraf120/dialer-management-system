export interface ClientsPaymentsTopResponse {
  payments?: ClientsPaymentsTop[];
  status?: string;
  message?: string;
  pagination?: any;
}

export interface ClientsPaymentsTop {
  client_id: string;
  payment_amount: number;
}
