interface CollectionResponse {
  status: number;
  data: Collection[];
  msg: string;
}

interface Collection {
  collector: Collector;
  payments: Payments;
}

interface Payments {
  [key: string]: string;
}

interface Collector {
  id?: string;
  name: string;
}
