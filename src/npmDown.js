import puppeteer from "puppeteer";
// Or import puppeteer from 'puppeteer-core';

const test = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  // browser.on("targetcreated", async (target) => {
  //   if (target.type() === "page") {
  //     const newPage = target.page();
  //     if (newPage) {
  //       // 检查新页面的 URL 或其他特征以确定是否是目标新标签页
  //       // if (newPage.url().includes('/target-page')) {
  //       //   newPage.waitForNavigation({ waitUntil: 'networkidle2' }).then(() => {
  //       //     // 在新标签页进行抓取操作
  //       //     const title = newPage.title();
  //       //   });
  //       // }
  //       const title = await newPage.$(".hot-list-header .hot-title");
  //       console.log(title);
  //       await browser.close();
  //     }
  //   }
  // });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://juejin.cn/", {
    waitUntil: "load",
    timeout: 60000,
  });

  console.log(page.url());

  await page.waitForSelector(
    ".side-navigator-wrap .nav-item-wrap:nth-child(12) .nav-item-content a"
  );
  await page.$eval(
    ".side-navigator-wrap .nav-item-wrap:nth-child(12) .nav-item-content a",
    (node) => node.click()
  );

  const newPagePromise = new Promise((x) =>
    browser.once("targetcreated", (target) => x(target.page()))
  ); // 声明变量

  let newPage = await newPagePromise; // newPage就是a链接打开窗口的Page对象

  console.log(newPage.url());
  await newPage.waitForTimeout(1000 * 2);
  // const title = await newPage.$(".hot-list-header .hot-title");
  const text = await newPage.$eval(
    ".hot-list-header .hot-title",
    (element) => element.innerText
  );
  console.log(text);
  await browser.close();
};

export default test;
