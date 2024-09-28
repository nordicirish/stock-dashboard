"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const defaultStock = process.env.DEFAULT_STOCK || "SP500"; // Default to S&P 500 if not provided
console.log(`Default stock: ${defaultStock}`);

// In-memory cache for multiple stocks
const cache: Record<string, { data: string | null; lastUpdated: Date | null }> =
  {};

/**
 * Get stock analysis for either a specific stock symbol or default to a configured value.
 * @param {string} symbol - The stock symbol to analyze (optional).
 * @returns {Promise<string>} - The analysis result.
 */
export async function getStockAnalysis(symbol?: string): Promise<string> {
  const stockSymbol = symbol || defaultStock; // Use provided symbol or default
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  // Check if cache for this stock symbol is valid (less than 24 hours old)
  const now = new Date();
  if (
    cache[stockSymbol] &&
    cache[stockSymbol].lastUpdated &&
    now.getTime() - cache[stockSymbol].lastUpdated!.getTime() <
      24 * 60 * 60 * 1000
  ) {
    return cache[stockSymbol].data!;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that provides brief stock or market analysis. Keep the analysis concise and informative. Respond with the analysis formatted using appropriate <p> HTML tags. Provide a brief analysis of the ${stockSymbol} index. Include information about its recent performance, any significant market trends, and a general outlook.`,
        },
        { role: "user", content: generateStockPrompt(stockSymbol) },
      ],
      max_tokens: 200,
      temperature: 0.6,
    });

    const result =
      completion.choices[0].message.content || "No analysis available.";

    // Update cache for the specific stock symbol
    cache[stockSymbol] = {
      data: result,
      lastUpdated: now,
    };

    return result;
  } catch (error: unknown) {
    console.error(`Error with OpenAI API request: ${(error as Error).message}`);
    throw new Error("An error occurred during your request.");
  }
}

/**
 * Generate a prompt based on stock symbol.
 * @param {string} symbol - The stock symbol for which to generate an analysis prompt.
 * @returns {string} - The generated prompt.
 */
function generateStockPrompt(symbol: string) {
 
  return `Provide a brief analysis of the stock ${symbol}. Include information about the company's recent performance, any significant news, and potential future outlook. Keep the analysis concise and informative.`;
}
