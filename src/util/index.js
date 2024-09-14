import path from "path";
import fs from "fs";
import moment from "moment";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const fsWrite = async (folder, data) => {
  // 使用 fs.writeFile 写入文件
  // 检查文件夹是否存在，如果不存在则创建
  const folderPath =
    "/Users/licai/Github/NodePuppeteer/src" + "/download" + "/" + folder;

  const filePath = path.join(
    folderPath,
    `/${moment(moment.now()).format("YYYY-MM-DD")}.json`
  );
  console.log(folderPath);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  await fs.writeFileSync(filePath, JSON.stringify(data), (err) => {
    if (err) {
      console.error("写入文件时出现错误：", err);
    } else {
      console.log("文件写入成功。");
    }
  });
};

export { __dirname, fsWrite };
