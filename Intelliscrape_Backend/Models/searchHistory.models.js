const mongoose = require("mongoose");
const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
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
  },
  { timestamps: true }
);
export const SearchHistory = mongoose.model(
  "SearchHistory",
  searchHistorySchema
);
