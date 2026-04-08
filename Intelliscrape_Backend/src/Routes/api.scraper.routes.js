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
scraperoute.get(
  "/history-data/:searchHistoryId",
  accessTokenAuthorized,
  getScrapedData,
);
scraperoute.get(
  "/scrape-status/:jobId",
  accessTokenAuthorized,
  async (req, res) => {
    const job = await scrapeQueue.getJob(req.params.jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });

    const state = await job.getState(); // waiting | active | completed | failed
    const progress = job.progress;
    const result = state === "completed" ? await job.returnvalue : null;
    const failReason = state === "failed" ? job.failedReason : null;

    res.json({ state, progress, result, failReason });
  },
);
export default scraperoute;
