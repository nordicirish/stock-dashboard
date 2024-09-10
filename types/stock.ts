export interface StockListing {
  symbol: string;
  name: string;
  exchange: string;
}

export interface StockData {
  name: string;
  data: Array<{
    time: string;
    price: number;
  }>;
}

export interface Stock {
  name: string;
  quantity: number;
  price: number;
}
export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  data: Array<{
    time: string;
    price: number;
  }>;
}

export interface YahooQuote {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchange: string;
}
