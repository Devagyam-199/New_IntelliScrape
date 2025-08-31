import mongoose from "mongoose";
import { stringify } from "querystring";
const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index:true,
    },
    url: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
    summary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AISummary",
    },
    pdfexported: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PDFExport",
    },
    pdfPath: {
      type: String,
    },
  },
  { timestamps: true }
);
export const SearchHistory = mongoose.model(
  "SearchHistory",
  searchHistorySchema
);
