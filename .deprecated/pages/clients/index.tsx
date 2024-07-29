import { withAuth } from "@lib/hof";
import { ClientsModule } from "../../../.deprecated/modules/clients";
import { ClientService } from "@services/client.service";
import { ClientsProps } from "@types";
import React from "react";

const ClientsPage = () => {
  return <ClientsModule />;
};

export default ClientsPage;

export const getServerSideProps = withAuth<ClientsProps>(
  async ({ accessToken, ctx: { query } }) => {
    const { page } = query as { page?: string | number };

    if (page) {
      const parsedPageNumber = Number(page);
      if (Number.isNaN(parsedPageNumber) || parsedPageNumber < 1) {
        return {
          redirect: {
            destination: "/clients",
            permanent: false,
          },
        };
      }
    }

    const clientService = new ClientService(accessToken);
    const clients = await clientService.getAllClients(page);

    return {
      props: {
        clients,
      },
    };
  }
);
