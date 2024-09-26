import {
  getStockAnalysis,
  getSP500Analysis,
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

describe("getSP500Analysis", () => {
  it("should return a market analysis", async () => {
    const analysis = await getSP500Analysis();
    expect(analysis).toBeDefined();
    expect(typeof analysis).toBe("string");
    expect(analysis.length).toBeGreaterThan(0);
  });

  it("should return cached analysis if it's valid", async () => {
    // Call getSP500Analysis first to populate cache
    const firstAnalysis = await getSP500Analysis();

    // Call again to ensure it returns cached data
    const cachedAnalysis = await getSP500Analysis();
    expect(cachedAnalysis).toEqual(firstAnalysis); // Expect cached analysis to be the same
  });

  
  
});
