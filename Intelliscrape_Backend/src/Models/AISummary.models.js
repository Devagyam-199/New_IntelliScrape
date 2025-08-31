import mongoose from 'mongoose';
const summarySchema = new mongoose.Schema(
  {
    scraperesultId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScrapeResult',
      required: true,
    },
    summaryData: {
      type: String,
      required: true,
    },
    summaryModel: {
      type: String,
      default: 'gemini-2.5-flash',
      required: true,
    },
    highlights:[String],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
export const AISummary = mongoose.model('AISummary', summarySchema);