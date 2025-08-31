import { SearchHistory } from "../Models/searchHistory.models.js";
import { ScrapeResult } from "../Models/scrapeResult.models.js";
import APIError from "../Utils/apiError.utils.js";

const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const histories = await SearchHistory.find({ userId })
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("url status scrapedAt");

    const total = await SearchHistory.countDocuments({ userId });

    if (!histories.length && page === 1) {
      return res.status(200).json({
        message: "No history found",
        data: [],
        pagination: { page, limit, total, pages: 0 },
      });
    }

    const historyData = await Promise.all(
      histories.map(async (history) => {
        const scrapeResult = await ScrapeResult.findOne({ searchHistoryId: history._id }).select("cleanData.title");

        return {
          searchHistoryId: history._id,
          status: history.status,
          scrapedAt: history.scrapedAt,
          title: scrapeResult?.cleanData?.title === "No title" ? history.url : scrapeResult?.cleanData?.title || history.url
        };
      })
    );

    res.status(200).json({
      data: historyData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(`Error in getUserHistory: ${error.message}`);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch history",
      error: error.message,
    });
  }
};

export default getUserHistory;