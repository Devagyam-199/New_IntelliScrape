import Router from "express";
import scraper from "../Controllers/scraper.controllers.js";

const scraperoute = Router();

scraperoute.post("/scrape", scraper);

export default scraperoute;
