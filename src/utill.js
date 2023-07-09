import chalk from "chalk";
import { randomBytes, createHash } from 'crypto';

export const launcherURL = "https://launcher.escapefromtarkov.com"

function getTime() {
  var Time = new Date();
  var Sec = Time.getSeconds();
  var Min = Time.getMinutes();
  var Hour = Time.getHours();
  return Hour + ":" + Min + ":" + Sec
}

/**
 * @param {*} atr "success","info","error","warning"を設定
 */
export function _print(atr, string) {
  atr = atr.toLowerCase()
  if(atr === "info") {
    return console.log(chalk.blue.bold("Info     | ")   + chalk.magenta(getTime()) + chalk.white(" |  ") + string)
  } else if(atr === "success") {
    return console.log(chalk.green.bold("Succes   | ")  + chalk.magenta(getTime()) + chalk.white(" |  ") + string)
  } else if(atr === "error") {
    return console.log(chalk.red.bold("Error    | ")    + chalk.magenta(getTime()) + chalk.white(" |  ") + string)
  } else if(atr === "warning") {
    return console.log(chalk.yellow.bold("Warrning | ") + chalk.magenta(getTime()) + chalk.white(" |  ") + string)
  } else {
    _print("error", "_print内でのエラー。属性が設定されていない可能性があります");
  }
}

/**
 * hwCodeを生成、保存
 */
export function generateHWID() {
  let seed = randomBytes(20).toString('hex');
  let data = createHash("md5").update(seed).digest('hex');
  let short = data.slice(0, -8);
  return `#1-${data}:${data}:${data}-${data}-${data}-${data}-${data}-${short}`;
}