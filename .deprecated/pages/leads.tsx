import React, { useMemo, useState } from "react";
import { useHttpClient } from "../../src/config/httpClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/select";
import { Spinner } from "@components/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { Lead, LeadResponse } from "../../src/types/leads.types";
import Link from "next/link";
import { Button } from "@components/button";
import { Bird, Calendar, Mail, MapPin, Phone, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/dialog/dialog.component";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/card";
import format from "date-fns/format";
import { formatPhoneNumber } from "@lib/utils";
import { Pagination } from "@components/pagination";
import { useToast } from "@components/toast";

enum LeadsType {
  QUOTE = "quote",
  DISPUTE = "dispute",
}

enum System {
  ICS = "ICS",
  ARR = "ARR",
  MSB = "MSB",
}

const Leads = () => {
  const { enableQuery, leadsClient } = useHttpClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryLeadType = router.query["lead_type"] as LeadsType;
  const querySystem = router.query["system"] as System;
  const queryPageNum = router.query["page"] as string;

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [openLeadDetailsModal, setOpenLeadDetailsModal] = useState(false);
  const [openLeadDeleteModal, setOpenLeadDeleteModal] = useState(false);

  const leadType = useMemo(() => {
    if (!queryLeadType || !Object.values(LeadsType).includes(queryLeadType)) {
      return LeadsType.QUOTE;
    }
    return queryLeadType;
  }, [queryLeadType]);

  const selectedSystem = useMemo(() => {
    if (!querySystem || !Object.values(System).includes(querySystem)) {
      return System.ICS;
    }

    return querySystem;
  }, [querySystem]);

  const currentPage = useMemo(() => {
    const parsedPageNum = Number(queryPageNum);
    return !isNaN(parsedPageNum) ? parsedPageNum : 1;
  }, [queryPageNum]);

  const { data, isLoading } = useQuery({
    queryKey: ["static-leads", leadType, selectedSystem, currentPage],
    queryFn: () =>
      leadsClient
        .get<LeadResponse>("/v1/static-leads", {
          params: {
            show_disputes: leadType === LeadsType.DISPUTE ? true : undefined,
            system: selectedSystem,
            page: currentPage,
            data_per_page: 9,
          },
        })
        .then((res) => res.data),
    enabled: enableQuery,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { isLoading: isDeleting, mutate: deleteLedad } = useMutation(
    (leadId: string) => leadsClient.delete(`/v1/static-leads/${leadId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["static-leads"] });
        toast({ description: "Lead has been deleted successfully!." });
        setSelectedLead(null);
        setOpenLeadDeleteModal(false);
      },
    }
  );

  const onChangeQuoteType = (type: LeadsType) => {
    router.push(
      {
        pathname: router.pathname,
        query: { lead_type: type },
      },
      undefined,
      { shallow: true }
    );
  };

  const onChangeSystem = (system: System) => {
    router.push(
      {
        pathname: router.pathname,
        query: { system },
      },
      undefined,
      { shallow: true }
    );
  };

  const onPageChange = (pageNo: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: pageNo },
      },
      undefined,
      { shallow: true }
    );
  };

  const closeLeadDetailsModal = () => {
    setOpenLeadDetailsModal(false);
    setSelectedLead(null);
  };

  const onOpenLeadDetailsModal = (lead: Lead) => {
    setSelectedLead(lead);
    setOpenLeadDetailsModal(true);
  };

  const closeLeadDeleteModal = () => {
    if (isDeleting) {
      return;
    }
    setOpenLeadDeleteModal(false);
    setSelectedLead(null);
  };

  const onOpenLeadDeleteModal = (lead: Lead) => {
    setSelectedLead(lead);
    setOpenLeadDeleteModal(true);
  };

  return (
    <div>
      <Dialog
        open={openLeadDetailsModal}
        modal
        onOpenChange={closeLeadDetailsModal}
      >
        {selectedLead && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedLead?.name} requested {leadType} from{" "}
                {selectedLead.system}
              </DialogTitle>
              <DialogDescription className="pt-2">
                {selectedLead.message}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
      <Dialog
        open={openLeadDeleteModal}
        modal
        onOpenChange={closeLeadDeleteModal}
      >
        {selectedLead && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription className="pt-2">
                This action cannot be undone. This will permanently delete the
                selected {selectedLead.isDisputeLead ? "dispute" : "quote"}{" "}
                request.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                disabled={isDeleting}
                onClick={closeLeadDeleteModal}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={isDeleting}
                size="sm"
                onClick={() => deleteLedad(selectedLead.id)}
              >
                {isDeleting && <Spinner secondary />}
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      <div className="flex items-center justify-between">
        <Tabs value={leadType} defaultValue={leadType} className="w-[400px]">
          <TabsList>
            <TabsTrigger
              value={LeadsType.QUOTE}
              onClick={() => onChangeQuoteType(LeadsType.QUOTE)}
            >
              Quote Request
            </TabsTrigger>
            <TabsTrigger
              value={LeadsType.DISPUTE}
              onClick={() => onChangeQuoteType(LeadsType.DISPUTE)}
            >
              Dispute Request
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Select
          onValueChange={onChangeSystem}
          defaultValue={System.ICS}
          value={selectedSystem}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(System).map((value, idx) => (
              <SelectItem key={idx} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <Spinner width={72} height={72} />
        </div>
      ) : (
        <div>
          {data?.leads && data.leads.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
              {data.leads.map((lead) => (
                <Card key={lead.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{lead.name}</CardTitle>
                    <CardDescription>
                      {lead.disputeReference && (
                        <span className="font-bold underline block">
                          Ref: #{lead.disputeReference}
                        </span>
                      )}
                      Requested {lead.isDisputeLead ? "dispute" : "quote"} from{" "}
                      {lead.system} at{" "}
                      {format(new Date(lead.createdAt), "yyyy-MM-dd HH:mm:ss")}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="whitespace-normal">
                        <p className="text-sm font-semibold">Email</p>
                        <Link
                          href={`mailto:${lead.email}`}
                          className="text-sm break-words underline text-muted-foreground line-clamp-1"
                        >
                          {lead.email}
                        </Link>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Phone Number</p>
                        <Link
                          href={`mailto:${lead.phoneNumber}`}
                          className="text-sm break-words underline text-muted-foreground"
                        >
                          {formatPhoneNumber(lead.phoneNumber)}
                        </Link>
                      </div>
                      <div className="col-span-full">
                        <p className="text-sm font-semibold">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.address ?? "-"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      onClick={() => onOpenLeadDetailsModal(lead)}
                      size="sm"
                    >
                      View Message
                    </Button>
                    <Button
                      onClick={() => onOpenLeadDeleteModal(lead)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-[50vh] w-full flex items-center justify-center text-muted-foreground gap-4 flex-col">
              <Bird className="w-60 h-60" strokeWidth={1} />
              <p className="text-2xl">
                No {leadType} request found for {selectedSystem}
              </p>
            </div>
          )}
        </div>
      )}
      {data?.totalPages && data?.totalPages > 1 && data.leads.length > 0 ? (
        <div className="mt-6 max-w-fit mx-auto">
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Leads;
