import { Badge } from "@components/badge";
import { Button } from "@components/button";
import DateRangeOption, {
  useDateRangeOption,
} from "@components/date-range-option/date-range-option";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/dialog/dialog.component";
import { usePagination } from "@components/pagination";
import { PaginationExtended } from "@components/pagination/pagination-extended";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/select";
import { Skeleton } from "@components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@components/table";
import AuthManager from "@lib/hof/withAuth";
import { formatCallDateTime, formatCallDuration } from "@lib/utils";
import {
  useGetAllCallLogs,
  useGetCallRecordings,
} from "@services/dialer.service";
import { MoveDownLeft, MoveUpRight } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

const CallLogs = () => {
  const { from, to } = useDateRangeOption({
    fromKey: "from",
    toKey: "to",
  });

  const router = useRouter();
  const { selectedPage, onPageChange } = usePagination();

  const callDirection = router.query.direction as string;

  const { logs, totalPages, isFetchingLogs } = useGetAllCallLogs({
    fromDate: from,
    toDate: to,
    page: selectedPage,
    callDirection: callDirection === "ALL" ? undefined : callDirection,
  });

  const [selectedRecordingSid, setSelectedRecordingSid] = useState<
    string | undefined
  >();

  return (
    <div>
      <CallRecordingsModal
        callSid={selectedRecordingSid}
        isOpen={!!selectedRecordingSid}
        onClose={() => setSelectedRecordingSid(undefined)}
      />

      <div className="flex items-center gap-4 justify-between">
        <Select
          value={callDirection ?? "ALL"}
          onValueChange={(value) => {
            router.push(
              {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  direction: value,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Calls" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All Calls</SelectItem>
              <SelectItem value="INBOUND">Inbound Calls</SelectItem>
              <SelectItem value="OUTBOUND">Outbound Calls</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DateRangeOption
          fromKey="from"
          toKey="to"
          align="end"
          containerClassName="max-w-fit"
        />
      </div>
      <div className="border rounded-md mt-6 text-xs">
        <Table>
          <TableHeader>
            <TableRow className="text-sm">
              <TableHead>ID</TableHead>
              <TableHead>SID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Initiated At</TableHead>
              <TableHead>Ended At</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Is Missed Call</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetchingLogs && (
              <TableSkeleton columns={12} rows={15} cellClassName="py-2" />
            )}
            {!isFetchingLogs &&
              logs.length > 0 &&
              logs?.map((log, idx) => (
                <TableRow key={log.id} className="text-xs">
                  <TableCell className="p-1 px-2">{log.id}</TableCell>
                  <TableCell className="p-1 px-2">{log.sid}</TableCell>
                  <TableCell className="p-1 px-2">{log.from}</TableCell>
                  <TableCell className="p-1 px-2">{log.to}</TableCell>
                  <TableCell className="p-1 px-2">
                    <Badge
                      className="w-full flex items-center gap-2 justify-center text-xs"
                      variant={
                        log.callDirection === "INBOUND"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {log.callDirection}
                      {log.callDirection === "INBOUND" ? (
                        <MoveDownLeft className="w-4 h-4" />
                      ) : (
                        <MoveUpRight className="w-4 h-4" />
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCallDateTime(log.startTime)}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCallDateTime(log.endTime)}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {formatCallDuration(Number(log.duration))}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {log.isMissedCall ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    {log.agent?.firstName || log.agent?.lastName
                      ? `${log.agent?.firstName} ${log.agent?.lastName}`
                      : log.agent?.email}
                  </TableCell>
                  <TableCell className="p-1 px-2">
                    <Button
                      className="py-1 !text-xs h-auto font-normal"
                      onClick={() =>
                        setSelectedRecordingSid(log.parentCallSid ?? log.sid)
                      }
                      size="sm"
                      variant="outline"
                    >
                      Recordings
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {!isFetchingLogs && logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="py-12 text-center">
                  No logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center flex-col w-full mt-6 space-y-4">
          <PaginationExtended
            totalPages={totalPages}
            currentPage={selectedPage}
            onPageChange={onPageChange}
          />
          <p className="text-sm">
            Showing page {selectedPage} of {totalPages} pages
          </p>
        </div>
      )}
    </div>
  );
};

export default CallLogs;

const CallRecordingsModal = ({
  callSid,
  isOpen,
  onClose,
}: {
  callSid?: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { recordings, isFetchingRecordings } = useGetCallRecordings(callSid);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Call Recordings</DialogTitle>
          <DialogDescription>SID: {callSid}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isFetchingRecordings ? (
            <div className="grid gap-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ) : (
            <>
              {recordings && recordings.length > 0 ? (
                <ul className="grid gap-3 w-full">
                  {recordings.map((recording, idx) => (
                    <li key={idx} className="w-full">
                      <audio
                        controls
                        className="w-full"
                        onLoadedData={() => {
                          console.log("loaded");
                        }}
                      >
                        <source
                          src={recording.uri.replace(".mp3", ".wav")}
                          type="audio/x-wav"
                        ></source>
                      </audio>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No recordings found</div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
