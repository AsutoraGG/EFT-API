/* github.com/garrettjoecox/tarkov-scripts/blob/master/src/storage.ts　ほぼほぼこれを参考にして作っています */
import fs from "fs-extra";
import { readFileSync } from "fs";
import { resolve, dirname } from 'path'
import { fileURLToPath } from "url";
import lodash from 'lodash'
import { _print } from "./utill.js";

const ___firename = fileURLToPath(import.meta.url);
const ___dirname = dirname(___firename);

const configPath = resolve(___dirname, './save.json')

let Object = {
    hwCode: "",
    auth: {
        email       : "",
        pass        : "",
        session     : "",
        accessToken : ""
    }
}

/**
 * @param {*} propaty "hwCode", "auth.email", "auth.pass", "auth.session", "auth.accessToken"
 */
export function _set(propaty, value) {
    lodash.set(Object, propaty, value);
    fs.writeJson(configPath, Object, { spaces: 2}).then(() => {
        _print('info', propaty + "に" + value.length < 5 ? value.split(0, 5) : value + "を設定しました")
    }).catch(e => {
        _print('error', "in _set | jsonを保存中にエラーがーが起きました: " + e)
    })
}

/**
 * @param {*} path Example: _get('auth.email')
 */
export async function _get(path) { 
    await overwriteObject();
    return lodash.get(Object, path);
}

async function overwriteObject() {
    if(Object !== readFileSync(configPath, 'utf-8')) { // Objectとjsonに保存されているものが等しくなかったら
        Object = JSON.parse(readFileSync(configPath, 'utf-8'))
    }
}