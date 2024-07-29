export const siteConfig = {
  name: "Account Recovery Group",
  mainNav: [
    {
      title: "PDC Report",
      href: "/pdc-report",
      sub: [
        { title: "Schedules", href: "/schedules" },
        { title: "Transactions", href: "/transactions" },
      ],
    },
    {
      title: "Clients",
      href: "/clients",
      sub: [
        {
          title: "Inventory",
          href: "/client-inventory-summary",
        },
        { title: "Schedule", href: "/scheduled" },
        { title: "Payments", href: "/payments" },
        { title: "Top Payments", href: "/payments-top" },
        { title: "Total Bill", href: "/total-bill" },
      ],
    },
    {
      title: "Collections",
      href: "collections",
    },
    // {
    //   title: "Call Summary",
    //   href: "call-summary",
    // },
    // {
    //   title: "Call Logs",
    //   href: "call-logs",
    // },
    {
      title: "Communication",
      href: "communication/sms",
    },
  ],
  agencies: {
    ics: {
      label: "ICS",
      value: "ics",
    },
    arr: {
      label: "ARR",
      value: "arr",
    },
  },
};

export type TAgency = keyof typeof siteConfig.agencies;
