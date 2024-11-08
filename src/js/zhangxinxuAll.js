import moment from "moment";
import puppeteer from "puppeteer";
import { fsMd, fsWrite } from "../util/index.js";
// Or import puppeteer from 'puppeteer-core';

let articleAll = [];
let pageNum = 1;

async function xunHuanGet(page) {
  console.log("pageNum", pageNum);
  await page.waitForTimeout(1 * 1000);
  let continueFlag = true;
  // 点击翻页
  if (pageNum > 1) {
    const ele = await page.$(".wp-pagenavi .nextpostslink");
    if (!ele) {
      return;
    }
    await page.$eval(".wp-pagenavi .nextpostslink", (element) => {
      element.click();
    });
  }

  await page.waitForSelector("[id='content'] [role='update']", {
    timeout: 60000,
  });
  const articleDateList = await page.$$eval(
    "[id='content'] .type-post.hentry:not(.sticky) small [role='update']",
    (elements) => elements.map((element) => element.innerText)
  );
  let articleList = [];
  if (articleDateList.length) {
    const aList = await page.$$eval(
      "[id='content'] .type-post.hentry:not(.sticky) h2 a.entry-title",
      (elements) =>
        elements.map((element) => {
          return {
            title: `${element.innerText}`,
            url: element.href,
          };
        })
    );

    articleDateList.forEach((item, index) => {
      const [dateYear] = moment(item, "YYYY-M-D").format("YYYY-M-D").split("-");
      articleList.push({
        ...aList[index],
        title: `${moment(item, "YYYY-MM-DD").format("YYYY-MM-DD")} ${
          aList[index].title
        }`,
        date: item,
        dateStr: dateYear,
      });
    });
  }
  if (articleList?.length) {
    articleAll.push(...articleList);
  }
  if (continueFlag) {
    pageNum++;
    await xunHuanGet(page);
  }
}

const getPageData = async (params) => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://www.zhangxinxu.com/", {
    waitUntil: "load",
    timeout: 60000,
  });

  await page.waitForSelector("#menubar [class='menu_tab'] li a");

  await page.$eval(
    "#menubar [class='menu_tab'] li:nth-child(2) a:nth-child(1)",
    async (element) => await element.click()
  );
  await xunHuanGet(page);
  let resObj = {};
  articleAll?.forEach((item) => {
    if (!resObj[item.dateStr]) {
      resObj[item.dateStr] = [item];
    } else {
      resObj[item.dateStr].push(item);
    }
  });
  Object.keys(resObj).forEach(async (item) => {
    if (resObj[item]?.length) {
      await fsWrite(
        "张鑫旭文章",
        fsMd(resObj[item]),
        "md",
        moment(moment(new Date())).format("YYYY") === resObj[item]?.[0].dateStr
          ? null
          : resObj[item]?.[0].dateStr + "年"
      );
    }
  });
  await browser.close();
};

export default getPageData;
