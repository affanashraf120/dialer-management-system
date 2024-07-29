import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/search-params-tabs";
import AuthManager from "@lib/hof/withAuth";
import CallLogs from "@modules/call-logs";
import CallReport from "@modules/call-report";
import { GetServerSidePropsContext } from "next";

const Call = () => {
  return (
    <>
      <Tabs defaultValue="call-summary" className="w-full">
        <TabsList className="grid max-w-fit grid-cols-2 mb-5">
          <TabsTrigger value="call-summary">Call Summary</TabsTrigger>
          <TabsTrigger value="call-logs">Call Logs</TabsTrigger>
        </TabsList>
        <TabsContent
          className="h-[calc(100vh-9rem)] overflow-y-auto"
          value="call-summary"
        >
          <CallReport />
        </TabsContent>
        <TabsContent
          className="h-[calc(100vh-9rem)] overflow-y-auto"
          value="call-logs"
        >
          <CallLogs />
        </TabsContent>
      </Tabs>
    </>
  );
};

const authManager = new AuthManager();

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  authManager.authenticate(ctx);

export default Call;
