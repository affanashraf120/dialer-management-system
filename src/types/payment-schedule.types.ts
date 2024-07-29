export interface PaymentSchedule {
  id: string;
  setting_id: string;
  update_user: string;
  next_payment_fee: string;
  total_expected_fee: string;
  number_of_payments: string;
  company_id: string;
  memo: string;
  create_date: string;
  next_payment_amount: string;
  total_expected_amount: string;
  billing_last_four: string;
  account_number: string;
  email_address: string;
  update_date: string;
  next_payment_total: string;
  pending_count: string;
  billing_card: Billingcard;
  status: string;
  send_receipt_to_email_address: boolean;
  request_payment_data: boolean;
  next_payment_date: string;
  collected_count: string;
  custom_receipt_labels: Customreceiptlabels;
  s_uuid: string;
  payment_method: string;
  origin: string;
  send_authorization_request: boolean;
  collected_fee: string;
  unsuccessful_count: string;
  custom_render_labels: Customrenderlabels;
  payment_method_token: string;
  recurrence_rule: string;
  owed_amount: string;
  collected_amount: string;
  total_expected_count: string;
  round_trip_map: Roundtripmap;
  first_name: string;
  create_user: string;
  pending_fee: string;
  unsuccessful_fee: string;
  initial_payment_amount: string;
  payments: Payment[];
  last_name: string;
  pending_amount: string;
  unsuccessful_amount: string;
  payment_amount: string;
  schedule_history_list: Schedulehistorylist[];
}

interface Schedulehistorylist {
  date: string;
  event: string;
  eventId: number;
  user: string;
  isNew: boolean;
}

interface Payment {
  paymentId: number;
  status: string;
  feeAmount: number;
  paymentAmount: number;
  totalAmount: number;
  paymentDate: string;
  arrivalId?: number;
  transactionId?: number;
  paymentAttempts?: PaymentAttempt[];
}

interface PaymentAttempt {
  paymentAttemptId: number;
  arrivalId: number;
  transactionId: number;
  attemptDate: string;
  status: string;
}

interface Roundtripmap {
  myField1: string;
}

interface Customrenderlabels {
  SCHEDULE_STATUS: string;
}

interface Customreceiptlabels {
  PAYMENT: string;
  ACCOUNT_NUMBER: string;
  MEMO: string;
  BANK_ACCOUNT_TYPE: string;
}

interface Billingcard {
  cardToken: string;
  cardType: string;
  expirationMonth: number;
  expirationYear: number;
  accountDirective: string;
}