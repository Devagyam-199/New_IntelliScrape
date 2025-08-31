import { GoogleGenerativeAI } from "@google/generative-ai";
import APIError from "../../Utils/apiError.utils.js";

const summerizer = async (allParas = [], allItems = [], extractedData = {}) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Filter out repetitive or irrelevant content (e.g., "Sign in", "New customer")
  const cleanParas = allParas.filter(
    (p) => p && !p.match(/^(Sign in|New customer\? Start here\.|Your (Lists|Account))/i)
  );
  const cleanItems = allItems.map(
    (i) =>
      `${i.title}${i.price ? ": " + i.price : ""}${
        i.availability ? ", " + i.availability : ""
      }`
  ).filter((i) => i && !i.match(/modal window|Remaining Time/i));

  // Combine content with newlines to preserve structure
  const contentToSummarize = [
    extractedData.title || "No title",
    extractedData.metaDescription || "No description",
    ...(extractedData.headings?.map((h) => h.text) || []),
    ...cleanParas,
    ...cleanItems,
  ].join("\n\n");

  if (!contentToSummarize.trim()) {
    return { summaryData: "No content available to summarize", highlights: [] };
  }

  // Single prompt for summary and highlights
  const prompt = `
Summarize the following web content in a concise paragraph (200-250 words), focusing on key themes, purpose, and product details (if applicable).

Then, provide 80% of key highlights as bullet points starting with '- '. Focus on unique product details, categories, or features that stand out.

Content:
${contentToSummarize}
  `;

  try {
    console.log("Generating summary and highlights with Gemini API");
    const result = await gemini.generateContent(prompt);
    const fullResponse = result.response.text().trim();
    console.log("Gemini response:", fullResponse); // Debug

    // Parse response into summary and highlights
    const parts = fullResponse.split(/\n\n(?=- )/); // Split before bullet points
    const summaryData = parts[0].trim();
    const highlightsText = parts.slice(1).join("\n\n").trim();
    const highlights = highlightsText
      .split("\n")
      .filter((h) => h.trim().startsWith("- "))
      .map((h) => h.replace(/^- /, "").trim());

    console.log("Parsed highlights:", highlights); // Debug
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