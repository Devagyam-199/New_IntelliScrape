import { scrapeQueue } from "../queues/scrapeQueue.js";
import APIError from "../Utils/apiError.utils.js";
import { SearchHistory } from "../Models/searchHistory.models.js";
import { ScrapeResult } from "../Models/scrapeResult.models.js";
import { AISummary } from "../Models/AISummary.models.js";

const CACHE_TTL_HOURS = 6;

const scraper = async (req, res) => {
  const { requrl } = req.body;
  const userId = req.user.id;

  if (!requrl) throw new APIError(400, "URL is required");

  const cacheThreshold = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000);
  const existing = await SearchHistory.findOne({
    url: requrl,
    status: "success",
    scrapedAt: { $gte: cacheThreshold },
  }).sort({ scrapedAt: -1 });

  if (existing) {
    const scrapeResult = await ScrapeResult.findOne({ searchHistoryId: existing._id });
    const aiSummary = await AISummary.findOne({ scraperesultId: scrapeResult?._id });

    if (scrapeResult && aiSummary) {
      return res.status(200).json({
        cached: true,
        data: {
          searchHistoryId: existing._id,
          title: scrapeResult.cleanData?.title || "No title",
          paragraphs: scrapeResult.cleanData?.paragraphs || [],
          items: scrapeResult.cleanData?.items || [],
          summary: aiSummary.summaryData,
          highlights: aiSummary.highlights || [],
        },
      });
    }
  }

  const job = await scrapeQueue.add("scrape-job", { requrl, userId: userId.toString() }, {
    attempts: 2,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  });

  res.status(202).json({ message: "Scraping job queued", jobId: job.id });
};

export default scraper;
