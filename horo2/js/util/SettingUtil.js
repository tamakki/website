const SettingUtil = {};
/** 設定情報の取得 */
SettingUtil.getSetting = function () {
    const setting = localStorage.getItem(SettingUtil.setting_key);
    return setting ? new Setting(setting) : new Setting(JSON.stringify(SettingUtil.default_setting));
}

/** 設定情報の保存 */
SettingUtil.saveSetting = function (setting) {
    localStorage.setItem(SettingUtil.setting_key, JSON.stringify(setting));
}

SettingUtil.removeSetting = function () {
    localStorage.removeItem(SettingUtil.setting_key);
}

/**
 * Dateを日付文字列に変換する
 * @param {Date} date
 */
SettingUtil.formatDate = function (date) {
    return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + (date.getDate())).slice(-2);
}

/**
 * 設定クラス
 * @param {string} setting 設定値(JSON文字列)
 */
function Setting(setting) {
    setting = JSON.parse(setting);
    let keys = Object.keys(setting);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this[key] = setting[key];
    }
}

/** 誕生日をDate形式で取得する */
Setting.prototype.getBirthDate = function () {
    let timeZone = 'Z';
    if (this['time-diff'] > 0) {
        timeZone = '+';
        timeZone += ('0' + this['time-diff']).slice(-2) + ':00';
    } else if (this['time-diff'] < 0) {
        timeZone = '-';
        timeZone += ('0' + Math.abs(this['time-diff'])).slice(-2) + ':00';
    }
    this['birth-date'] = this['birth-date'].trim();
    const dateString =
        ('0000' + this['birth-date'].split('/')[0]).slice(-4) + '-'
        + ('0' + this['birth-date'].split('/')[1]).slice(-2) + '-'
        + ('0' + this['birth-date'].split('/')[2]).slice(-2)
        + 'T'
        + ('0' + this['birth-hour']).slice(-2) + ':'
        + ('0' + this['birth-min']).slice(-2) + ':00.000' + timeZone;
    const birthDate = new Date(dateString);
    return birthDate;
}

/** 経度を実数で取得 */
Setting.prototype.getLongitude = function () {
    return parseFloat(this['longitude-deg']) + parseFloat(this['longitude-min']) * (1 / 60);
}

/** 緯度を実数で取得 */
Setting.prototype.getLatitude = function () {
    return parseFloat(this['latitude-deg']) + parseFloat(this['latitude-min']) * (1 / 60);
}

SettingUtil.setting_key = "horoscope_setting";
SettingUtil.default_setting = {
    version: 3,
    'birth-date': SettingUtil.formatDate(new Date()),
    'birth-hour': (new Date()).getHours(),
    'birth-min': (new Date()).getMinutes(),
    'longitude-deg': '135',
    'longitude-min': '00',
    'latitude-deg': '35',
    'latitude-min': '00',
    'prefecture': '',
    'time-diff': 9,
    'house-system': 'placidus',
    'disp-hard': true,
    'disp-soft': true,
    'disp-tight': true,
    'disp-loose': true,
    'targets': [
        'sun',
        'moon',
        'mercury',
        'venus',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
        'pluto'
    ],
    'targets-all': [
        'main'
    ],
    'aspectsetting': {
        Conjunction: {
            display: true,
            isMajor: true,
            angle: 0,
            color: 'hard',
            orb: {
                major: { tight: 5, loose: 8 },
                minor: { tight: 3, loose: 5 }
            }
        },
        "Semi-Square": {
            display: true,
            isMajor: true,
            angle: 45,
            color: 'hard',
            orb: {
                major: { tight: 5, loose: 8 },
                minor: { tight: 3, loose: 5 }
            }
        },
        "Semi-Sextile": {
            display: true,
            isMajor: false,
            angle: 30,
            color: 'soft',
            orb: {
                major: { tight: 2, loose: 4 },
                minor: { tight: 1, loose: 2 }
            }
        },
        Decile: {
            display: true,
            isMajor: false,
            angle: 36,
            color: 'soft',
            orb: {
                major: { tight: 2, loose: 4 },
                minor: { tight: 1, loose: 2 }
            }
        },
        Novaile: {
            display: true,
            isMajor: false,
            angle: 40,
            color: 'soft',
            orb: {
                major: { tight: 2, loose: 4 },
                minor: { tight: 1, loose: 2 }
            }
        },
        Septile: {
            display: true,
            isMajor: false,
            angle: 360 / 7,
            color: 'hard',
            orb: {
                major: { tight: 2, loose: 4 },
                minor: { tight: 1, loose: 2 }
            }
        },
        Sextile: {
            display: true,
            isMajor: true,
            angle: 60,
            color: 'soft',
            orb: {
                major: { tight: 5, loose: 8 },
                minor: { tight: 3, loose: 5 }
            }
        },
        Quintile: {
            display: true,
            isMajor: true,
            angle: 72,
            color: 'soft',
            orb: {
                major: { tight: 5, loose: 8 },
                minor: { tight: 3, loose: 5 }
            }
        },
        Square: {
            display: true,
            isMajor: true,
            angle: 90,
            color: 'hard',
            orb: {
                major: { tight: 5, loose: 8 },
                minor: { tight: 3, loose: 5 }
            }
        },
        Trine: {
            display: true,
            isMajor: true,
            angle: 120,
            color: 'soft',
            orb: {
                major: { tight: 5, loose: 8 },
                minor: { tight: 3, loose: 5 }
            }
        },
        "Sesqui-square": {
            display: true, 
            isMajor: false,
            angle: 135,
            color: 'hard',
            orb: {
                major: { tight: 2, loose: 4 },
                minor: { tight: 1, loose: 2 }
            }
        },
        Biquintile: {
            display: true,
            isMajor: false,
            angle: 144,
            color: 'soft',
            orb: {
                major: { tight: 2, loose: 4 },
                minor: { tight: 1, loose: 2 }
            }
        },
        Inconjunct: {
            display: true,
            isMajor: false,
            angle: 150,
            color: 'hard',
            orb: {
                major: { tight: 2, loose: 4 },
                minor: { tight: 1, loose: 2 }
            }
        },
        Opposition: {
            display: true,
            isMajor: true,
            angle: 180,
            color: 'hard',
            orb: {
                major: { tight: 5, loose: 8 },
                minor: { tight: 3, loose: 5 }
            }
        },
    }
}
