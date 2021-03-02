/**
 * 天体計算基礎クラス
 */
let CalcAstroBase = function(){};

/**
 * 定数
 */
CalcAstroBase.JSTM = 135.0; //! 日本標準時の東経
CalcAstroBase.DEG2RAD = Math.PI / 180.0; //! DEG→RAD
CalcAstroBase.RAD2DEG = 180.0 / Math.PI; //! RAD→DEG
CalcAstroBase.COLOR_FIRE = "#ffeeee";
CalcAstroBase.COLOR_EARTH = "#ffffee";
CalcAstroBase.COLOR_AIR = "#eeffee";
CalcAstroBase.COLOR_WATER = "#ddeeff";

/**
 * サインリスト
 */
CalcAstroBase.signs = [
    '牡羊座',
    '牡牛座',
    '双子座',
    '蟹座',
    '獅子座',
    '乙女座',
    '天秤座',
    '蠍座',
    '射手座',
    '山羊座',
    '水瓶座',
    '魚座'
];
/**
 * サインシンボルリスト
 */
CalcAstroBase.sign_symbols = [
    '♈',
    '♉',
    '♊',
    '♋',
    '♌',
    '♍',
    '♎',
    '♏',
    '♐',
    '♑',
    '♒',
    '♓'
];

/**
 * サインシンボルファイルパスリスト
 */
CalcAstroBase.svg_sign_symbol = [
    'svg/aries.svg',
    'svg/taurus.svg',
    'svg/gemini.svg',
    'svg/cancer.svg',
    'svg/leo.svg',
    'svg/virgo.svg',
    'svg/libra.svg',
    'svg/scorpio.svg',
    'svg/sagittarius.svg',
    'svg/capricorn.svg',
    'svg/aquarius.svg',
    'svg/pisces.svg',
];

/**
 * サインシンボルテーマカラーリスト
 */
CalcAstroBase.sign_symbol_colors = [
    CalcAstroBase.COLOR_FIRE,
    CalcAstroBase.COLOR_EARTH,
    CalcAstroBase.COLOR_AIR,
    CalcAstroBase.COLOR_WATER,
    CalcAstroBase.COLOR_FIRE,
    CalcAstroBase.COLOR_EARTH,
    CalcAstroBase.COLOR_AIR,
    CalcAstroBase.COLOR_WATER,
    CalcAstroBase.COLOR_FIRE,
    CalcAstroBase.COLOR_EARTH,
    CalcAstroBase.COLOR_AIR,
    CalcAstroBase.COLOR_WATER
]

/**
 * 天体の列挙体
 */
CalcAstroBase.Planet = {
    // 太陽
    SUN: {
        value: "sun"
    },
    // 水星
    MERCURY: {
        value: "mercury"
    },
    // 月
    MOON: {
        value: "moon"
    },
    // 金星
    VENUS: {
        value: "venus"
    },
    // 火星
    MARS: {
        value: "mars"
    },
    // 木星
    JUPITER: {
        value: "jupiter"
    },
    // 土星
    SATURN: {
        value: "saturn"
    },
    // 天王星
    URANUS: {
        value: "uranus"
    },
    // 海王星
    NEPTUNE: {
        value: "neptune"
    },
    // 冥王星
    PLUTO: {
        value: "pluto"
    }
};

/**
 * 黄道傾斜角を算出する
 * @param {*} target_date 指定日
 * @returns {number} 黄道傾斜角 [deg]
 */
CalcAstroBase.geteclipticInclinationAngle = function(target_date)
{
    // 世界時の2000年1月1日を取得
    let utc20000101 = new Date();
    utc20000101.setUTCFullYear(2000);
    utc20000101.setUTCMonth(0);
    utc20000101.setUTCDate(1);
    utc20000101.setUTCHours(0);
    utc20000101.setUTCMinutes(0);
    utc20000101.setUTCSeconds(0);
    utc20000101.setUTCMilliseconds(0);

    // 差を求める
    let diff_sec = (target_date.getTime() - utc20000101.getTime()) / 1000;

    // 定数Tを求める
    let T = diff_sec / 3155760000;

    // 黄道傾斜角
    var result = 84381.406 - 46.836769 * T - 0.00059 * T * T + 0.001813 * T * T * T;

    return result / 3600;
}

/**
 * 世界時を求める
 * @param {Date} local_date 地方時
 * @param {number} time_diff 時差
 * @return {Date} global_date
 */
CalcAstroBase.getGlobalTime = function(local_date, time_diff){
    let UT = new Date(local_date.getTime());
    UT.setHours(UT.getHours() - time_diff);
    return UT;
}

/**
 * 地方時を求める
 * @param {Date} UT 世界時
 * @param {number} time_diff 時差
 * @returns {Date} 地方時
 */
CalcAstroBase.getLocalTime = function(UT, time_diff){
    let LocalTime = new Date(UT.getTime());
    LocalTime.setHours(UT.getHours() + time_diff);
    return LocalTime;
}

/**
 * ユリウス日を求める
 * @param {Date} UT 世界時
 * @returns {number} ユリウス日
 */ 
CalcAstroBase.getJulianDay = function(UT){
    let year = UT.getFullYear();
    let month = UT.getMonth() + 1;
    let date = UT.getDate();
    let hour = UT.getHours();
    let min = UT.getMinutes();
    // 1月2月は前年の13月14月と読み替える
    if(month <= 2){
        year--;
        month += 12;
    }

    // ユリウス暦に変換
    var JD = Math.floor(year * 365.25) 
    + Math.floor(year/400.0) 
    - Math.floor(year/100.0) 
    + Math.floor(30.59*(month - 2.0)) 
    + date + 1721088.5 + hour/24.0 + min /1440.0;

    return JD;
}

/**
 * ユリウス世紀を求める
 * @param {number} JD ユリウス日
 * @returns {number} ユリウス世紀数
 */
CalcAstroBase.getJulianCentury = function(JD){
    return (JD - 2451545) / 36525;
}

/**
 * TJDを求める
 * @param {number} JD ユリウス日
 * @returns {number} TJD
 */
CalcAstroBase.getTJD = function(JD){
    var TJD = JD - 2440000.5;
    return TJD;
}

/**
 * グリニッジ恒星時を求める
 * @param {number} TJD
 * @returns {number} グリニッジ恒星時 
 */
CalcAstroBase.getGreenwichSiderealTime = function(TJD){
    var ST0 = 360.0 * (0.671262 + 1.0027379094* TJD);
    return ST0 % 360.0;
}

/**
 * 黄経をサインに変換
 * @param {*} lonecl 黄経[deg]
 */
CalcAstroBase.getSign = function(lonecl){
    if(lonecl === null || lonecl === null || isNaN(lonecl)){
        return "";
    }

    while(lonecl < 0){
        lonecl += 360;
    }

    let index = Math.floor((lonecl % 360) / 30);
    return CalcAstroBase.signs[index];
}

/**
 * 角度を時間に変換
 * @param {number} deg 角度[deg] 
 */
CalcAstroBase.deg2time = function(deg){
    if(deg === null || deg === undefined || isNaN(deg)){
        return "";
    }
    while(deg < 0){
        deg += 360;
    }
    deg = deg % 30;
    let time = "";
    time += ("0" + Math.floor(deg) + "°").slice(-3);
    time += ("0" + Math.floor((deg - Math.floor(deg)) * 60) + "'").slice(-3);

    return time;
}

/**
 * 角度を時間に変換
 * @param {number} rad 角度[rad] 
 */
CalcAstroBase.rad2time = function(rad){
    if(rad === null || rad === undefined || isNaN(rad)){
        return "";
    }
    let deg = rad * 180 / Math.PI;
    return deg2time(deg);
}

/**
 * 2角度間の角度を計算する
 * @param {number} angle1 角度1[deg]
 * @param {number} angle2 角度2[deg]
 * @returns {number} 2角度間角度の絶対値[deg]
 */
CalcAstroBase.getAngleBetween = function(angle1, angle2){
    let x1 = Math.cos(angle1 * Math.PI / 180);
    let y1 = Math.sin(angle1 * Math.PI / 180);
    let x2 = Math.cos(angle2 * Math.PI / 180);
    let y2 = Math.sin(angle2 * Math.PI / 180);

    let cosTheta = (x1*x2 + y1*y2) / (Math.sqrt(x1*x1 + y1*y1) * Math.sqrt(x2*x2 + y2*y2));
    let dtheta = Math.acos(cosTheta) * 180 / Math.PI;

    return dtheta % 180;
}