export interface SendBulkSMSType {
  min_balance: number;
  schema: string;
  date_listed_start: string; // Note: This should be a date string
  date_listed_end: string; // Note: This should be a date string
  clients: {
    label: string;
    value: string;
  }[];
  dept_statuses: {
    label: string;
    value: string;
  }[];
}

export interface SendBulkEmailType {
  min_balance: number;
  schema: string;
  date_listed_start: string; // Note: This should be a date string
  date_listed_end: string; // Note: This should be a date string
  clients: {
    label: string;
    value: string;
  }[];
  dept_statuses: {
    label: string;
    value: string;
  }[];
}
