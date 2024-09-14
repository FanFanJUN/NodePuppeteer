import puppeteer from "puppeteer";
import { fsMd, fsWrite } from "./util/index.js";
// Or import puppeteer from 'puppeteer-core';
const juejinTop = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });

  // browser.on("targetcreated", async (target) => {
  //   const newPage = await target.page();
  //   if (newPage) {
  //     newPage.on("load", async () => {
  //       console.log("新窗口的 URL：", newPage.url());
  //     });
  //   }
  // });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
  );

  // Navigate the page to a URL.
  await page.goto("https://juejin.cn/hot/articles/6809637767543259144", {
    waitUntil: "load",
    timeout: 60000,
  });
  /* await page.waitForSelector(
    ".hot-side-nav .vertical .nav-item-wrap:nth-child(2) .sub-nav-item-wrap .nav-item-content:nth-child(3) a span"
  );

  // 找到特定元素并触发点击事件
  const ele = await page.$(
    ".hot-side-nav .vertical .nav-item-wrap:nth-child(2) .sub-nav-item-wrap .nav-item-content:nth-child(3)"
  );
  console.log(ele);

  await ele.click(); */

  //  page.$$eva 获取页面上所有的 <a> 元素的文本内容，但不能直接触发点击事件
  /* const resc = await page.$$eval(
    ".hot-side-nav .vertical .nav-item-wrap:nth-child(2) .sub-nav-item-wrap .nav-item-content:nth-child(3)",
    (element) => {
      console.log(element);
      return element.map((element) => element.innerText);
    }
  );

  console.log(resc); */

  // await page.waitForTimeout(1000 * 2);

  // 等待请求
  // const articleList = await (
  //   await page.waitForResponse((res) => {
  //     return res
  //       .url()
  //       .includes("https://api.juejin.cn/content_api/v1/content/article_rank");
  //   })
  // ).json();
  // await page.waitForSelector(".hot-list-wrap .hot-list .article-item-wrap");

  // const articleList = await page.$$eval(
  //   ".hot-list-wrap .hot-list .article-item-wrap .article-item-left .article-detail >  .article-title",
  //   (elements) => {
  //     console.log(elements);
  //     return elements.map((element) => element.innerText);
  //   }
  // );
  await page.waitForSelector(
    ".hot-list-wrap .hot-list .article-item-wrap .article-item-left .article-detail >  .article-title"
  );

  await page.waitForTimeout(1000 * 2);
  const res = await page.$$(
    ".hot-list-wrap .hot-list .article-item-wrap .article-item-left .article-detail >  .article-title"
  );

  let articleList = [];
  for (let index = 0; index < res.length; index++) {
    const articleTitle = await res[index].evaluate(
      (element) => element.innerText
    );
    console.log(articleTitle);
    await res[index].click();
    const newPagePromise = new Promise((x) =>
      browser.once("targetcreated", (target) => x(target.page()))
    ); // 声明变量
    let newPage = await newPagePromise;
    await page.waitForTimeout(1000 * 2);
    console.log(newPage.url());
    articleList.push({
      title: articleTitle,
      url: newPage.url(),
    });
  }

  console.log(articleList);
  const title = await page.title();
  await fsWrite("juejinTop", fsMd(articleList, title), "md");
  await browser.close();
};

export default juejinTop;
