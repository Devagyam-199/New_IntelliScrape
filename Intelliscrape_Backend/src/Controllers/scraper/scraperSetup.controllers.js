import { addExtra } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import robotParser from "robots-parser";
import axios from "axios";
import { SearchHistory } from "../../Models/searchHistory.models.js";
import APIError from "../../Utils/apiError.utils.js";

const puppeteer = addExtra(puppeteerCore);
puppeteer.use(StealthPlugin());

const scrapperSetup = async (requrl, userId) => {
  try {
    console.log(`Creating setup for url: ${requrl}`);

    const searchHistory = new SearchHistory({
      userId,
      url: requrl,
      status: "pending",
    });

    await searchHistory.save();
    console.log(`Search History has been created with status pending`);

    const urlObj = new URL(requrl);
    const domain = `${urlObj.protocol}//${urlObj.host}`;
    const pathUrl = urlObj.pathname || `/`;

    let robotstxt = "";
    try {
      const roboResponse = await axios.get(`${domain}/robots.txt`, {
        timeout: 1000,
      });
      robotstxt = roboResponse.data || "";
    } catch (error) {
      console.log("No robots.txt found; assuming allowed for scraping");
    }

    const robots = robotParser(`${domain}/robots.txt`, robotstxt);

    const isAllowed =
      robotstxt.trim() === "" || robots.isAllowed(pathUrl, "*") !== false;

    if (!isAllowed) {
      searchHistory.status = "failed";
      await searchHistory.save();
      throw new APIError(
        403,
        `Scraping disallowed by robots.txt for path: ${pathUrl}`
      );
    }

    const crawlDelay = robots.getCrawlDelay("*") || 0;

    const browser = await puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: "new",
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    return { searchHistory, browser, page, crawlDelay };
  } catch (error) {
    throw new APIError(400, error.message || "Failed to set up scraper");
  }
};

export default scrapperSetup;