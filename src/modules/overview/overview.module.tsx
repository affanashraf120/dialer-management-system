import DashboardLayout, {
  useDashboardDateRange,
} from "@components/dashboard-layout";
import {
  DataCard,
  DeliveryStatus,
  MostTrendingClients,
  PaymentCard,
} from "@components/data-card";
import { Pagination, usePagination } from "@components/pagination";
import {
  useGetMostDollarsPlacedByClient,
  useGetNewBusinesses,
  useGetPaidTodaysTrends,
  useGetTodaysPayment,
  useNewBusinessJobSummary,
} from "@lib/api";
import { useGetSMSDeliveryStatus } from "@services/reporting.service";
import { Briefcase, CreditCard, User } from "lucide-react";
import NewClientsHistoryTable from "./new-clients-table";
import { useEffect } from "react";

const OverviewModule = () => {
  const {
    start_date,
    end_date,
    isCurrentMonthSelected,
    startDateQueryParam,
    endDateQueryParam,
  } = useDashboardDateRange();

  const { selectedPage, onPageChange, offset, limit } = usePagination();

  const { totalPaymentAmountToday, isFetchingTotalPaymentAmountToday } =
    useGetTodaysPayment();

  const { isFetchingNewBusinessMetrics, newBusinessMetrics } =
    useNewBusinessJobSummary({
      start_date,
      end_date,
    });

  const { clients, isFetchingNewBusinesses } = useGetNewBusinesses({
    start_date,
    end_date,
    offset,
    limit,
  });

  const { directPay, cashCollections, isFetchingPaidTodaysTrends } =
    useGetPaidTodaysTrends();

  const { isFetchingMostDollarsPlacedByClient, ...rest } =
    useGetMostDollarsPlacedByClient();

  const { deliveryStatuses, isFetchingSMSDeliveryStatus } =
    useGetSMSDeliveryStatus();

  return (
    <DashboardLayout title="Overview">
      <div className="flex space-x-4">
        <div className="flex w-full lg:w-8/12 xl:w-9/12 flex-col space-y-4 ">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <DataCard
              title="Dollars Placed"
              icon={CreditCard}
              data={
                newBusinessMetrics
                  ? newBusinessMetrics.total_balance?.toLocaleString()
                  : "-"
              }
              showSkeleton={isFetchingNewBusinessMetrics}
            />
            <DataCard
              title="Client Activity"
              icon={Briefcase}
              data={
                newBusinessMetrics
                  ? newBusinessMetrics.number_of_new_clients?.toLocaleString()
                  : "-"
              }
              showSkeleton={isFetchingNewBusinessMetrics}
            />
            <DataCard
              title="New Accounts"
              icon={User}
              data={
                newBusinessMetrics
                  ? newBusinessMetrics.number_of_new_accounts?.toLocaleString()
                  : "-"
              }
              showSkeleton={isFetchingNewBusinessMetrics}
            />
            <div className="grid sm:grid-cols-2 sm:col-span-2 md:col-span-3 lg:hidden gap-4">
              <PaymentCard
                totalPaymentToday={totalPaymentAmountToday}
                directPay={directPay}
                cashCollection={cashCollections}
                showSkeleton={isFetchingPaidTodaysTrends}
              />
              <DeliveryStatus
                showSkeleton={isFetchingSMSDeliveryStatus}
                deliveryStatuses={
                  deliveryStatuses as DeliveryStatusResponse | undefined
                }
              />
              <MostTrendingClients
                {...rest}
                showSkeleton={isFetchingMostDollarsPlacedByClient}
              />
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold tracking-tight">New Clients</h2>
            <NewClientsHistoryTable
              isLoading={isFetchingNewBusinesses}
              newClients={clients}
            />
            <Pagination
              disableNextButton={!!clients?.length && clients.length < 15}
              currentPage={selectedPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>
        <div className="hidden lg:flex w-4/12 xl:3/12 flex-col space-y-4 mt-4">
          <PaymentCard
            totalPaymentToday={totalPaymentAmountToday}
            directPay={directPay}
            cashCollection={cashCollections}
            showSkeleton={isFetchingPaidTodaysTrends}
          />
          <DeliveryStatus
            showSkeleton={isFetchingSMSDeliveryStatus}
            deliveryStatuses={
              deliveryStatuses as DeliveryStatusResponse | undefined
            }
          />
          <MostTrendingClients
            {...rest}
            showSkeleton={isFetchingMostDollarsPlacedByClient}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OverviewModule;
