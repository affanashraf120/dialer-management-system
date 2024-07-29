import Head from "next/head";
import Header from "./header.component";
import { ThemeProvider } from "@components/theme-provider";
import { Toaster } from "@components/toast";
import { TailwindIndicator } from "@components/tailwind-indicator";
import PageSpinner from "./page-spinner";
import { AppContextProvider } from "@lib/context/app-context";
import { CommunicationLayout } from "@modules/communication";

interface LayoutProps {
  isPublicPage?: boolean;
  isCommunicationPage?: boolean;
  children: React.ReactNode;
}

const LayoutComponent = ({
  children,
  isPublicPage,
  isCommunicationPage,
}: LayoutProps) => {
  return (
    <AppContextProvider>
      <ThemeProvider attribute="classes" defaultTheme="light" enableSystem>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Toaster />
        <TailwindIndicator />
        <PageSpinner />
        {isPublicPage ? (
          children
        ) : (
          <div className="relative flex min-h-screen flex-col overflow-auto">
            <Header />
            {isCommunicationPage ? (
              <CommunicationLayout>{children}</CommunicationLayout>
            ) : (
              <div className="flex-1 container py-6">{children}</div>
            )}
          </div>
        )}
      </ThemeProvider>
    </AppContextProvider>
  );
};

export default LayoutComponent;
