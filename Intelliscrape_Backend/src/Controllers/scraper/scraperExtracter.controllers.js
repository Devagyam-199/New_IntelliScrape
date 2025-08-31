import APIError from "../../Utils/apiError.utils.js";

const dataExtractor = async (page, searchHistory, maxPages, crawlDelay) => {
  let allParas = [];
  let allItems = [];
  let currentUrl = searchHistory.url;
  let pageCount = 0;
  let extractedData;

  while (pageCount < maxPages) {
    let attempt = 0;
    while (attempt < 3) {
      try {
        console.log(`Navigating to ${currentUrl}`);
        await page.goto(currentUrl, {
          waitUntil: "networkidle2",
          timeout: "7000",
        });
        break;
      } catch (error) {
        attempt++;
        if (attempt >= 3) {
          throw new APIError(429, `Navigation failed for ${currentUrl}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      }
    }

    const hasCaptcha = await page.evaluate(() => {
      return (
        !!document.querySelector(".g-recaptcha") ||
        !!document.querySelector("#cf-turnstile")
      );
    });
    if (hasCaptcha) {
      throw new Error("Captcha detected; cannot proceed ethically");
    }

    await page.evaluate(async () => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight)
          clearInterval(timer);
      }, 100);
    });
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    extractedData = await page.evaluate(() => {
      const title = document.querySelector("title")?.innerText || "No title";
      const metaDescription =
        document.querySelector('meta[name="description"]')?.content ||
        "No description";
      const metaKeywords =
        document.querySelector('meta[name="keywords"]')?.content ||
        "No keywords";
      const ogTitle =
        document.querySelector('meta[property="og:title"]')?.content || null;
      const ogDescription =
        document.querySelector('meta[property="og:description"]')?.content ||
        null;
      const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
        .map((h) => ({
          tag: h.tagName.toLowerCase(),
          text: h.innerText.trim(),
        }))
        .filter((h) => h.text);
      const paragraphs = Array.from(
        document.querySelectorAll(
          'p, article, div.content, main, section, div[class*="content"], div[class*="main"], div[class*="article"]'
        )
      )
        .map((p) => p.innerText.trim())
        .filter((t) => t)
        .slice(0, 20);
      const links = Array.from(document.querySelectorAll("a"))
        .map((a) => ({
          href: a.href,
          text: a.innerText.trim(),
        }))
        .filter((l) => l.text && l.href)
        .slice(0, 10);
      const imageAlts = Array.from(document.querySelectorAll("img[alt]"))
        .map((img) => img.alt.trim())
        .filter((alt) => alt)
        .slice(0, 10);
      const jsonLd = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      )
        .map((script) => {
          try {
            return JSON.parse(script.innerText);
          } catch {
            return null;
          }
        })
        .filter((data) => data);
      const items = Array.from(
        document.querySelectorAll(
          "article, div.product, div.item, li.product, li.item, section.product, div.card, div.post"
        )
      )
        .map((item) => {
          const itemTitle =
            item
              .querySelector(
                'h1, h2, h3, h4, .title, [class*="title"], [class*="name"]'
              )
              ?.innerText.trim() || "No title";
          const itemPrice =
            item
              .querySelector('.price, [class*="price"], [class*="cost"]')
              ?.innerText.trim() || null;
          const itemAvailability =
            item
              .querySelector(
                '.availability, [class*="stock"], [class*="availability"]'
              )
              ?.innerText.trim() || null;
          return {
            title: itemTitle,
            price: itemPrice,
            availability: itemAvailability,
          };
        })
        .filter((item) => item.title && (item.price || item.availability))
        .slice(0, 5);
      return {
        title,
        metaDescription,
        metaKeywords,
        ogTitle,
        ogDescription,
        headings,
        paragraphs,
        links,
        imageAlts,
        jsonLd: jsonLd.length > 0 ? jsonLd[0] : null,
        items,
      };
    });

    allParas.push(...extractedData.paragraphs);
    allItems.push(...extractedData.items);

    const nextPage = await page.evaluate(() => {
      const nextButton = document.querySelector(
        `a.next, a[rel="next"], button.next, a[class*="next"], button[class*="next"]`
      );
      return nextButton?.href || null;
    });

    if (!nextPage || pageCount >= maxPages - 1) break;

    currentUrl = nextPage;
    pageCount++;
    await new Promise((resolve) => setTimeout(resolve, crawlDelay * 1000));
  }

  return { allParas, allItems, extractedData };
};

export default dataExtractor;
