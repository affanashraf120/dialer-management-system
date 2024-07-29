import {
  ClientDetail,
  ClientSummary,
  ClientsProps,
  CollectorPayment,
  PaginatedApiResponse,
} from "../types/misc.types";
import { ServerSideService } from "./server-side.service";

export class ClientService extends ServerSideService {
  async getAllClients(
    page_num: string | number = 1
  ): Promise<ClientsProps["clients"]> {
    try {
      const { data } = await this.icsClient.get<
        PaginatedApiResponse<ClientDetail>
      >(`/clients?page_num=${page_num}&is_active=true`);

      return {
        data: data.data,
        count: data.count,
        total: Math.ceil(data.total / 25),
      };
    } catch (error) {
      console.log(error);
      return {
        data: [],
        count: 0,
        total: 0,
      };
    }
  }

  async getClientSummary(id: string): Promise<ClientSummary> {
    try {
      const { data } = await this.dashboardClient.get<ClientSummary>(
        `/client-summary/${id}`
      );
      return data;
    } catch (error) {
      console.log(error);
      return {
        client_number: "",
        client_name: "Couldn't fetch client data",
        total_balance: 0,
        total_payments: 0,
        total_accounts: 0,
        total_account: 0,
        total_email_sent: 0,
        total_text_sent: 0,
      };
    }
  }

  async getClientPayments({
    id,
    from,
    to,
    page = "1",
  }: {
    id: string;
    from: string;
    to: string;
    page?: string;
  }) {
    try {
      const { data } = await this.dashboardClient.get<CollectorPayment[]>(
        `/total-payments?start_date=${from}&end_date=${to}&client_num=${id}&limit=20&offset=${
          (Number(page) - 1) * 20
        }`
      );
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
