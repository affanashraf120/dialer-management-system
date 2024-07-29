import DashboardLayout from "@components/dashboard-layout";
import AuthManager from "@lib/hof/withAuth";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

const Clientschedules = dynamic(
  () =>
    import("@modules/clients-scheduled").then(
      (mod) => mod.ClientsScheduledView
    ),
  {
    ssr: false,
  }
);

const PaymentReport = () => {
  return (
    <DashboardLayout title="Clients Scheduled" showDateRange={true}>
      <Clientschedules />
    </DashboardLayout>
  );
};

export default PaymentReport;

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
