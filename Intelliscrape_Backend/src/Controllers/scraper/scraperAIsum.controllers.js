// scraperAIsum.controllers.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import APIError from "../../Utils/apiError.utils.js";

const summerizer = async (allParas = [], allItems = [], extractedData = {}) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const gemini = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.4,
    },
  });

  const cleanParas = allParas
    .filter(
      (p) => p && !p.match(/^(Sign in|New customer|Your (Lists|Account))/i),
    )
    .slice(0, 5);

  const cleanItems = allItems
    .map(
      (i) =>
        `${i.title}${i.price ? ": " + i.price : ""}${
          i.availability ? ", " + i.availability : ""
        }`,
    )
    .filter((i) => i && !i.match(/modal window|Remaining Time/i))
    .slice(0, 3);

  const contentToSummarize = [
    extractedData.title || "No title",
    extractedData.metaDescription || "No description",
    ...(extractedData.headings?.map((h) => h.text).slice(0, 3) || []),
    ...cleanParas,
    ...cleanItems,
  ].join("\n\n");

  if (!contentToSummarize.trim()) {
    return { summaryData: "No content available to summarize", highlights: [] };
  }

  const truncated = contentToSummarize.substring(0, 2000);

  const prompt = `Summarize the following web content in a concise paragraph (150-200 words), focusing on key themes and product details if applicable. Then provide 3-5 key highlights as bullet points, each starting with '- '.

Content:
${truncated}`;

  try {
    console.log("Calling Gemini API...");
    const result = await gemini.generateContent(prompt);
    const fullResponse = result.response.text().trim();

    if (!fullResponse) {
      console.error("Gemini returned empty response");
      return { summaryData: "Summary unavailable", highlights: [] };
    }

    const parts = fullResponse.split(/\n\n(?=- )/);
    const summaryData = parts[0].trim();
    const highlightsText = parts.slice(1).join("\n\n").trim();
    const highlights = highlightsText
      .split("\n")
      .filter((h) => h.trim().startsWith("- "))
      .map((h) => h.replace(/^- /, "").trim())
      .slice(0, 5);

    console.log("Gemini summary generated successfully");
    return { summaryData, highlights };
  } catch (error) {
    console.error("Gemini API error:", {
      message: error.message,
      status: error.status,
      errorDetails: error.errorDetails,
    });

    if (error.status === 429) {
      throw new APIError(429, "Gemini rate limit exceeded; try again later");
    }
    if (error.status === 400) {
      console.error("Bad request to Gemini — check model name and parameters");
    }
    if (error.status === 403) {
      console.error("Gemini API key issue — check billing or key validity");
    }

    return { summaryData: "Error generating summary", highlights: [] };
  }
};

export default summerizer;
