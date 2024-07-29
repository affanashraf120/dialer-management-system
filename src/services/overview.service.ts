import { StatusDetail } from "../types/misc.types";
import { AxiosInstance } from "axios";
import { ServerSideService } from "./server-side.service";

export class OverviewService extends ServerSideService {
  async getTotalDebts() {
    try {
      const { data } = await this.dashboardClient.get<{ number: number }>(
        "/count-debt"
      );
      return data.number;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async getTotalClients() {
    try {
      const { data } = await this.dashboardClient.get<{ number: number }>(
        "/count-client"
      );
      return data.number;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async getStatusReport() {
    try {
      const { data } = await this.dashboardClient.get<StatusDetail[]>(
        "/status-report"
      );
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
