import path from "path";
import fs from "fs";
import moment from "moment";
import fsP from "fs/promises";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export async function readJsonFile() {
  const folderPath = "/Users/licai/download";
  try {
    // 读取文件
    const data = await fsP.readFile(
      "/Users/licai/Downloads/log/eamLog",
      "utf8"
    );
    // 解析为 JSON 对象
    const jsonData = JSON.parse(data || "[]");
    let newLoglistData = [...jsonData];
    if (newLoglistData?.length > 0) {
      const day = 86400000 * 5; // 24小时
      const now = new Date().getTime(); // 当前shijian
      newLoglistData = newLoglistData?.filter(
        (item) =>
          !(
            [
              "control/realtime/homepage",
              "user-behavior/userbehavior/updateUserLog",
              "user-behavior/userbehavior/addUserLog",
              "user/feedback/checkFeedback",
              "message/getUserMessageAll",
            ].filter((a) => item.url?.includes(a))?.length > 0
          )
      );
      newLoglistData = newLoglistData?.filter(
        (item) => now - item.recordTime < day
      );
    }
    const folderPath = "/Users/licai/Downloads/log";
    const filePath = path.join(
      folderPath,
      `/${moment(moment.now()).format("x")}`
    );
    await fs.writeFileSync(filePath, JSON.stringify(newLoglistData), (err) => {
      if (err) {
        console.error("写入文件时出现错误：", err);
      } else {
        console.log("文件写入成功。");
      }
    });
  } catch (err) {
    console.error("读取或解析文件时出错:", err);
  }
}

const fsWrite = async (folder, data, fileType = "json", SDate = "") => {
  // 使用 fs.writeFile 写入文件
  // 检查文件夹是否存在，如果不存在则创建
  const folderPath =
    "/Users/licai/Github/NodePuppeteer/src" + "/download" + "/" + folder;

  const filePath = path.join(
    folderPath,
    `/${SDate || moment(moment.now()).format("YYYY-MM-DD")}.${fileType}`
  );
  console.log(filePath);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  await fs.writeFileSync(filePath, data, (err) => {
    if (err) {
      console.error("写入文件时出现错误：", err);
    } else {
      console.log("文件写入成功。");
    }
  });
};

const fsMd = (data, bigTitle = "") => {
  const dataList = data.map(
    (item) => `🎉  [${item.title}](${item.url ?? "-"})  \n`
  );
  return `## ${bigTitle}  \n` + dataList.join("");
};

export { __dirname, fsWrite, fsMd };
