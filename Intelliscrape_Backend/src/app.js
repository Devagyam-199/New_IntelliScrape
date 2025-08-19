import express from "express";
import cors from "cors";
import router from "./Routes/api.userSignUp.routes.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./Utils/errorHandler.utils.js";

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", router);
app.use(globalErrorHandler);

export { app };
