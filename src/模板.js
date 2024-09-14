import puppeteer from "puppeteer";
// Or import puppeteer from 'puppeteer-core';

const getPageData = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://juejin.cn/", {
    waitUntil: "load",
    timeout: 60000,
  });
  await browser.close();
};

export default getPageData;
