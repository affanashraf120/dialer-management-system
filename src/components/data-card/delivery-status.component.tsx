import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/card";
import { Skeleton } from "@components/skeleton";

export default function Component(props: {
  deliveryStatuses?: DeliveryStatusResponse;
  showSkeleton?: boolean;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delivery Status</CardTitle>
        {props.showSkeleton ? (
          <Skeleton className="h-4 w-1/3 rounded-none" />
        ) : (
          <CardDescription>{props.deliveryStatuses?.date || 0}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageIcon className="w-6 h-6 text-green-500" />
            <span className="font-medium">Delivered</span>
          </div>
          {props.showSkeleton ? (
            <Skeleton className="h-6 w-1/4 rounded-none" />
          ) : (
            <span className="font-semibold text-green-500">
              {props.deliveryStatuses?.delivered || 0}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlaneIcon className="w-6 h-6 text-blue-500" />
            <span className="font-medium">Sent</span>
          </div>
          {props.showSkeleton ? (
            <Skeleton className="h-6 w-1/4 rounded-none" />
          ) : (
            <span className="font-semibold text-green-500">
              {props.deliveryStatuses?.sent || 0}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BoxIcon className="w-6 h-6 text-red-500" />
            <span className="font-medium">Undelivered</span>
          </div>
          {props.showSkeleton ? (
            <Skeleton className="h-6 w-1/4 rounded-none" />
          ) : (
            <span className="font-semibold text-green-500">
              {props.deliveryStatuses?.undelivered || 0}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BoxIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function PackageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function PlaneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}
