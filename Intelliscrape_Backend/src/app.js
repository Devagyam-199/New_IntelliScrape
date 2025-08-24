import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./Utils/errorHandler.utils.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

import uservalidationrouter from "./Routes/api.userSignUp.routes.js";
import accessTokenValidatorRoute from "./Routes/api.authAccessTokenValidate.routes.js";
import scraperoute from "./Routes/api.scraper.routes.js";

app.use("/api/v1/user", uservalidationrouter);
app.use("/api/v1/auth", accessTokenValidatorRoute);
app.use("/api/v1/access", scraperoute);

app.use(globalErrorHandler);

export { app };
