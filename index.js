import {
  npmDown,
  specialCertificate,
  juejinTop,
  ruanyifeng,
  zhangxinxu,
  zhangxinxuAll,
} from "./src/js/index.js";
console.log(process.argv);

const scripts = {
  npmDown: npmDown,
  special_certificate: specialCertificate,
  juejinTop: juejinTop,
  ruanyifeng: ruanyifeng,
  zhangxinxu,
  zhangxinxuAll: zhangxinxuAll,
};
const scriptName = process.argv[2];
// 自执行js
(async () => {
  try {
    scripts[scriptName]({
      param: process.argv,
    });
  } catch (e) {
    console.log(e.message);
  }
})();
