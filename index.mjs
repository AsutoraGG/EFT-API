import got from 'got';
import Pako from 'pako';
import { createHash } from 'crypto';

import { _get, _set } from './src/config.js';
import { _print, generateHWID } from './src/utill.js'

const launcherURL       = "https://launcher.escapefromtarkov.com"

let _LauncherVersion     = '13.0.2.1988';
let _gameVersion         = '0.13.1.0.24605';
let request = 0;

const cls = console.clear();

async function login(email, password) {
    password = createHash("md5").update(password).digest("hex");
    if(!email || !password) {
        return _print('error', "in Login | 入力項目に入力されていません")
    }

    try {
        let d;
        const r = await got.post(launcherURL + "/launcher/login", {
            searchParams: {
                launcherVersion: _LauncherVersion,
                branch: 'live',
            },
            headers: {
                'User-Agent': `BSG Launcher ${_LauncherVersion}`
            },
            decompress: true,
            responseType: 'buffer',
            body: JSON.stringify({ "email": email, "pass": password, "hwCode": await _get('hwCode'), "captcha": null })
        });
        d = JSON.parse(Pako.inflate(r.body, { to: 'string' }));
        if(typeof d.errmsg ==="string") {
            _print("error", "in Login | " + d.errmsg);
            process.exit()
        }
        _print('success', "ログインに成功しました\n" + d)
    } catch (e) {
        _print('error', "in Login | " + e);
    }
}

async function getLauncherVersion() {
    let v;
    try {
        const r = await got.post(launcherURL + "/launcher/GetLauncherDistrib", {
            decompress: true,
            responseType: 'buffer',
            headers: {
                'Content-Type': "application/json",
                "User-Agent": `BSG Launcher ${_LauncherVersion}`,
                'app-version': `EFT Client ${_gameVersion}`,
                'accept-encoding': 'gzip, deflate, br',
                "GClient-RequestId": request++
            }
        })
        v = JSON.parse(Pako.inflate(r.body, { to: 'string' }));
        if(typeof v.errmsg ==="string") {
            _print("error", "in LauncherVersion | " + v.errmsg);
            process.exit()
        }
        if(_LauncherVersion != v.data.Version) {
            print('info', "new LauncherVersion Detecte " + _LauncherVersion + " > " + v.data.Version);
            _LauncherVersion = v.data.Version;
        }
    } catch(e) {
        _print('error', "in LauncherVersion | " + e);
    }
}

async function getGameVersion() {
    let v;
    try {
        const r = await got.post(launcherURL + "/launcher/GetPatchList", {
            searchParams: {
                launcherVersion: _LauncherVersion,
                branch: 'live',
            },
            decompress: true,
            responseType: 'buffer',
            headers: {
                'Content-Type': "application/json",
                "User-Agent": `BSG Launcher ${_LauncherVersion}`,
                'app-version': `EFT Client ${_gameVersion}`,
                'accept-encoding': 'gzip, deflate, br'
            }
        })
        v = JSON.parse(Pako.inflate(r.body, { to: 'string' }));
        if(typeof v.errmsg ==="string") {
            _print("error", "in GameVersion | " + v.errmsg);
            process.exit()
        }
        if(_gameVersion != v.data.version) {
            print('info', "new GameVersion Detecte " + _gameVersion + " > " + v.data.Version);
            _gameVersion = v.data.version
        }
    } catch(e) {
        _print('error', "in GameVersion | " + e);
    }
}

cls

if(!await _get("hwCode")) {
    _set('hwCode', generateHWID())
    _print('info', "hwCodeを生成＆保存しました")
}

await getLauncherVersion()

_print('info', "ログイン中...")
await login("", "")

/*
await getGameVersion()
cls
_print('success', "APIから情報を取得しました");
_print('info', 'Launcher Version : ' + _LauncherVersion);
_print('info', 'Game Version     : '  + _gameVersion); */