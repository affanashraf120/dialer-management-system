import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Layout } from "@components/layout";
import { useRouter } from "next/router";
import { PagePropsProvider } from "@lib/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@lib/context/auth-context";
// import "react-datepicker/dist/react-datepicker.css";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps,
}: AppProps & { initialSession: Session }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>

      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <PagePropsProvider initialProps={pageProps}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Layout
                isCommunicationPage={router.pathname.includes("communication")}
                isPublicPage={router.pathname === "/login"}
              >
                <Component {...pageProps} />
              </Layout>
            </AuthProvider>
          </QueryClientProvider>
        </PagePropsProvider>
      </SessionContextProvider>
    </>
  );
}
