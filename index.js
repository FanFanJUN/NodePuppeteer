import npmDown from "./src/npmDown.js";
import specialCertificate from "./src/specialCertificate.js";
import juejinTop from "./src/juejinTop.js";
console.log(process.argv);

const scripts = {
  npmDown: npmDown,
  special_certificate: specialCertificate,
  juejinTop: juejinTop,
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
