import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import dataExtractor from "../Controllers/scraper/scraperExtracter.controllers.js";
import summerizer from "../Controllers/scraper/scraperAIsum.controllers.js";
import scrapperSetup from "../Controllers/scraper/scraperSetup.controllers.js";
import { ScrapeResult } from "../Models/scrapeResult.models.js";
import { AISummary } from "../Models/AISummary.models.js";
import {
  cleanUp,
  handleError,
} from "../Controllers/scraper/scraperCleanUp.controllers.js";

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {},
});

export const scrapeQueue = new Queue("scrape", { connection });

export const scrapeWorker = new Worker(
  "scrape",
  async (job) => {
    const { requrl, userId } = job.data;
    let searchHistory, browser;

    try {
      const setup = await scrapperSetup(requrl, userId);
      searchHistory = setup.searchHistory;
      browser = setup.browser;

      await job.updateProgress(20);

      const { allParas, allItems, extractedData } = await dataExtractor(
        setup.page,
        searchHistory,
        2,
        setup.crawlDelay,
      );

      await job.updateProgress(60);

      const { summaryData, highlights } = await summerizer(
        allParas,
        allItems,
        extractedData,
      );

      await job.updateProgress(80);

      const scrapeResult = new ScrapeResult({
        searchHistoryId: searchHistory._id,
        cleanData: { ...extractedData, paragraphs: allParas, items: allItems },
        metadata: extractedData.jsonLd || {},
      });
      await scrapeResult.save();

      const aiSummary = new AISummary({
        scraperesultId: scrapeResult._id,
        summaryData,
        summaryModel: "gemini-2.5-flash",
        userId,
        highlights,
      });
      await aiSummary.save();

      await cleanUp(searchHistory, browser, aiSummary);

      await job.updateProgress(100);

      return {
        searchHistoryId: searchHistory._id,
        title: extractedData.title || "No title",
        paragraphs: allParas,
        items: allItems,
        summary: summaryData,
        highlights,
      };
    } catch (error) {
      if (searchHistory) {
        searchHistory.status = "failed";
        await searchHistory.save();
      }
      if (browser) await browser.close();
      throw error;
    }
  },
  {
    connection,
    concurrency: 2,
  },
);
