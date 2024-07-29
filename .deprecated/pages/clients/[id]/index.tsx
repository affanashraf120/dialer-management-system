import { withAuth } from "@lib/hof";
import { getDateRange } from "@lib/utils";
import { ClientModule } from "@modules/client";
import { ClientService } from "@services/client.service";
import { ClientProps } from "@types";
import React from "react";

const ClientPage = () => {
  return <ClientModule />;
};

export default ClientPage;

export const getServerSideProps = withAuth<ClientProps>(
  async ({ accessToken, ctx: { query } }) => {
    const {
      id: clientId,
      from,
      to,
      page,
    } = query as {
      id: string;
      from?: string;
      to?: string;
      page?: string;
    };

    if (page) {
      const parsedPageNumber = Number(page);
      if (Number.isNaN(parsedPageNumber) || parsedPageNumber < 1) {
        return {
          redirect: {
            destination: `/clients/${clientId}`,
            permanent: false,
          },
        };
      }
    }

    const { startDate, endDate } = getDateRange({
      from,
      to,
      subDuration: { months: 1 },
    });

    const clientService = new ClientService(accessToken);

    const [summary, payments] = await Promise.all([
      clientService.getClientSummary(clientId),
      clientService.getClientPayments({
        id: clientId,
        from: startDate,
        to: endDate,
        page,
      }),
    ]);

    return {
      props: {
        summary,
        payments,
        paymentsDateRange: {
          from: startDate,
          to: endDate,
        },
      },
    };
  }
);
