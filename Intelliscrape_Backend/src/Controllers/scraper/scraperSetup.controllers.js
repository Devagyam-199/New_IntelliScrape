import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import robotParser from "robots-parser";
import axios from "axios";
import { SearchHistory } from "../../Models/searchHistory.models.js";
import APIError from "../../Utils/apiError.utils.js";

puppeteer.use(stealthPlugin());

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

    const robots = robotParser(`${domain}//robots.txt`, robotstxt);

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
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      ],
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    return { searchHistory, browser, page, crawlDelay };
  } catch (error) {
    throw new APIError(400, error);
  }
};

export default scrapperSetup;