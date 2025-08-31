import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

const scrapePDf = async (
  searchHistory,
  extractedData,
  allParas = [],
  allItems = [],
  summaryData = "No summary available",
  highlights = []
) => {
  // Ensure arrays are valid
  allParas = Array.isArray(allParas) ? allParas : [];
  allItems = Array.isArray(allItems) ? allItems : [];
  highlights = Array.isArray(highlights) ? highlights : [];

  console.log("PDF data:", { // Debug
    title: extractedData?.title,
    url: searchHistory.url,
    summaryData,
    highlights,
    paragraphCount: allParas.length,
    itemCount: allItems.length,
  });

  const escapeHtml = (text) => {
    if (typeof text !== "string") return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${escapeHtml(extractedData?.title || "Scraped Webpage")}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="font-sans text-gray-800 max-w-4xl mx-auto p-8">
      <h1 class="text-3xl font-bold mb-4">${escapeHtml(
        extractedData?.title || "Scraped Webpage"
      )}</h1>
      <p class="mb-2"><strong class="font-semibold">URL:</strong> <a href="${
        searchHistory.url
      }" class="text-blue-600 hover:underline">${searchHistory.url}</a></p>
      <p class="mb-6"><strong class="font-semibold">Date:</strong> ${new Date().toLocaleDateString(
        "en-US",
        { timeZone: "Asia/Kolkata" }
      )}</p>

      <h2 class="text-2xl font-semibold mb-3">Summary</h2>
      <p class="text-gray-700 mb-6">${escapeHtml(summaryData)}</p>

      ${
        highlights.length > 0
          ? `<h2 class="text-2xl font-semibold mb-3">Highlights</h2>
            <ul class="list-disc pl-6 mb-6">
              ${highlights
                .map(
                  (h) =>
                    `<li class="font-bold text-blue-800 mb-2">${escapeHtml(
                      h.replace(/^- |\* /, "")
                    )}</li>`
                )
                .join("")}
            </ul>`
          : ""
      }

      <h2 class="text-2xl font-semibold mb-3">Main Content</h2>
      ${allParas
        .map((p) => `<p class="text-gray-700 mb-4">${escapeHtml(p)}</p>`)
        .join("")}

      ${
        allItems.length > 0
          ? `
        <h2 class="text-2xl font-semibold mb-3">Key Items</h2>
        <ul class="list-disc pl-6 mb-6">
          ${allItems
            .map(
              (item) =>
                `<li class="text-gray-700">${escapeHtml(item.title)}${
                  item.price ? ": " + escapeHtml(item.price) : ""
                }${
                  item.availability ? ", " + escapeHtml(item.availability) : ""
                }</li>`
            )
            .join("")}
        </ul>`
          : ""
      }
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: true });
  const pdfPage = await browser.newPage();
  try {
    console.log("Generating PDF content in memory");
    await pdfPage.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await pdfPage.pdf({
      format: "A4",
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      printBackground: true,
    });
    console.log("PDF generated in memory for SearchHistory");
    await pdfPage.close();
    await browser.close();
    return pdfBuffer;
  } catch (error) {
    await pdfPage.close();
    await browser.close();
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

export default scrapePDf;