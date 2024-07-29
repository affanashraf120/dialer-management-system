import DashboardLayout from "@components/dashboard-layout";
import AuthManager from "@lib/hof/withAuth";

import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

const PaymentSchedules = dynamic(
  () => import("@modules/payment-reports").then((mod) => mod.PaymentSchedules),
  {
    ssr: false,
  }
);

const PaymentReport = () => {
  return (
    <DashboardLayout title="Payment Schedules" showDateRange={false}>
      <PaymentSchedules />
    </DashboardLayout>
  );
};

export default PaymentReport;

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
 