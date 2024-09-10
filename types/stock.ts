export type StockListing = {
  symbol: string;
  name: string;
  exchange: string;
};

export type StockData = {
  name: string;
  data: Array<{ time: string; price: number }>;
};
