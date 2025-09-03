const scraper = async (req, res) => {
  let searchHistory, browser, page, crawlDelay;
  try {
    const { requrl, maxPages = 1 } = req.body;
    const userId = req.user.id;
    if (!requrl || typeof requrl !== "string" || !requrl.trim()) {
      throw new APIError(400, "Valid URL is required to begin scraping");
    }
    try {
      new URL(requrl);
    } catch {
      throw new APIError(400, "Invalid URL format");
    }

    ({ searchHistory, browser, page, crawlDelay } = await scrapperSetup(
      requrl,
      userId
    ));

    const { allParas, allItems, extractedData } = await dataExtractor(
      page,
      searchHistory,
      maxPages,
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
    const aiSummary = new AISummary({
      scraperesultId: scrapeResult._id,
      summaryData,
      summaryModel: "gemini-1.5-flash",
      userId,
    });

    await Promise.all([scrapeResult.save(), aiSummary.save()]);
    console.log(`ScrapeResult and AISummary saved`);

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