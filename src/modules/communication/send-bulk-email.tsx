import { Button } from "@components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/dialog/dialog.component";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/form";
import { Input } from "@components/input";
import MultipleSelector from "@components/multi-select/multi-select.component";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useHttpClient } from "../../config/httpClient";
import { StatusDetail } from "../../types/misc.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SendBulkEmailType } from "@types";

interface Hit {
  _id: string;
  _index: string;
  _source: {
    name: string;
    zip_code: string;
    client_num: string;
    address_line_1: string;
    address_line_2: string;
  };
}

interface Props {
  debt_statuses: StatusDetail[];
  loading: boolean;
  onSend: (data: SendBulkEmailType) => void;
}

const allowedStatues = [
  10009, 10001, 10002, 10008, 100019, 10003, 10006, 10018,
];

const SendBulkEmailSchema = z.object({
  min_balance: z.number({ required_error: "Min Balance Required" }),
  schema: z.string({ required_error: "Schema Required" }),
  date_listed_start: z
    .string({ required_error: "Choose Start Date Listed" })
    .date(),
  date_listed_end: z
    .string({ required_error: "Choose End Date Listed" })
    .date(),
  clients: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
    { required_error: "Select Client" }
  ),
  dept_statuses: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
    { required_error: "Select Deptor Status" }
  ),
});

const SendBulkEmail = ({ debt_statuses, onSend, loading }: Props) => {
  const { searchClient } = useHttpClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof SendBulkEmailSchema>>({
    resolver: zodResolver(SendBulkEmailSchema),
    defaultValues: {
      min_balance: 0,
      schema: "",
      date_listed_end: "",
      date_listed_start: "",
    },
  });

  const searchClients = async (q: string): Promise<Hit[]> => {
    try {
      const resp = await searchClient
        .get(`/clients?q=${q}&agency=ICS&field=name`)
        .then((res) => res.data);

      if (resp && resp?.hits && resp?.hits?.hits) {
        return resp?.hits?.hits;
      }
    } catch (error) {
      return [];
    }

    return [];
  };

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSendBulkRequest = async (e: SendBulkEmailType) => {
    await onSend(e);
    toggle();
  };

  useEffect(() => {
    form.setFocus("schema");
  }, [form.setFocus]);

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button>Send Bulk Email</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[520px] max-h-[600px] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Send Bulk Email</DialogTitle>
          {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSendBulkRequest)}>
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="flex flex-col items-start gap-4">
                <FormField
                  control={form.control}
                  name="clients"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Clients</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          selectFirstItem={false}
                          onSearch={async (q) => {
                            return await searchClients(q).then((hits) => {
                              return hits.map((hit: Hit) => ({
                                label: hit._source.name,
                                value: `${hit._id}__${hit._source.name}`,
                              }));
                            });
                          }}
                          placeholder="Select client..."
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              No results found.
                            </p>
                          }
                          loadingIndicator={
                            <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                              loading...
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-start gap-4">
                <FormField
                  control={form.control}
                  name="dept_statuses"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Dept. Status Ids</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          selectFirstItem={false}
                          defaultOptions={debt_statuses
                            .filter((e) => allowedStatues.includes(e.id))
                            .map((e) => ({
                              label: e.status,
                              value: `${e.id}__${e.status}`,
                            }))}
                          placeholder="Select status..."
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              No results found.
                            </p>
                          }
                          loadingIndicator={
                            <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                              loading...
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-start gap-4">
                <FormField
                  control={form.control}
                  name="min_balance"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Minimum Balance</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Min. Balance"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-start gap-4">
                <FormField
                  control={form.control}
                  name="schema"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Schema</FormLabel>
                      <FormControl>
                        <Input placeholder="Schema" {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-start gap-4">
                  <FormField
                    control={form.control}
                    name="date_listed_start"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Date Listed Start</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col items-start gap-4">
                  <FormField
                    control={form.control}
                    name="date_listed_end"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Date Listed End</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={loading} type="submit">
                {loading ? "Submitting..." : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SendBulkEmail;
