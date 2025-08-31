import { cleanUp, handleError } from "./scraper/scraperCleanUp.controllers.js";
import scrapperSetup from "./scraper/scraperSetup.controllers.js";
import dataExtractor from "./scraper/scraperExtracter.controllers.js";
import summerizer from "./scraper/scraperAIsum.controllers.js";
import { ScrapeResult } from "../Models/scrapeResult.models.js";
import { AISummary } from "../Models/AISummary.models.js";

const scraper = async (req, res) => {
  let searchHistory, browser, page, crawlDelay;
  try {
    const { requrl } = req.body;
    const userId = req.user.id;
    if (!requrl) {
      throw new APIError(400, "URL is required to begin scraping");
    }

    ({ searchHistory, browser, page, crawlDelay } = await scrapperSetup(
      requrl,
      userId
    ));

    const { allParas, allItems, extractedData } = await dataExtractor(
      page,
      searchHistory,
      3,
      crawlDelay
    );

    const { summaryData, highlights } = await summerizer(
      allParas,
      allItems,
      extractedData
    );

    const scrapeResult = new ScrapeResult({
      searchHistoryId: searchHistory._id,
      cleanData: {
        ...extractedData,
        paragraphs: allParas,
        items: allItems,
      },
      metadata: extractedData.jsonLd || {},
    });
    await scrapeResult.save();
    console.log(`ScrapeResult saved`);

    const aiSummary = new AISummary({
      scraperesultId: scrapeResult._id,
      summaryData,
      summaryModel: "gemini-2.5-flash",
      userId,
    });
    await aiSummary.save();
    console.log(`AISummary saved`);
    const scrapedData = {
      searchHistoryId: searchHistory._id,
      title: extractedData.title || "No title",
      paragraphs: allParas || [],
      items: allItems || [],
      summary: summaryData || "No summary available",
      highlights: highlights || [],
    };

    await cleanUp(searchHistory, browser, aiSummary);
    res.status(200).json({ data: scrapedData });
  } catch (error) {
    await handleError(res, searchHistory, browser, error);
  }
};

export default scraper;
