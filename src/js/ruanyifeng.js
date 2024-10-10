import puppeteer from "puppeteer";
import { fsMd, fsWrite } from "../util/index.js";
// Or import puppeteer from 'puppeteer-core';

const getPageData = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://www.ruanyifeng.com/blog/archives.html", {
    waitUntil: "load",
    timeout: 60000,
  });
  await page.waitForSelector(
    ".module-categories .module-content .module-list li.module-list-item"
  );

  const res = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      "#alpha-inner .module-categories .module-content .module-list li.module-list-item a"
    );
    const dateEle = document.querySelectorAll(
      "#alpha-inner .module-categories .module-content .module-list li.module-list-item"
    );
    return Array.from(elements)?.map((element, index) => {
      return {
        title: `${dateEle[index].innerText}`,
        url: element.href,
      };
    });
  });

  const headerList = await page.$$eval(
    "#alpha-inner .asset-header .entry-title a",
    (elements) => {
      return elements.map((element) => {
        return {
          title: element.innerText,
          url: element.href,
        };
      });
    }
  );
  const title = await page.title();

  await fsWrite("ruanyifeng", fsMd([...headerList, ...res], title), "md");
  await browser.close();
};

export default getPageData;
