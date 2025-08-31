import { SearchHistory } from "../Models/searchHistory.models.js";
import { ScrapeResult } from "../Models/scrapeResult.models.js";
import APIError from "../Utils/apiError.utils.js";

const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all search histories for the user, sorted by scrapedAt descending
    const histories = await SearchHistory.find({ userId })
      .sort({ scrapedAt: -1 })
      .select("url status scrapedAt");

    if (!histories.length) {
      return res.status(200).json({ message: "No history found", data: [] });
    }

    // For each history, fetch the corresponding scrapeResult and extract title
    const historyData = await Promise.all(
      histories.map(async (history) => {
        const scrapeResult = await ScrapeResult.findOne({ searchHistoryId: history._id }).select("cleanData.title");

        return {
          searchHistoryId: history._id,
          status: history.status,
          scrapedAt: history.scrapedAt,
          title: scrapeResult?.cleanData?.title === "No title" ? history.url : scrapeResult?.cleanData?.title || history.url,
        };
      })
    );

    res.status(200).json({ data: historyData });
  } catch (error) {
    console.error(`Error in getUserHistory: ${error.message}`);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch history",
      error: error.message,
    });
  }
};

export default getUserHistory;