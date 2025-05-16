import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { XMLParser } from "fast-xml-parser";

const SITEMAP_URL = "https://www.promtior.ai/pages-sitemap.xml";

export async function loadPromtiorPagesFromSitemap() {
  const sitemapRes = await fetch(SITEMAP_URL);
  const sitemapText = await sitemapRes.text();

  const parser = new XMLParser();
  const parsed = parser.parse(sitemapText);
  const urls: string[] = parsed.urlset.url.map((u: any) => u.loc);
  const docs = [];

  for (const url of urls) {
    const loader = new PlaywrightWebBaseLoader(url, {
      launchOptions: { headless: true },
      evaluate: async (page) => {
        return await page.evaluate(() => document.body.innerText);
      },
    });

    const pageDocs = await loader.load();
    docs.push(...pageDocs);
  }

  return docs;
}
