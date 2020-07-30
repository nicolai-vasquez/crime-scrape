const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://data.police.uk/data/");

  await page.click("#id_forces_1");
  await page.click('button[type="submit"]');
  await page.waitForRequest((request) => {
    return request.url().includes("progress") && request.method() === "GET";
  });
  await page.waitForFunction(
    'document.querySelector("#content > div > a").innerText.includes("Download now")'
  );

  const url = await page.evaluate(() => {
    const linkWithUrl = document.evaluate(
      '//*[@id="content"]/div[@role="main"]/a',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    return linkWithUrl.getAttribute("href");
  });
  console.log(url);

  await browser.close();
})();
