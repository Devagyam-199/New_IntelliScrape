import { GoogleGenerativeAI } from "@google/generative-ai";
import APIError from "../../Utils/apiError.utils.js";

const summerizer = async (allParas = [], allItems = [], extractedData = {}) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const gemini = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 2000,
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          highlights: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 5,
          },
        },
        required: ["summary", "highlights"],
      }
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

  const prompt = `Summarize the following web content. Write a concise 150-200 word summary focusing on key themes and product details if applicable, and provide 3-5 key highlights as short standalone phrases (return them as separate array items, no bullet formatting needed).

Content:
${truncated}`;

  try {
    console.log("Calling Gemini API...");
    const result = await gemini.generateContent(prompt);

    const candidate = result.response.candidates?.[0];
    if (candidate?.finishReason && candidate.finishReason !== "STOP") {
      console.error(`Gemini finished with reason: ${candidate.finishReason}`);
      return { summaryData: "Summary unavailable", highlights: [] };
    }

    const rawText = result.response.text().trim();
    if (!rawText) {
      console.error("Gemini returned empty response");
      return { summaryData: "Summary unavailable", highlights: [] };
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Gemini returned malformed JSON:", rawText);
      return { summaryData: "Summary unavailable", highlights: [] };
    }

    const summaryData = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
    const highlights = Array.isArray(parsed.highlights)
      ? parsed.highlights.filter((h) => typeof h === "string").slice(0, 5)
      : [];

    if (!summaryData) {
      console.error("Gemini JSON missing valid summary field:", parsed);
      return { summaryData: "Summary unavailable", highlights: [] };
    }

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