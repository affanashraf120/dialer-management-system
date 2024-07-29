interface ClientReport {
  client_name: string;
  failed_deliveries: number;
  successful_deliveries: number;
  total_messages_sent: number;
}

interface ClientReportPercentage {
  domain: string;
  total_emails_sent: number;
  successful_deliveries: number;
  delivery_percentage: number;
}
