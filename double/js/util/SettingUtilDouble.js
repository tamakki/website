const SettingUtil = {};
/** 設定情報の取得 */
SettingUtil.getSetting = function () {
    const setting = localStorage.getItem(SettingUtil.setting_key);
    return setting ? new Setting(setting) : new Setting(JSON.stringify(SettingUtil.default_setting));
}

/** 設定情報の保存 */
SettingUtil.saveSetting = function (setting, setting_name) {
    let settings = JSON.parse(localStorage.getItem(SettingUtil.setting_key));

    if (!settings) {
        settings = {};
    }

    if (!settings.saved) {
        settings["saved"] = {};
    }
    var keys = Object.keys(settings.saved);
    if (keys.indexOf(setting_name) !== -1) {
        if (!confirm("同じ名前の設定がありますが上書きしますか？")) {
            return;
        }
    }
    settings.saved[setting_name] = setting;
    localStorage.setItem(SettingUtil.setting_key, JSON.stringify(settings));
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

/** 誕生日をDate形式で取得する */
Setting.prototype.getBirthDate2 = function () {
    let timeZone = 'Z';
    if (this['time-diff2'] > 0) {
        timeZone = '+';
        timeZone += ('0' + this['time-diff2']).slice(-2) + ':00';
    } else if (this['time-diff2'] < 0) {
        timeZone = '-';
        timeZone += ('0' + Math.abs(this['time-diff2'])).slice(-2) + ':00';
    }
    this['birth-date2'] = this['birth-date2'].trim();
    const dateString =
        ('0000' + this['birth-date2'].split('/')[0]).slice(-4) + '-'
        + ('0' + this['birth-date2'].split('/')[1]).slice(-2) + '-'
        + ('0' + this['birth-date2'].split('/')[2]).slice(-2)
        + 'T'
        + ('0' + this['birth-hour2']).slice(-2) + ':'
        + ('0' + this['birth-min2']).slice(-2) + ':00.000' + timeZone;
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

/** 経度を実数で取得 */
Setting.prototype.getLongitude2 = function () {
    return parseFloat(this['longitude-deg2']) + parseFloat(this['longitude-min2']) * (1 / 60);
}

/** 緯度を実数で取得 */
Setting.prototype.getLatitude2 = function () {
    return parseFloat(this['latitude-deg2']) + parseFloat(this['latitude-min2']) * (1 / 60);
}

SettingUtil.setting_key = "horoscope_setting_double";
SettingUtil.default_setting = {
    version: 3,
    'birth-date': SettingUtil.formatDate(new Date()),
    'birth-hour': (new Date()).getHours(),
    'birth-min': (new Date()).getMinutes(),
    'birth-date2': SettingUtil.formatDate(new Date()),
    'birth-hour2': (new Date()).getHours(),
    'birth-min2': (new Date()).getMinutes(),
    'longitude-deg': '135',
    'longitude-min': '00',
    'latitude-deg': '35',
    'latitude-min': '00',
    'longitude-deg2': '135',
    'longitude-min2': '00',
    'latitude-deg2': '35',
    'latitude-min2': '00',
    'prefecture': '',
    'time-diff': 9,
    'time-diff2': 9,
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
    'aspectsetting': aspectSettingDefault
}