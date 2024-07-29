import { useAuth, usePageProps } from "@lib/context";
import { UserDetails } from "../types/misc.types";
import axios from "axios";
import { useAppContext } from "@lib/context/app-context";
import { siteConfig } from "./site";
import { useEffect } from "react";

export const dashboardClient = axios.create({
  baseURL: "/api/main",
});

export const communicationClient = axios.create({
  baseURL: "https://communicationsapi-production.up.railway.app",
});

export const useCommunicationClient = () => {
  return {
    reportingClient: axios.create({
      baseURL: "/reporting",
    }),
    smsClient: axios.create({
      baseURL: "/sms",
    }),
    emailClient: axios.create({
      baseURL: "/email",
    }),
  };
};

export const useHttpClient = () => {
  // const { accessToken } = useAuth();

  const { selectedAgency } = useAppContext();

  const {
    user: { access_token },
  } = usePageProps<{ user: UserDetails }>();

  return {
    searchClient: axios.create({
      baseURL: "https://search.collecteasy.ai/search",
      headers: {
        "x-agency": "ICS",
        Authorization: `Bearer ${access_token}`,
      },
    }),

    leadsClient: axios.create({
      baseURL: "/api/leads",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

    adminApiClient: axios.create({
      baseURL: `/v1/${selectedAgency.value}/admin/`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

    paymentApiClient: axios.create({
      baseURL: `/v1/${selectedAgency.value}/payment-server`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

    telephonyApiClient: axios.create({
      baseURL: "/api/telephony/",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

    dialerApiClient: axios.create({
      baseURL:
        selectedAgency.value === siteConfig.agencies.ics.value
          ? process.env.NEXT_PUBLIC_ICS_DIALER_API_BASE_URL
          : process.env.NEXT_PUBLIC_ARR_DIALER_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

    enableQuery: !!access_token && !!selectedAgency?.value,
  };
};
