import AuthManager from "@lib/hof/withAuth";
import { GetServerSidePropsContext } from "next";
import React from "react";

const PDCReport = () => {
  return <div></div>;
};

export default PDCReport;

const authManager = new AuthManager();
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);
