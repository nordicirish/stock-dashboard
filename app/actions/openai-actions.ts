"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // for jest testing
  //  dangerouslyAllowBrowser: true,
});

// In-memory cache
let cache = {
  data: null as string | null,
  lastUpdated: null as Date | null,
};

export async function getStockAnalysis(symbol: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides brief stock analysis.",
        },
        { role: "user", content: generateStockPrompt(symbol) },
      ],
      max_tokens: 200,
      temperature: 0.6,
    });

    return completion.choices[0].message.content || "No analysis available.";
  } catch (error: unknown) {
    console.error(`Error with OpenAI API request: ${error as Error}.message}`);
    throw new Error("An error occurred during your request.");
  }
}

export async function getSP500Analysis(): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  // Check if cache is valid (less than 24 hours old)
  const now = new Date();
  if (
    cache.data &&
    cache.lastUpdated &&
    now.getTime() - cache.lastUpdated.getTime() < 24 * 60 * 60 * 1000
  ) {
    return cache.data;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides brief market analysis.",
        },
        { role: "user", content: generateSP500Prompt() },
      ],
      max_tokens: 200,
      temperature: 0.6,
    });

    const result =
      completion.choices[0].message.content || "No analysis available.";

    // Update cache
    cache = {
      data: result,
      lastUpdated: now,
    };

    return result;
  } catch (error: unknown) {
    console.error(`Error with OpenAI API request: ${error as Error}.message}`);
    throw new Error("An error occurred during your request.");
  }
}

function generateStockPrompt(symbol: string) {
  return `Provide a brief analysis of the stock ${symbol}. Include information about the company's recent performance, any significant news, and potential future outlook. Keep the analysis concise and informative.`;
}

function generateSP500Prompt() {
  return `Provide a brief analysis of the S&P 500 index. Include information about its recent performance, any significant market trends, and a general outlook. Keep the analysis concise and informative.`;
}
