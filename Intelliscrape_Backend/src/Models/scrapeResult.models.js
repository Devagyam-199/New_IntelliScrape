import mongoose from "mongoose";
const scrapeSchema = new mongoose.Schema(
  {
    searchHistoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SearchHistory",
      required: true,
    },
    rawHTML: {
      type: String,
    },
    cleanData: {
      title: { type: String },
      metaDescription: { type: String },
      metaKeywords: { type: String },
      ogTitle: { type: String },
      ogDescription: { type: String },
      headings: [{ tag: String, text: String }],
      paragraphs: [String],
      items: [
        {
          title: { type: String, required: true },
          price: { type: String },
          availability: { type: String },
        },
      ],
      links: [{ href: String, text: String }],
      imageAlts: [String],
      jsonLd: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);
export const ScrapeResult = mongoose.model("ScrapeResult", scrapeSchema);