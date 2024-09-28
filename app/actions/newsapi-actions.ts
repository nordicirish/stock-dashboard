"use server";

interface Article {
  title: string;
  url: string;
}

const cache: {
  newsData: {
    [key: string]: { data: Article[]; lastUpdated: number };
  } | null;
} = {
  newsData: null,
};

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getLatestNews(
  symbol: string
): Promise<{ title: string; url: string }[]> {
  const now = Date.now();
  if (
    cache.newsData?.[symbol] &&
    now - cache.newsData[symbol].lastUpdated < CACHE_DURATION
  ) {
    return cache.newsData[symbol].data.slice(0, 2).map((article) => ({
      title: article.title,
      url: article.url ?? "",
    }));
  }

  try {
    const query = symbol || "stocks"; // Default to 'stocks' if no symbol provided

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`
    );
    const data = await response.json();

    console.log("NewsAPI response:", data);
    if (data.articles && data.articles.length > 0) {
      const latestNews = data.articles.slice(0, 2).map((article: Article) => ({
        title: article.title,
        url: article.url,
      }));

      cache.newsData = {
        ...cache.newsData,
        [symbol]: {
          data: latestNews,
          lastUpdated: now,
        },
      };

      return latestNews;
    } else {
      console.error("No articles found for the symbol:", symbol);
      throw new Error("No news articles found");
    }
  } catch (error) {
    console.error("Error fetching news from NewsAPI:", error);
    return [
      {
        title: `No news found for ${symbol}, please try again later.`,
        url: "",
      },
    ]; // Fallback if the API fails
  }
}
