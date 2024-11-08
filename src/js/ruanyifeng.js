import puppeteer from "puppeteer";
import { fsMd, fsWrite } from "../util/index.js";
import moment from "moment";
// Or import puppeteer from 'puppeteer-core';

const getPageData = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://www.ruanyifeng.com/blog/weekly/", {
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
      "#alpha-inner .module-categories .module-content .module-list li.module-list-item .RankBar .hint"
    );
    return Array.from(elements)?.map((element, index) => {
      const date = dateEle[index].innerText.split("@")[1].split("）")[0];
      return {
        title: `${elements[index].innerText}  (${date})`,
        url: element.href,
        date: date?.split(".")[0],
      };
    });
  });

  const title = await page.title();
  let resObj = {};
  res?.forEach((item) => {
    if (!resObj[item.date]) {
      resObj[item.date] = [item];
    } else {
      resObj[item.date].push(item);
    }
  });
  Object.keys(resObj).forEach(async (item) => {
    if (resObj[item]?.length) {
      await fsWrite(
        "ruanyifeng",
        fsMd(resObj[item]),
        "md",
        moment(moment(new Date())).format("YYYY") === resObj[item]?.[0].date
          ? null
          : resObj[item]?.[0].date + "年"
      );
    }
  });
  await browser.close();
};

export default getPageData;
