import DashboardLayout from "@components/dashboard-layout";
import AuthManager from "@lib/hof/withAuth";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

const ClientsPaymentsTop = dynamic(
  () =>
    import("@modules/clients-payments-top").then(
      (mod) => mod.ClientsPaymentsTopView
    ),
  {
    ssr: false,
  }
);

const PaymentsTop = () => {
  return (
    <DashboardLayout title="Clients Top Payments" showDateRange={true}>
      <ClientsPaymentsTop />
    </DashboardLayout>
  );
};

export default PaymentsTop;

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
