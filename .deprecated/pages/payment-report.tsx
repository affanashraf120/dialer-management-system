import { useQueries } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { dashboardClient } from "../../src/config/httpClient";
import { formatCurrency, getPercentage, isValidDateString } from "@lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@components/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/router";
import startOfMonth from "date-fns/startOfMonth";
import format from "date-fns/format";
import { CalendarDateRangePicker } from "@components/date-range-picker";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { withAuth } from "@lib/hof";

const paymentOptions = [
  {
    label: "Direct Pay",
    value: "direct_pay",
  },
  {
    label: "Check",
    value: "check",
  },
  {
    label: "Money Order",
    value: "money_order",
  },
  {
    label: "IDP",
    value: "IDP",
  },
  {
    label: "Refund",
    value: "refund",
  },
  {
    label: "Chargeback",
    value: "chargeback",
  },
  {
    label: "Adjustment",
    value: "adjustment",
  },
  {
    label: "Others",
    value: "other",
  },
];

const pieColors: string[] = [
  "#E57373", // Red
  "#81C784", // Green
  "#64B5F6", // Blue
  "#FFD54F", // Yellow
  "#BA68C8", // Purple
  "#FF8A65", // Deep Orange
  "#4DB6AC", // Teal
  "#A1887F", // Brown
];

interface PaymentResponse {
  total_payments: number;
}

const PaymentReport = () => {
  const router = useRouter();

  const queryFrom = router.query.from as string;
  const queryTo = router.query.to as string;
  const startDate = "2023-07-18";
  const endDate = "2023-08-18";

  const { from, to } = useMemo(() => {
    if (!isValidDateString(queryFrom) || !isValidDateString(queryTo)) {
      const fallBackToDate = new Date();
      const fallBackFromDate = startOfMonth(fallBackToDate);

      return {
        from: format(fallBackFromDate, "yyy-MM-dd"),
        to: format(fallBackToDate, "yyy-MM-dd"),
      };
    }

    return {
      from: queryFrom,
      to: queryTo,
    };
  }, [queryFrom, queryTo]);

  const queryResult = useQueries({
    queries: paymentOptions.map(({ value }) => ({
      queryFn: () =>
        dashboardClient
          .get<PaymentResponse>("/total-ammount", {
            params: {
              payment_type: value,
              start_date: from,
              end_date: to,
            },
          })
          .then((res) => res.data),
      queryKey: ["payment", value, from, to],
    })),
  });

  const { sum, isLoading } = useMemo(() => {
    let sum = 0;
    let count = 0;

    queryResult.forEach((result) => {
      if (result.data) {
        sum += result.data.total_payments;
        count++;
      }
    });

    return {
      sum,
      isLoading: count !== paymentOptions.length,
    };
  }, [queryResult]);

  const { paymentData, graphData } = useMemo(() => {
    let paymentData: {
      label: string;
      value: string;
      amount: number;
      percent: number;
    }[] = [];

    if (!isLoading) {
      paymentData = paymentOptions.map((option, idx) => {
        const amount = queryResult[idx].data?.total_payments ?? 0;
        const percent = getPercentage(amount, sum);
        return {
          ...option,
          amount,
          percent,
        };
      });
    }

    return {
      paymentData,
      graphData: paymentData.filter((data) => data.amount !== 0),
    };
  }, [isLoading, queryResult, sum]);

  const onSelectDateRange = (dateRange: DateRange) => {
    if (dateRange.from && dateRange.to) {
      router.push({
        ...router,
        query: {
          ...router.query,
          from: format(dateRange.from, "yyy-MM-dd"),
          to: format(dateRange.to, "yyy-MM-dd"),
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed w-full h-screen top-0 left-0 bg-background/40 z-[100] flex items-center justify-center backdrop-blur-sm">
        <Loader2 size={80} className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Total Payments: {formatCurrency(sum)}
        </h2>
        <CalendarDateRangePicker
          from={new Date(from)}
          to={new Date(to)}
          onSetDate={onSelectDateRange}
        />
      </div>
      <div className="grid grid-cols-5 gap-6">
        <Card className="col-span-3">
          <CardContent className="pt-6">
            <ResponsiveContainer width={"100%"} height={400}>
              <BarChart data={graphData}>
                <Tooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    return (
                      <>
                        {active && payload && label && (
                          <Card>
                            <div className="py-1 px-2 border-b font-bold">
                              {label}
                            </div>
                            <div className="p-2">
                              Amount:{" "}
                              {formatCurrency(payload[0].payload.amount)}
                            </div>
                          </Card>
                        )}
                      </>
                    );
                  }}
                />
                <XAxis dataKey="label" />
                <YAxis dataKey="amount" />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="amount" fill="#4338ca" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="pt-6">
            <ResponsiveContainer width={"100%"} height={400}>
              <PieChart>
                <Pie
                  nameKey={"label"}
                  data={graphData}
                  dataKey="percent"
                  style={{ outline: "none" }}
                  innerRadius={100}
                  outerRadius={120}
                  label={({ value }) => `${value}%`}
                  paddingAngle={5}
                >
                  {graphData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Legend iconType="line" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Percent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentData.map((data) => (
              <TableRow key={data.value}>
                <TableCell>{data.label}</TableCell>
                <TableCell>{formatCurrency(data.amount)}</TableCell>
                <TableCell>{data.percent}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentReport;

export const getServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
