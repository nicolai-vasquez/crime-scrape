const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://data.police.uk/data/");

  await page.click("#id_forces_1");
  await page.click('button[type="submit"]');

  // await browser.close();
})();
