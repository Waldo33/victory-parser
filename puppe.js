const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const URL = "https://www.dns-shop.ru/catalog/17a8a01d16404e77/smartfony/?p=";

{
  (async () => {
    try {
      const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        slowMo: 100,
      });
      const page = await browser.newPage();

      await page.setViewport({
        width: 1400,
        height: 900,
      });
      await page.goto(URL, {waitUntil: "domcontentloaded"});
      await page.waitForSelector(".product-buy");
      // await page.waitForSelector('.catalog-product__image')

      const html = await page.content();

      const $ = await cheerio.load(html);

      $(".catalog-product").each((index, el) => {
        const $ = cheerio.load(el);
        const title = $("a.catalog-product__name").text();
        const price = $(".product-buy__price").text();
        console.log({
          title,
          price,
        });
      });

      // await browser.close();
    } catch (e) {
      console.log(e);
    }
  })();
}
