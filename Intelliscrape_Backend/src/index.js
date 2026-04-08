import dotenv from "dotenv";
import dbConn from "./DB/dbconn.js";
import { app } from "./app.js";
import { scrapeWorker } from "./queues/scrapeQueue.js";

dotenv.config();
scrapeWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

dbConn()
  .then(() => {
    app.listen(process.env.PORT || 8080, (req, res) => {
      console.log(`Server is running on port ${process.env.PORT || 8080} `);
      console.log(`http://localhost:${process.env.PORT || 8080}`);
    });
  })
  .catch((err) => {
    console.error("database connection failed : ", err);
  });
