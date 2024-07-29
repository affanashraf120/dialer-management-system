import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Skeleton } from "@components/skeleton";
import { formatAvgPercentage, formatCurrency } from "@lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface PaymentCardProps {
  directPay: {
    today_amount: number;
    yesterday_amount: number;
    trend: number;
  };
  cashCollection: {
    today_amount: number;
    yesterday_amount: number;
    trend: number;
  };
  showSkeleton?: boolean;
  totalPaymentToday: number | undefined;
}

const TodayYesterdayStats = ({
  title,
  trend,
  today_amount,
  yesterday_amount,
  showSkeleton,
}: {
  title: string;
  trend: number;
  today_amount: number;
  yesterday_amount: number;
  showSkeleton?: boolean;
}) => {
  return showSkeleton ? (
    <div className="flex flex-col items-stretch px-6 py-4 gap-4">
      <h3>{title}</h3>
      <Skeleton className="w-full h-6 rounded-none" />
      <Skeleton className="w-full h-6 rounded-none" />
    </div>
  ) : (
    <div className="flex flex-col items-stretch w-full px-6 py-4 gap-4">
      <h3>{title}</h3>
      <div className="grid grid-cols-3 gap-6 items-center justify-items-start">
        <p className="text-base text-muted-foreground">Today</p>
        <p className="text-base font-medium">{formatCurrency(today_amount)}</p>
        <Trend trend={trend} />
      </div>
      <div className="grid grid-cols-3 gap-6 items-center justify-items-start">
        <p className="text-base text-muted-foreground">Yesterday</p>
        <p className="text-base font-medium">
          {formatCurrency(yesterday_amount)}
        </p>
        <Trend trend={trend} />
      </div>
    </div>
  );
};

const Pile = ({
  title,
  description,
  isCurrency,
  isPercentage,
}: {
  title: string;
  description: string | number;
  isCurrency?: boolean;
  isPercentage?: boolean;
}) => (
  <div>
    <p className="text-sm">{title}</p>
    <p className="font-bold">
      {typeof description == "number"
        ? isCurrency
          ? formatCurrency(description)
          : isPercentage
          ? formatAvgPercentage(description)
          : description
        : description}
    </p>
  </div>
);

interface MostTrendingClients {
  clientName: string;
  clientNum: string;
  dollarsCollected: number;
  noOfAccounts: number;
  percentageCollected: number;
  totalDollarPlaced: number;
  showSkeleton?: boolean;
}

export const MostTrendingClients = ({
  clientName,
  clientNum,
  dollarsCollected,
  noOfAccounts,
  percentageCollected,
  totalDollarPlaced,
  showSkeleton,
}: MostTrendingClients) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Most Dollars Placed by Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 py-4 gap-4">
          {showSkeleton ? (
            <>
              <Skeleton className="h-6 rounded-none" />
              <Skeleton className="h-6 rounded-none" />
              <Skeleton className="h-6 rounded-none" />
              <Skeleton className="h-6 rounded-none" />
              <Skeleton className="h-6 rounded-none" />
              <Skeleton className="h-6 rounded-none" />
            </>
          ) : (
            <>
              <Pile title="Client Number" description={clientNum} />
              <Pile title="Client Name" description={clientName} />
              <Pile title="Total Accounts" description={noOfAccounts} />
              <Pile
                title="Total Placed"
                isCurrency
                description={totalDollarPlaced}
              />
              <Pile
                title="Total Collected"
                isCurrency
                description={dollarsCollected}
              />
              <Pile
                title="Percentage Collected"
                description={`${percentageCollected.toFixed(2)}%`}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const PaymentCard = ({
  showSkeleton,
  directPay,
  cashCollection,
  totalPaymentToday,
}: PaymentCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Total Payment</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pb-4">
          {!totalPaymentToday ? (
            <Skeleton className="h-6 w-1/3 rounded-none" />
          ) : (
            <h2 className="font-bold">{formatCurrency(totalPaymentToday)}</h2>
          )}
        </div>
        <hr className="w-full" />
        <TodayYesterdayStats
          {...cashCollection}
          showSkeleton={showSkeleton}
          title="Cash Collection"
        />
        <hr className="w-full" />
        <TodayYesterdayStats
          {...directPay}
          showSkeleton={showSkeleton}
          title="Direct Pay"
        />
      </CardContent>
    </Card>
  );
};

const Trend = ({ trend }: { trend: number }) => (
  <p className="text-xs">
    {trend > 0 ? (
      <span className="flex items-center text-green-600">
        <ArrowUp className=" h-3 w-3" /> {trend}%
      </span>
    ) : (
      <span className="flex items-center text-red-600">
        <ArrowDown className=" h-3 w-3" /> {trend}%
      </span>
    )}
  </p>
);
