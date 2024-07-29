import { useToast } from "@components/toast";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCommunicationClient } from "../config/httpClient";
import { SendBulkEmailType } from "../types/communication.types";

export const useGetEmailTemplates = () => {
  const { emailClient } = useCommunicationClient();
  const { data, isLoading } = useQuery({
    queryKey: ["email-templates"],
    queryFn: () => emailClient.get(`/email_templates`).then((res) => res.data),
  });
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);
  const { toast } = useToast();

  const sendBulkEmail = async (data: SendBulkEmailType) => {
    try {
      setIsSendingBulkEmail(true);
      await emailClient.post("/send_bulk_email", {
        ...data,
        debt_status_ids: data.dept_statuses.map((e) => e.value.split("__")[0]),
        clients: data.clients.map((e) => e.value.split("__")[0]),
      });
      toast({
        title: "Send Bulk Email",
        variant: "default",
      });
      setIsSendingBulkEmail(false);
    } catch (error) {
      toast({
        title: "Send Bulk Email",
        variant: "destructive",
        description: "Internal Server Error",
      });
      setIsSendingBulkEmail(false);
    }
  };

  return {
    templates: data,
    isFetchingEmailTemplates: isLoading,
    isSendingBulkEmail,
    sendBulkEmail,
  };
};
