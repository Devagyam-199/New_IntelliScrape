import APIError from "../../Utils/apiError.utils.js";

const dataExtractor = async (page, searchHistory, maxPages = 2, crawlDelay) => {
  let allParas = [];
  let allItems = [];
  let extractedData;
  let pageCount = 0;
  let currentUrl = searchHistory.url;

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const resourceType = req.resourceType();
    if (["image", "media", "font", "stylesheet"].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  while (pageCount < maxPages) {
    let attempt = 0;
    while (attempt < 2) {
      try {
        console.log(`Navigating to ${currentUrl} (Page ${pageCount + 1})`);
        await page.goto(currentUrl, {
          waitUntil: "domcontentloaded",
          timeout: 5000,
        });
        break;
      } catch (error) {
        attempt++;
        if (attempt >= 2) {
          throw new APIError(429, `Navigation failed for ${currentUrl}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
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
      await new Promise((resolve) => {
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(resolve, 500);
      });
    });

    const pageData = await page.evaluate(() => {
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
        .filter((h) => h.text)
        .slice(0, 10);
      const paragraphs = Array.from(
        document.querySelectorAll(
          'p, article, div.content, main, section, div[class*="content"], div[class*="main"], div[class*="article"]'
        )
      )
        .map((p) => p.innerText.trim())
        .filter((t) => t)
        .slice(0, 10);
      const links = Array.from(document.querySelectorAll("a"))
        .map((a) => ({
          href: a.href,
          text: a.innerText.trim(),
        }))
        .filter((l) => l.text && l.href)
        .slice(0, 5);
      const imageAlts = Array.from(document.querySelectorAll("img[alt]"))
        .map((img) => img.alt.trim())
        .filter((alt) => alt)
        .slice(0, 5);
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
        .slice(0, 3);
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

    if (pageCount === 0) {
      extractedData = pageData;
    }

    allParas.push(...pageData.paragraphs);
    allItems.push(...pageData.items);

    const nextPage = await page.evaluate(() => {
      const nextButton = document.querySelector(
        `a.next, a[rel="next"], button.next, a[class*="next"], button[class*="next"]`
      );
      return nextButton?.href || null;
    });

    if (!nextPage || pageCount >= maxPages - 1) {
      console.log(`No more pages to scrape or max pages (${maxPages}) reached`);
      break;
    }

    currentUrl = nextPage;
    pageCount++;
    await new Promise((resolve) => setTimeout(resolve, crawlDelay * 1000));
  }

  allParas = [...new Set(allParas)];
  allItems = [...new Set(allItems.map(JSON.stringify))].map(JSON.parse);

  return { allParas, allItems, extractedData };
};

export default dataExtractor;