import { GoogleGenerativeAI } from "@google/generative-ai";
import APIError from "../../Utils/apiError.utils.js";

const summerizer = async (allParas = [], allItems = [], extractedData = {}) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const cleanParas = allParas
    .filter(
      (p) => p && !p.match(/^(Sign in|New customer\? Start here\.|Your (Lists|Account))/i)
    )
    .slice(0, 5);
  const cleanItems = allItems
    .map(
      (i) =>
        `${i.title}${i.price ? ": " + i.price : ""}${
          i.availability ? ", " + i.availability : ""
        }`
    )
    .filter((i) => i && !i.match(/modal window|Remaining Time/i))
    .slice(0, 3);

  const contentToSummarize = [
    extractedData.title || "No title",
    extractedData.metaDescription || "No description",
    ...(extractedData.headings?.map((h) => h.text).slice(0, 3) || []), // Limit to 3 headings
    ...cleanParas,
    ...cleanItems,
  ].join("\n\n");

  if (!contentToSummarize.trim()) {
    return { summaryData: "No content available to summarize", highlights: [] };
  }
  const prompt = `
Summarize the following web content in a concise paragraph (150-200 words), focusing on key themes and product details (if applicable). Provide 3-5 key highlights as bullet points starting with '- '. Focus on unique product details or features.

Content:
${contentToSummarize.substring(0, 2000)} // Limit input to 2000 chars
  `;

  try {
    console.log("Generating summary with Gemini API");
    const result = await gemini.generateContent(prompt);
    const fullResponse = result.response.text().trim();

    const parts = fullResponse.split(/\n\n(?=- )/);
    const summaryData = parts[0].trim();
    const highlightsText = parts.slice(1).join("\n\n").trim();
    const highlights = highlightsText
      .split("\n")
      .filter((h) => h.trim().startsWith("- "))
      .map((h) => h.replace(/^- /, "").trim())
      .slice(0, 5);

    return { summaryData, highlights };
  } catch (error) {
    console.error(`Gemini error: ${error.message}`);
    if (error.status === 429) {
      throw new APIError(429, "Gemini rate limit exceeded; try again later");
    }
    return { summaryData: "Error generating summary", highlights: [] };
  }
};

export default summerizer;