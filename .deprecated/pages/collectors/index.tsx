import { withAuth } from "@lib/hof";
import { CollectorsModule } from "../../../.deprecated/modules/collectors";
import { CollectorsService } from "@services/collectors.service";
import { CollectorsProps } from "@types";
import React from "react";

const Collectors = () => {
  return <CollectorsModule />;
};

export default Collectors;

export const getServerSideProps = withAuth<CollectorsProps>(
  async ({ accessToken }) => {
    const collectorsService = new CollectorsService(accessToken);
    const collectors = await collectorsService.getAllCollectors();

    return {
      props: {
        collectors: collectors.map((collector) => ({
          id: collector.id,
          email: collector.email,
          fullName:
            collector.first_name +
            (collector.middle_name ? ` ${collector.middle_name}` : "") +
            (collector.last_name ? ` ${collector.last_name}` : ""),
        })),
      },
    };
  }
);
