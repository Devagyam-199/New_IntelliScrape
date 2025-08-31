import { ScrapeResult } from "../Models/scrapeResult.models.js";
import { AISummary } from "../Models/AISummary.models.js";
import APIError from "../Utils/apiError.utils.js";

const getScrapedData = async (req, res) => {
  try {
    const { searchHistoryId } = req.params;

    if (!searchHistoryId) {
      throw new APIError(400, "searchHistoryId is required");
    }

    const scrapeResult = await ScrapeResult.findOne({ searchHistoryId }).select("cleanData");
    if (!scrapeResult) {
      throw new APIError(404, "No scrape data found for this history");
    }

    const aiSummary = await AISummary.findOne({ scraperesultId: scrapeResult._id }).select("summaryData highlights");

    const scrapedData = {
      searchHistoryId,
      title: scrapeResult.cleanData?.title || "No title",
      paragraphs: scrapeResult.cleanData?.paragraphs || [],
      items: scrapeResult.cleanData?.items || [],
      summary: aiSummary?.summaryData || "No summary available",
      highlights: aiSummary?.highlights || [],
    };
    res.status(200).json({ data: scrapedData });
  } catch (error) {
    console.error(`Error in getScrapedData: ${error.message}`);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch scraped data",
      error: error.message,
    });
  }
};

export default getScrapedData;