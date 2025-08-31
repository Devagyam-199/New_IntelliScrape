import scrapePDf from "./scraper/scraperPDF.controllers.js";
import APIError from "../Utils/apiError.utils.js";
import { SearchHistory } from "../Models/searchHistory.models.js";
import { ScrapeResult } from "../Models/scrapeResult.models.js";
import { AISummary } from "../Models/AISummary.models.js";

const generatePDF = async (req, res) => {
  try {
    const { searchHistoryId } = req.query;
    if (!searchHistoryId) {
      throw new APIError(400, "searchHistoryId is required");
    }

    console.log(`Fetching SearchHistory`);
    const searchHistory = await SearchHistory.findById(searchHistoryId);
    if (!searchHistory) {
      throw new APIError(404, `Search history not found`);
    }

    console.log(`Fetching ScrapeResult`);
    const scrapeResult = await ScrapeResult.findOne({ searchHistoryId });
    if (!scrapeResult) {
      throw new APIError(404, `No scrape data found for SearchHistory`);
    }

    console.log(`Fetching AISummary for SearchHistory`);
    const aiSummary = await AISummary.findOne({
      scraperesultId: scrapeResult._id,
    });
    if (!aiSummary) {
      throw new APIError(404, `No summary data found for SearchHistory`);
    }

    const { cleanData: extractedData = {} } = scrapeResult;
    const { summaryData = "No summary available", highlights = [] } = aiSummary;
    const { paragraphs: allParas = [], items: allItems = [] } = extractedData;

    const pdfBuffer = await scrapePDf(
      searchHistory,
      extractedData,
      allParas,
      allItems,
      summaryData,
      highlights
    );

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=scraped-content-${searchHistoryId}.pdf`,
    });
    res.send(pdfBuffer);

    console.log(`PDF sent successfully`);
  } catch (error) {
    console.error(`Error in generatePDF: ${error.message}`);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to generate PDF",
      error: error.message,
    });
  }
};

export default generatePDF;
