const puppeteer = require("puppeteer");

(async () => {
  // headless browser by default
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://data.police.uk/data/");

  // do actions here, e.g click checkboxes, select dates
  await page.click("#id_forces_1");
  await page.click('button[type="submit"]');

  // we wait for ajax request to /data/progress/<uuid> which is signal that we are in download page
  await page.waitForRequest((request) => {
    return request.url().includes("progress") && request.method() === "GET";
  });
  // wait for polling to finish, they change the button text from Generating to Download now
  await page.waitForFunction(
    'document.querySelector("#content > div > a").innerText.includes("Download now")'
  );

  const url = await page.evaluate(() => {
    // get link by xpath
    const linkWithUrl = document.evaluate(
      '//*[@id="content"]/div[@role="main"]/a',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    return linkWithUrl.getAttribute("href");
  });
  // do what you want with the extracted url here
  console.log(url);

  await browser.close();
})();
