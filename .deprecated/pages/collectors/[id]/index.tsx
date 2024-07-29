import { withAuth } from "@lib/hof";
import { getDateRange } from "@lib/utils";
import { CollectorModule } from "@modules/collector";
import { CollectorsService } from "@services/collectors.service";
import { CollectorProps } from "@types";
import format from "date-fns/format";
import sub from "date-fns/sub";
import React from "react";

const CollectorPage = () => {
  return <CollectorModule />;
};

export default CollectorPage;

export const getServerSideProps = withAuth<CollectorProps>(
  async ({ accessToken, ctx }) => {
    const { id, from, to } = ctx.query as {
      id: string;
      from?: string;
      to?: string;
    };
    const collectorsService = new CollectorsService(accessToken);

    const collector = await collectorsService.getCollectorById(id);
    if (!collector) {
      return { notFound: true };
    }

    const { startDate, endDate } = getDateRange({
      from,
      to,
      subDuration: { years: 1 },
    });

    const [collectorSummary, collectorDebtStatuses, allStatuses, totalPayment] =
      await Promise.all([
        collectorsService.getCollectorSummary(id),
        collectorsService.getCollectorDebtStatuses({ id, startDate, endDate }),
        collectorsService.getAllStatuses(),
        collectorsService.getCollectorTotalPayment(id),
      ]);

    if (!collector) {
      return { notFound: true };
    }

    const statuses: { [key: string]: string } = allStatuses.reduce(
      (acc: { [key: string]: string }, status) => {
        acc[status.status_code] = status.status;
        return acc;
      },
      {}
    );

    const collectorStatuses = collectorDebtStatuses.map((debtStatus) => ({
      ...debtStatus,
      status: statuses[debtStatus.debt_status_code],
    }));

    const { email, first_name, middle_name, last_name } = collector;
    const fullName = `${first_name}${middle_name ? ` ${middle_name}` : ""}${
      last_name ? ` ${last_name}` : ""
    }`;

    return {
      props: {
        collector: { id: collector.id, email, fullName },
        collectorSummary,
        collectorStatuses,
        totalPayment,
        collectorStatusDateRange: {
          from: startDate,
          to: endDate,
        },
      },
    };
  }
);
