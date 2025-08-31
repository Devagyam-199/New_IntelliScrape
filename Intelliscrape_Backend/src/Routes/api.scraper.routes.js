import { Router } from "express";
import scraper from "../Controllers/scrapper.controllers.js";
import generatePDF from "../Controllers/pdfGenerator.controllers.js";
import accessTokenAuthorized from "../Middlewares/verifyAccessToken.middlewares.js";
import getUserHistory from "../Controllers/history.controllers.js";
import getScrapedData from "../Controllers/historyData.controllers.js";

const scraperoute = Router();

scraperoute.post("/scrape", accessTokenAuthorized, scraper);
scraperoute.all("/generate-pdf", accessTokenAuthorized, generatePDF);
scraperoute.get("/history", accessTokenAuthorized, getUserHistory);
scraperoute.get("/history-data/:searchHistoryId", accessTokenAuthorized, getScrapedData);

export default scraperoute;
