import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import robotParser from "robots-parser";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AISummary } from "../Models/AISummary.models.js";
import { ScrapeResult } from "../Models/scrapeResult.models.js";
import { SearchHistory } from "../Models/searchHistory.models.js";
import APIError from "../Utils/apiError.utils.js";
import robotsParser from "robots-parser";

const scraper = async (req, res) => {
  puppeteer.use(StealthPlugin());
  try {
    const { requrl } = req.body;
    const userId = req.user.id;

    if (!requrl) {
      throw new APIError(400, "URL need inorder to begin scraping");
    }

    let searchHistory = new SearchHistory({
      userId,
      url: requrl,
      status: `pending`,
    });

    await searchHistory.save();

    const urlObj = new URL(requrl);
    const domain = `${urlObj.protocol}//${urlObj.host}`;
    const path = urlObj.pathname + urlObj.search;

    let robotsTxt = "";

    try {
      const roboResponse = await axios.get(`${domain}/robots.txt`, {
        timeout: 5000,
      });

      robotsTxt = roboResponse.data;
    } catch (error) {
      console.log(
        "No robots.txt file found, scrapping might be unethical here, proceeding cautiously"
      );
    }

    const robots = robotsParser(`${domain}/robots.txt`, robotsTxt);

    if (!robots.isAllowed(path, `*`)) {
      searchHistory.status = "failed";
      await searchHistory.save();
      throw new APIError(
        403,
        `Scraping disallowed by robots.txt for path: ${path}`
      );
    }

    // just for testing branch is made properly or not
  } catch (error) {}
};

export default scraper;
