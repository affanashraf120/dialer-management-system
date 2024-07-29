import { OverviewModule } from "@modules/overview";
import AuthManager from "../lib/hof/withAuth";
import { GetServerSidePropsContext } from "next";

export default function Home() {
  return <OverviewModule />;
}

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
