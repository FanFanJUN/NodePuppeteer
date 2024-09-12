import puppeteer from "puppeteer";
import axios from "axios";
import moment from "moment";

const getData = async (params) => {
  console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
  const { param } = params;
  console.log("param---->", param);
  const IdType = "身份证";
  const IdNum = param[3];
  console.log(typeof IdNum);
  const name = param[4];
  console.log(typeof name);
  console.log(IdType, IdNum, name);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  await page.goto("https://cx.mem.gov.cn/special", {
    waitUntil: "load",
    timeout: 60000,
  });
  console.log("页面加载完成");
  await page.click(
    `.main-content .slot-content .tz-query .flex .q-kd .el-form .el-form-item:nth-child(1) .el-form-item__content .el-select .el-input`
  );
  // await page.waitForTimeout(100);
  await page.click(
    `.el-select-dropdown .el-scrollbar .el-select-dropdown__wrap .el-scrollbar__view .el-select-dropdown__item:nth-child(1)`
  );
  await page.focus(
    ".main-content .slot-content .tz-query .flex .q-kd .el-form .el-form-item:nth-child(2) .el-form-item__content .el-input input"
  );
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type(
    ".main-content .slot-content .tz-query .flex .q-kd .el-form .el-form-item:nth-child(2) .el-form-item__content .el-input input",
    IdNum
  );
  await page.focus(
    ".main-content .slot-content .tz-query .flex .q-kd .el-form .el-form-item:nth-child(3) .el-form-item__content .el-input input"
  );
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type(
    ".main-content .slot-content .tz-query .flex .q-kd .el-form .el-form-item:nth-child(3) .el-form-item__content .el-input input",
    name
  );
  const imgSrc = await page.$$eval(
    ".main-content .slot-content .tz-query .flex .q-kd .el-form .el-form-item:nth-child(4) .el-form-item__content .yzm-style .yzm-style-img",
    (node) => node.map((n) => n.src)
  );
  // console.log('imgSrc--->', imgSrc);
  const newImgSrc = imgSrc[0]?.replace(/^data:image\/[^;]+;base64,/, "").trim();
  // console.log('newImgSrc--->', newImgSrc);
  const predictUrl = "http://api.ttshitu.com/predict";
  const predictRes = await axios.post(
    predictUrl,
    {
      username: "hellfire",
      password: "xsw2#EDC",
      typeid: "1001",
      image: newImgSrc,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const code = predictRes?.data?.data?.result;
  console.log("predictRes--->", predictRes?.data?.data);
  await page.focus(
    ".main-content .slot-content .tz-query .flex .q-kd .el-form .el-form-item:nth-child(4) .el-form-item__content .yzm-style .el-input input"
  );
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type(
    ".main-content .slot-content .tz-query .flex .q-kd .el-form .el-form-item:nth-child(4) .el-form-item__content .yzm-style .el-input input",
    code
  );
  await page.click(
    ".main-content .slot-content .tz-query .flex .q-kd .BTN button:nth-child(2)"
  );
  const resPic = await (
    await page.waitForResponse((response) =>
      response
        .url()
        .includes(
          "https://cx.mem.gov.cn/prod-api/certsearch/certInfo/netQuery?"
        )
    )
  ).json();
  console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
  await browser.close();
  console.log(resPic?.data);
  console.log(JSON.stringify(resPic?.data));
  return JSON.stringify(resPic?.data);
};

export default getData;
