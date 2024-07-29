import DashboardLayout from "@components/dashboard-layout";
import AuthManager from "@lib/hof/withAuth";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

const ClientsPayments = dynamic(
  () =>
    import("@modules/clients-payments").then((mod) => mod.ClientsPaymentsView),
  {
    ssr: false,
  }
);

const PaymentReport = () => {
  return (
    <DashboardLayout title="Clients Payments" showDateRange={true}>
      <ClientsPayments />
    </DashboardLayout>
  );
};

export default PaymentReport;

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
