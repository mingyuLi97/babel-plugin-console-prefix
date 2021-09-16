const log = require("./log");
const testLog = require("./test");

console.log();
console.log("log");
console.warn("warn");
console.info("info");
console.error("error");
console.table(["one", "two"]);
console.log(111);
console.log(true);
console.log(["a", "b"]);
console.log({ a: 1 });
console.log(undefined);
console.log(null);
const num = 111;
console.log(`${num}-1111`);
console.log(
  "%c前端开发 %c calamus.xyz %c 蒲",
  "color:red",
  "",
  "color:orange;font-weight:bold"
);
log("--", "limy");
_log();
testLog('--', 'limy');

function _log() {
  console.log(` 模版字符串 ${111}`);
}
