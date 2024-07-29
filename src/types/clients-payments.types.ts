export interface ClientsPaymentsResponse {
  payments?: ClientsPayments[];
  status?: string;
  message?: string;
  pagination?: any;
}

export interface ClientsPayments {
  transaction_origin: "string";
  id: 0;
  account_number: "string";
  transaction_type: "string";
  check_number: "string";
  transaction_status: "string";
  money_order_number: "string";
  payment_amount: 0;
  transaction_amount: 0;
  failure_reason: "string";
  payment_date: "2023-12-25";
  ach_id: "string";
  statement_date: "string";
  payment_type: "string";
  ach_status: "string";
  statement_id: "string";
  a_r_trans_id: 0;
  refund: "string";
  remitted: 0;
  processing_fee: 0;
  memo_json: any;
  memo: any;
}
