import { StockPieChart } from "./stock-pie-chart";
import { StockTable } from "./stock-table";
import { StockFormModal } from "./stock-form-modal";
import { PortfolioSummary } from "./stock-portfolio-summary";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useStock } from "@/context/stock-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockPortfolio() {
  const { stocks, isLoading, error, setIsModalOpen } = useStock();

  if (isLoading && stocks.length === 0) {
    return (
      <Card className="mb-6 min-h-[30rem]">
        <CardHeader>
          <CardTitle>Loading Your Portfolio...</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner message="Loading..." size={24} height="400px" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 ">
      <div>
        {error && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error}
          </div>
        )}
        {stocks.length > 0 ? (
          <>
            <div className="flex flex-col md:flex-row gap-6 w-full min-h-96">
              <div className="md:w-2/3 md:mb-6">
                <StockPieChart />
              </div>
              <div className="md:w-1/3 flex flex-col">
                <PortfolioSummary />
              </div>
            </div>
            <StockTable />
          </>
        ) : (
          <Card className="mb-6 min-h-[12rem] text-center">
            <CardHeader>
              <CardTitle>Welcome to Your Stock Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                You haven&apos;t added any stocks yet. Get started by adding
                your first stock!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add Your First Stock
              </button>
            </CardContent>
          </Card>
        )}
        <div className="w-full min-w-full">
          <StockFormModal />
        </div>
      </div>
    </div>
  );
}
