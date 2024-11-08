import path from "path";
import fs from "fs";
import moment from "moment";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

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
