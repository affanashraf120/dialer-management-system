import { StatusDetail } from "../types/misc.types";
import axios from "axios";

export class ServerSideService {
  constructor(private readonly accessToken: string) {}

  dashboardClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
  });

  icsClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ICS_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
  });

  async getAllStatuses() {
    try {
      const { data } = await this.icsClient.get<{ data: StatusDetail[] }>(
        "/debt/status_codes"
      );
      return data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
