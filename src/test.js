import puppeteer from "puppeteer";
// Or import puppeteer from 'puppeteer-core';

const test = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://pptr.nodejs.cn/", {
    waitUntil: "load",
    timeout: 60000,
  });

  await page.waitForSelector(
    "#__docusaurus_skipToContent_fallback > div > div > main > div > div > div > div > article > div > header > h1"
  );
  const result = await page.evaluate(() => {
    const title = document.querySelector(
      "#__docusaurus_skipToContent_fallback > div > div > main > div > div > div > div > article > div > header > h1"
    ).innerText;
    return { title };
  });
  console.log(result);

  await browser.close();
};

export default test;
