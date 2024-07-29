interface DeliveryStatus {
  day: string;
  status: string;
  count: number;
}

interface DeliveryPercentage {
  domain: string;
  total_emails_sent: number;
  successful_deliveries: number;
  delivery_percentage: number;
}

interface DeliveryStatusResponse {
  date: string;
  delivered: number;
  sent: number;
  undelivered: number;
}
