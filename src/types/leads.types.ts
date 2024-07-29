export interface LeadResponse {
  total: number;
  totalPages: number;
  leads: Lead[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  message: string;
  isDisputeLead: boolean;
  disputeReference?: string;
  system: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt?: any;
}
