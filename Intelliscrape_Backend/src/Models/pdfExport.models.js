import mongoose from "mongoose";
const pdfExportSchema = new mongoose.Schema(
  {
    scraperesultId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScrapeResult",
      required: true,
    },
    filePath: {
      type: String,
    },
  },
  { timestamps: true }
);
export const PDFExport = mongoose.model("PDFExport", pdfExportSchema);