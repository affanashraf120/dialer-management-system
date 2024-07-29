import DashboardLayout, {
  useDashboardDateRange,
} from "@components/dashboard-layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/search-params-tabs";
import { usePageProps } from "@lib/context";
import AuthManager from "@lib/hof/withAuth";
import { SendBulkSMS } from "@modules/communication";
import { ServerSideService } from "@services/server-side.service";
import { useGetSMSTemplates } from "@services/sms.service";
import { SendBulkSMSType } from "@types";
import { GetServerSidePropsContext } from "next";
import ClientReport from "../../modules/communication/client-report";
import DeliveryStatusTable from "../../modules/communication/delivery-status-table";
import { StatusDetail, UserDetails } from "../../types/misc.types";
import {
  useGetSMSDeliveryStatus,
  useGetSMSStatsByClient,
} from "@services/reporting.service";

const SMS = () => {
  const { debt_statuses } = usePageProps<{
    user: UserDetails;
    debt_statuses: StatusDetail[];
  }>();

  const { sendBulkSMS, isSendingBulkSMS } = useGetSMSTemplates();

  const { isFetchingSMSDeliveryStatus, deliveryStatusesByDate } =
    useGetSMSDeliveryStatus();

  const handleSendBulkSMS = async (data: SendBulkSMSType) => {
    await sendBulkSMS(data);
  };

  return (
    <>
      <div className="flex">
        <Tabs defaultValue="delivery-status" className="w-full">
          <div className="flex justify-between">
            <TabsList className="grid max-w-fit grid-cols-3 mb-5">
              <TabsTrigger value="delivery-status">Delivery Status</TabsTrigger>
              <TabsTrigger value="cost">Cost</TabsTrigger>
              <TabsTrigger value="client-report">Client Report</TabsTrigger>
            </TabsList>
            <SendBulkSMS
              loading={isSendingBulkSMS}
              onSend={handleSendBulkSMS}
              debt_statuses={debt_statuses}
            />
          </div>
          <TabsContent
            className="h-[calc(100vh-9rem)] overflow-y-auto"
            value="delivery-status"
          >
            <DeliveryStatusTable
              isFetchingDeliveryStatus={isFetchingSMSDeliveryStatus}
              deliveryStatusesByDate={deliveryStatusesByDate}
            />
          </TabsContent>
          <TabsContent
            className="h-[calc(100vh-9rem)] overflow-y-auto"
            value="cost"
          >
            <h1>Cost</h1>
          </TabsContent>
          <TabsContent
            className="h-[calc(100vh-9rem)] overflow-y-auto"
            value="client-report"
          >
            <ClientReportRange />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export const ClientReportRange = () => {
  const { start_date, end_date } = useDashboardDateRange();

  const { reports, isFetchingSMSStatsByClient } = useGetSMSStatsByClient({
    from: start_date,
    to: end_date,
  });
  return (
    <DashboardLayout title="Client Report" showDateRange>
      <ClientReport
        reports={reports}
        isFetchingStatsByClient={isFetchingSMSStatsByClient}
      />
    </DashboardLayout>
  );
};

export default SMS;

const authManager = new AuthManager();

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { props } = await authManager.authenticate(ctx);

  const serverSideService = new ServerSideService(
    (props as any).user?.access_token
  );

  return {
    props: {
      user: (props as any).user,
      debt_statuses: await serverSideService.getAllStatuses(),
    },
  };
};
