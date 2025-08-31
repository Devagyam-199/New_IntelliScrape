import { GoogleGenerativeAI } from "@google/generative-ai";
import APIError from "../../Utils/apiError.utils.js";

const summerizer = async (allParas, allItems, extractedData) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const contentToSummarize = [
    extractedData.title,
    extractedData.metaDescription,
    ...extractedData.headings.map((h) => h.text),
    ...allParas,
    ...allItems.map(
      (i) =>
        `${i.title}${i.price ? ": " + i.price : ""}${
          i.availability ? ", " + i.availability : ""
        }`
    ),
  ]
    .join(" ")
    .substring(0, 4000);
  let summaryData;
  try {
    console.log("Generating summary with Gemini API");
    const result = await gemini.generateContent(
      `Summarize the following web content in 200-290 words, focusing on key themes and purpose: ${contentToSummarize}`
    );
    summaryData = result.response.text();
  } catch (error) {
    console.error(`Gemini summary error: ${error.message}`);
    if (error.status === 429) {
      throw new APIError(429, "Gemini rate limit exceeded; try again later");
    }
    throw error;
  }

  let highlights = [];
  try {
    console.log("Generating highlights with Gemini API");
    const highlightResult = await gemini.generateContent(
      `Extract 80% of key highlights or important sentences from this web content, in bullet points: ${contentToSummarize}`
    );
    highlights = highlightResult.response
      .text()
      .split("\n")
      .filter((h) => h.trim().startsWith("- ") || h.trim().startsWith("* "));
  } catch (error) {
    console.log(`Failed to generate highlights: ${error.message}`);
  }

  return { summaryData, highlights };
};

export default summerizer;