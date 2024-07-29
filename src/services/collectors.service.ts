import {
  CollectorApiData,
  CollectorDebtStatusDetail,
  CollectorSummary,
  CollectorTotalPayment,
} from "../types/misc.types";
import { ServerSideService } from "./server-side.service";

export class CollectorsService extends ServerSideService {
  async getAllCollectors() {
    try {
      const { data } = await this.icsClient.get<{
        data: CollectorApiData[];
      }>("/collector");
      return data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getCollectorById(id: string) {
    try {
      const { data } = await this.icsClient.get<{
        data: CollectorApiData;
      }>(`/collector/${id}`);
      return data.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getCollectorSummary(id: string): Promise<CollectorSummary> {
    const fallbackData: CollectorSummary = {
      collector_id: id,
      emails_sent: 0,
      sms_sent: 0,
      calls_made: 0,
    };

    try {
      const { data } = await this.dashboardClient.get<CollectorSummary[]>(
        `/collector-summary/collector/${id}`
      );
      return data?.[0] ?? fallbackData;
    } catch (error) {
      console.log(error);
      return fallbackData;
    }
  }

  async getCollectorDebtStatuses({
    id,
    startDate,
    endDate,
  }: {
    id: string;
    startDate: string;
    endDate: string;
  }) {
    try {
      const { data } = await this.dashboardClient.get<
        CollectorDebtStatusDetail[]
      >(`/collector/${id}?start_date=${startDate}&end_date=${endDate}`);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getCollectorTotalPayment(id: string) {
    try {
      const { data } = await this.dashboardClient.get<CollectorTotalPayment>(
        `/collectors/${id}/total-payments`
      );
      return data.total_payments;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
