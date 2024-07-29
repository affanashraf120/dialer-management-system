import { useToast } from "@components/toast";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCommunicationClient } from "../config/httpClient";
import { SendBulkSMSType } from "../types/send-bulk-sms.type";

export const useGetSMSTemplates = () => {
  const { smsClient } = useCommunicationClient();
  const { data, isLoading } = useQuery({
    queryKey: ["sms-templates"],
    queryFn: () => smsClient.get(`/templates`).then((res) => res.data),
  });
  const [isSendingBulkSMS, setIsSendingBulkSMS] = useState(false);
  const { toast } = useToast();

  const sendBulkSMS = async (data: SendBulkSMSType) => {
    try {
      setIsSendingBulkSMS(true);
      await smsClient.post("/send_bulk_sms", {
        ...data,
        debt_status_ids: data.dept_statuses.map((e) => e.value.split("__")[0]),
        clients: data.clients.map((e) => e.value.split("__")[0]),
      });
      toast({
        title: "Send Bulk SMS",
        variant: "default",
      });
      setIsSendingBulkSMS(false);
    } catch (error) {
      toast({
        title: "Send Bulk SMS",
        variant: "destructive",
        description: "Internal Server Error",
      });
      setIsSendingBulkSMS(false);
    }
  };

  return {
    templates: data,
    isFetchingSMSTemplates: isLoading,
    isSendingBulkSMS,
    sendBulkSMS,
  };
};
