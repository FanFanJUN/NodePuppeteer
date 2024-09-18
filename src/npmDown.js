import puppeteer from "puppeteer";
import { fsWrite } from "./util/index.js";
import { fsMd } from "./util/index.js";
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

  const hrefList = await page.$$eval(
    '#partner_item_box [class="cate_item"] [class="partner_item"]',
    (elements) => {
      return elements.map((element) => {
        return element.href;
      });
    }
  );

  const finalResult = result.map((item, index) => {
    return {
      title: item,
      url: hrefList[index],
    };
  });

  const title = await page.title();

  await fsWrite("nodejs", fsMd(finalResult, title), "md");
  await browser.close();
};

export default test;
