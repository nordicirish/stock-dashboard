export interface StockListing {
  symbol: string;
  name: string;
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
  id?: number;
  userId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface YahooQuote {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchange: string;
}

export interface StockTableProps {
  stocks: Stock[];
  currentPrices: Record<string, { price: number; percentChange: number }>;
  onEdit: (stock: Stock) => void;
  onDelete: (stockId: number) => void;
}

export type SortOrder = "asc" | "desc";

export interface SortButtonProps {
  sortOrder: SortOrder;
  onSort: () => void;
}
