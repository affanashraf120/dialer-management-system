import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Skeleton } from "@components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { useGetSMSDeliveryStatus } from "@services/reporting.service";

interface Props {
  deliveryStatusesByDate: {
    [date: string]: {
      sent: number;
      delivered: number;
      undelivered: number;
    };
  };
  isFetchingDeliveryStatus: boolean;
}

export default function DeliveryStatusTable({
  deliveryStatusesByDate,
  isFetchingDeliveryStatus,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="w-full flex justify-between">
            <span>Daily Delivery Status</span>
            <div className="text-base flex gap-2 font-normal">
              <span className="flex items-center">
                <GreenDot />
                Delivered
              </span>
              <span className="flex items-center">
                <YellowDot />
                Sent
              </span>
              <span className="flex items-center">
                <RedDot />
                Undelivered
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isFetchingDeliveryStatus ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
          </div>
        ) : (
          <Table title="Daily Delivery Status">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Undelivered</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Object.entries(deliveryStatusesByDate).map(
                ([date, { sent, delivered, undelivered }]) => (
                  <TableRow key={date}>
                    <TableCell>{date}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <GreenDot />
                        {delivered}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <YellowDot />
                        {sent}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <RedDot />
                        {undelivered}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

const YellowDot = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
      fill="#D5CB0E"
    ></path>
  </svg>
);

const GreenDot = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
      fill="#1B930B"
    ></path>
  </svg>
);

const RedDot = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
      fill="#93170B"
    ></path>
  </svg>
);
