import PDFDocument from "pdfkit";

const scrapePDF = async (
  searchHistory,
  extractedData,
  allParas = [],
  allItems = [],
  summaryData = "No summary available",
  highlights = []
) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .fontSize(22)
      .fillColor("#1e3a5f")
      .text(extractedData?.title || "Scraped Content", { align: "left" });

    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#555").text(`URL: ${searchHistory.url}`);
    doc
      .text(
        `Date: ${new Date().toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })}`
      )
      .moveDown(1);

    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor("#cccccc")
      .stroke()
      .moveDown(0.5);

    doc.fontSize(15).fillColor("#1e3a5f").text("Summary").moveDown(0.3);
    doc.fontSize(11).fillColor("#333").text(summaryData, { align: "justify" }).moveDown(1);

    // Highlight
    if (highlights.length > 0) {
      doc.fontSize(15).fillColor("#1e3a5f").text("Highlights").moveDown(0.3);
      highlights.forEach((h) => {
        doc
          .fontSize(11)
          .fillColor("#444")
          .text(`• ${h.replace(/^- |\* /, "")}`, { indent: 10 })
          .moveDown(0.2);
      });
      doc.moveDown(0.8);
    }

    if (allParas.length > 0) {
      doc.fontSize(15).fillColor("#1e3a5f").text("Main Content").moveDown(0.3);
      allParas.slice(0, 8).forEach((p) => {
        doc.fontSize(11).fillColor("#333").text(p, { align: "justify" }).moveDown(0.5);
      });
    }

    if (allItems.length > 0) {
      doc.moveDown(0.5);
      doc.fontSize(15).fillColor("#1e3a5f").text("Key Items").moveDown(0.3);
      allItems.forEach((item) => {
        const line = [
          item.title,
          item.price ? `Price: ${item.price}` : null,
          item.availability ? `Stock: ${item.availability}` : null,
        ]
          .filter(Boolean)
          .join(" | ");
        doc.fontSize(11).fillColor("#333").text(`• ${line}`, { indent: 10 }).moveDown(0.2);
      });
    }

    doc.end();
  });
};

export default scrapePDF;