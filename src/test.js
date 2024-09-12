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
  await page.goto("https://nodejs.cn/", {
    waitUntil: "load",
    timeout: 60000,
  });

  await page.waitForSelector('[class="cate_item"]');
  const result = await page.evaluate(() => {
    const titleList = document.querySelectorAll(
      '#partner_item_box [class="cate_item"] [class="partner_item"] [class="partner_name"]'
    );
    let title = [];
    titleList.forEach((element) => {
      title.push(element.innerText);
    });
    return title;
  });
  console.log(JSON.stringify(result));

  await browser.close();
};

export default test;
