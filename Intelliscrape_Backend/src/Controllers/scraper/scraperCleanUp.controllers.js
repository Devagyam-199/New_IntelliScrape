import APIError from "../../Utils/apiError.utils.js";

export const cleanUp = async (
  searchHistory,
  browser,
  aiSummary
) => {
  try {
    await browser.close();
    console.log(`Scrapper browser has been closed`);
    searchHistory.status = "success";
    searchHistory.summary = aiSummary._id;
    await searchHistory.save();
    console.log(`search history is completed`);
  } catch (error) {
    if (browser) await browser.close();
    searchHistory.status = "failed";
    await searchHistory.save();
    console.log(`SearchHistory updated to failed`);
    throw new APIError(`Failed to process request: ${error.message}`);
  }
};

export const handleError = async (res, searchHistory, browser, error) => {
  console.error(`Error in scraper: ${error.message}`);
  if (searchHistory) {
    searchHistory.status = "failed";
    await searchHistory.save();
    console.log(`SearchHistory updated to failed`);
  }
  if (browser) await browser.close();
  res.status(error.statusCode || 500).json({
    message: error.message || "Failed to process request",
    error: error.message,
  });
};
