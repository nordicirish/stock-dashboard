import {
  getStockAnalysis,

} from "@/app/actions/openai-actions";

describe("getStockAnalysis", () => {
  it("should return a stock analysis", async () => {
    const symbol = "AAPL"; // Example stock symbol
    const analysis = await getStockAnalysis(symbol);
    expect(analysis).toBeDefined();
    expect(typeof analysis).toBe("string");
    expect(analysis.length).toBeGreaterThan(0);
  });
});

  

