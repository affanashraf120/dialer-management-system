import DateRangeOption from "@components/date-range-option/date-range-option";
import CallSummary from "./call-summary";
import AgentsCallSummary from "./call-summary-agents";

const CallReport = () => {
  return (
    <div className="mx-auto">
      <DateRangeOption
        fromKey="from"
        toKey="to"
        align="start"
        containerClassName="mb-6"
      />
      <CallSummary />
      <AgentsCallSummary />
    </div>
  );
};

export default CallReport;
