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

SettingUtil.setting_key = "horoscope_setting_solar_return";
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
    },
    'target-year': (new Date()).getFullYear(),
}

SettingUtil.body_list = {
    // 主要天体
    'sun': {
        'name': '太陽',
        'tag': 'main',
        'svg': '../svg/sun.svg'
    },
    'moon': {
        'name': '月',
        'tag': 'main',
        'svg': '../svg/moon.svg'
    },
    'mercury': {
        'name': '水星',
        'tag': 'main',
        'svg': '../svg/mercury.svg'
    },
    'venus': {
        'name': '金星',
        'tag': 'main',
        'svg': '../svg/venus.svg'
    },
    'mars': {
        'name': '火星',
        'tag': 'main',
        'svg': '../svg/mars.svg'
    },
    'jupiter': {
        'name': '木星',
        'tag': 'main',
        'svg': '../svg/jupiter.svg'
    },
    'saturn': {
        'name': '土星',
        'tag': 'main',
        'svg': '../svg/saturn.svg'
    },
    'uranus': {
        'name': '天王星',
        'tag': 'main',
        'svg': '../svg/uranus.svg'
    },
    'neptune': {
        'name': '海王星',
        'tag': 'main',
        'svg': '../svg/neptune.svg'
    },
    'pluto': {
        'name': '冥王星',
        'tag': 'main',
        'svg': '../svg/pluto.svg'
    },
    // 月関係
    'mean_node': {
        'name': 'ドラゴンヘッド（ミーン）',
        'tag': 'lunar',
        'svg': '../svg/mean_node.svg'
    },
    'true_node': {
        'name': 'ドラゴンヘッド（トルゥー）',
        'tag': 'lunar',
        'svg': '../svg/true_node.svg'
    },
    'mean_apogee': {
        'name': 'ブラックムーンリリス（ミーン）',
        'tag': 'lunar',
        'svg': '../svg/mean_black_moon.svg'
    },
    'intp_apogee': {
        'name': 'ブラックムーンリリス（トゥルー）',
        'tag': 'lunar',
        'svg': '../svg/true_black_moon.svg'
    },
    // 小惑星
    // 4大小惑星
    'ceres': {
        'name': 'セレス',
        'tag': 'big4',
        'svg': '../svg/ceres.svg'
    },
    'pallas': {
        'name': 'パラス',
        'tag': 'big4',
        'svg': '../svg/pallas.svg'
    },
    'vesta': {
        'name': 'ヴェスタ',
        'tag': 'big4',
        'svg': '../svg/vesta.svg'
    },
    'juno': {
        'name': 'ジュノー',
        'tag': 'big4',
        'svg': '../svg/juno.svg'
    },
    // ケンタウルス族
    'chiron': {
        'name': 'キロン',
        'tag': 'centaur',
        'svg': '../svg/chiron.svg'
    },
    'chariklo': {
        'name': 'カリクロー',
        'tag': 'centaur',
        'svg': '../svg/chariklo.svg'
    },
    'elatus': {
        'name': 'エラタス',
        'tag': 'centaur',
        'svg': '../svg/elatus.svg'
    },
    'okyrhoe': {
        'name': 'オキロエ',
        'tag': 'centaur',
        'svg': '../svg/okyrhoe.svg'
    },
    'cyllarus': {
        'name': 'キルラルス',
        'tag': 'centaur',
        'svg': '../svg/cyllarus.svg'
    },
    'hylonome': {
        'name': 'ヒュロノメ',
        'tag': 'centaur',
        'svg': '../svg/hylonome.svg'
    },
    'pholus': {
        'name': 'フォルス',
        'tag': 'centaur',
        'svg': '../svg/pholus.svg'
    },
    'asbolus': {
        'name': 'アスボルス',
        'tag': 'centaur',
        'svg': '../svg/asbolus.svg'
    },
    'bienor': {
        'name': 'ビエノール',
        'tag': 'centaur',
        'svg': '../svg/bienor.svg'
    },
    'damocles': {
        'name': 'ダモクレス',
        'tag': 'centaur',
        'svg': '../svg/damocles.svg'
    },
    'ixion': {
        'name': 'イクシオン',
        'tag': 'centaur',
        'svg': '../svg/ixion.svg'
    },
    'tantalus': {
        'name': 'タンタロス',
        'tag': 'centaur',
        'svg': '../svg/tantalus.svg'
    },
    'nessus': {
        'name': 'ネッスス',
        'tag': 'centaur',
        'svg': '../svg/nessus.svg'
    },
    // マイナー小惑星7天体
    'varuna': {
        'name': 'ヴァルナ',
        'tag': 'minor7',
        'svg': '../svg/varuna.svg'
    },
    'mithra': {
        'name': 'ミスラ',
        'tag': 'minor7',
        'svg': '../svg/mithra.svg'
    },
    'osiris': {
        'name': 'オシリス',
        'tag': 'minor7',
        'svg': '../svg/osiris.svg'
    },
    'isis': {
        'name': 'イシス',
        'tag': 'minor7',
        'svg': '../svg/isis.svg'
    },
    'lilith': {
        'name': 'リリス（小惑星）',
        'tag': 'minor7',
        'svg': '../svg/lilith.svg'
    },
    // ウラニアン
    'cupido': {
        'name': 'クピド',
        'tag': 'uranian',
        'svg': '../svg/cupido.svg'
    },
    'hades': {
        'name': 'ハデス',
        'tag': 'uranian',
        'svg': '../svg/hades.svg'
    },
    'zeus': {
        'name': 'ゼウス',
        'tag': 'uranian',
        'svg': '../svg/zeus.svg'
    },
    'kronos': {
        'name': 'クロノス',
        'tag': 'uranian',
        'svg': '../svg/kronos.svg'
    },
    'apollon': {
        'name': 'アポロン',
        'tag': 'uranian',
        'svg': '../svg/apollon.svg'
    },
    'admetos': {
        'name': 'アドメトス',
        'tag': 'uranian',
        'svg': '../svg/admetos.svg'
    },
    'valkanus': {
        'name': 'ヴァルカヌス',
        'tag': 'uranian',
        'svg': '../svg/valkanus.svg'
    },
    'poseidon': {
        'name': 'ポセイドン',
        'tag': 'uranian',
        'svg': '../svg/poseidon.svg'
    },
    // ムーサ9柱
    'kalliope': {
        'name': 'カリオペ',
        'tag': 'musa',
        'svg': '../svg/kalliope.svg'
    },
    'klio': {
        'name': 'クリオ',
        'tag': 'musa',
        'svg': '../svg/klio.svg'
    },
    'euterpe': {
        'name': 'エウテルペ',
        'tag': 'musa',
        'svg': '../svg/euterpe.svg'
    },
    'thalia': {
        'name': 'タリア',
        'tag': 'musa',
        'svg': '../svg/thalia.svg'
    },
    'melpomene': {
        'name': 'メルポメネ',
        'tag': 'musa',
        'svg': '../svg/melpomene.svg'
    },
    'terpsichore': {
        'name': 'テルプシコレ',
        'tag': 'musa',
        'svg': '../svg/terpsichore.svg'
    },
    'erato': {
        'name': 'エラト',
        'tag': 'musa',
        'svg': '../svg/erato.svg'
    },
    'polyhymnia': {
        'name': 'ポリヒムニア',
        'tag': 'musa',
        'svg': '../svg/polyhymnia.svg'
    },
    'urania': {
        'name': 'ウラニア',
        'tag': 'musa',
        'svg': '../svg/urania.svg'
    },
    // モイラ
    'moira': {
        'name': 'モイラ',
        'tag': 'moira',
        'svg': '../svg/moira.svg'
    },
    'klotho': {
        'name': 'クロト',
        'tag': 'moira',
        'svg': '../svg/klotho.svg'
    },
    'lachesis': {
        'name': 'ラケシス',
        'tag': 'moira',
        'svg': '../svg/lachesis.svg'
    },
    'atropos': {
        'name': 'アトロポス',
        'tag': 'moira',
        'svg': '../svg/atropos.svg'
    },
    // その他
    'quaoar': {
        'name': 'クアオアー',
        'tag': 'other',
        'svg': '../svg/quaoar.svg'
    },
    'sedna': {
        'name': 'セドナ',
        'tag': 'other',
        'svg': '../svg/sedna.svg'
    },
    'eros': {
        'name': 'エロス',
        'tag': 'other',
        'svg': '../svg/eros.svg'
    },
    'hekate': {
        'name': 'ヘカテ',
        'tag': 'other',
        'svg': '../svg/hekate.svg'
    },
    'orcus': {
        'name': 'オルカス',
        'tag': 'other',
        'svg': '../svg/orcus.svg'
    },
    'eris': {
        'name': 'エリス',
        'tag': 'other',
        'svg': '../svg/eris.svg'
    },
    'pandora': {
        'name': 'パンドラ',
        'tag': 'other',
        'svg': '../svg/pandra.svg'
    },
    'icarus': {
        'name': 'イカルス',
        'tag': 'other',
        'svg': '../svg/icarus.svg'
    },
    'merlin': {
        'name': 'マーリン',
        'tag': 'other',
        'svg': '../svg/merlin.svg'
    },
    'astraea': {
        'name': 'アストラエア',
        'tag': 'other',
        'svg': '../svg/astraea.svg'
    },
    'hygiea': {
        'name': 'ヒギエア',
        'tag': 'other',
        'svg': '../svg/hygiea.svg'
    },
    // 架空天体
    'part of fortune': {
      'name': 'ﾊﾟｰﾄｵﾌﾞﾌｫｰﾁｭﾝ',
      'tag': 'virtual',
      'svg': '../svg/part_of_fortune.svg'
    },
    'vertex': {
      'name': 'ﾊﾞｰﾃｯｸｽ',
      'tag': 'virtual',
      'svg': '../svg/vertex.svg'
    }
}
