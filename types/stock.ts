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
  id: number;
  userId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  createdAt: Date;
  updatedAt: Date;
  
}

export type NewStock = Omit<
  Stock,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateStock = Partial<NewStock> & { id: number };

export interface StockPortfolioProps {
  stocks: Stock[];
  currentPrices: Record<string, { price: number; percentChange: number }>;
  isPending: boolean;
  isLoading: boolean;
  onAddStock: (stock: NewStock) => Promise<void>;
  onUpdateStock: (stock: UpdateStock) => Promise<void>;
  onDeleteStock: (stockId: number) => Promise<void>;
  error: string | null;
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
  onEditStock: (stock: Stock) => void;
  onDeleteStock: (stockId: number) => void;
  isLoading: boolean;
}

export type SortOrder = "asc" | "desc";

export interface SortButtonProps {
  sortOrder: SortOrder;
  onSort: () => void;
}
