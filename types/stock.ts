export interface StockListing {
  symbol: string;
  name: string;
  exchange: string;
}

export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  data: Array<{
    timestamp: number;
    price: number;
  }>;
  timezone: string;
}

export interface Stock {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
}

export interface YahooQuote {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchange: string;
}
