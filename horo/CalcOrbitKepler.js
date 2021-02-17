/**
 * 天文単位[m]
 */
var AU = 149597870700;

/**
 * 地球の半径[AU]
 */
var EARTH_RADIUS = 6378100 / AU;

/**
 * 軌道要素による軌道計算クラス
 * @param {Date} target_date 指定日
 * @param {number} time_diff 標準時からの時差
 * @param {number} lon 赤経
 * @param {number} lat 赤緯
 */
let CalcOrbitKepler = function(target_date, time_diff, lon, lat) {
    // 指定日時
    this.target_date = target_date;
    // 世界標準時からの時差
    this.time_diff = time_diff;
    // 赤経
    this.longitude = lon;
    // 赤緯
    this.latitude = lat;
    // 世界標準時
    this.UT = new Date(target_date.getFullYear(), target_date.getMonth(), target_date.getDate(), target_date.getHours() - time_diff);
    // 年月日をそれぞれ取得
    this.year = this.UT.getFullYear();
    this.month = this.UT.getMonth() + 1;
    this.date = this.UT.getDate();
    this.hour = this.UT.getHours();

    // 時間スケールを計算
    this.d = 367 * this.year 
    - Math.floor(7 * (this.year + (this.month + 9) / 12) / 4) 
    - Math.floor(3 * (Math.floor((this.year + (this.month - 9) / 7 ) / 100) + 1) / 4) 
    + Math.floor(275 * this.month / 9) + this.date - 730515;
    this.d += this.hour / 24.0;

    // 世界標準時
    this.ST = this.getGlobalTime( this.target_date, this.time_diff);
}

/**
 * 太陽の黄経を取得する
 * @returns 太陽の黄経（地心黄経）
 */
CalcOrbitKepler.prototype.getLonSun = function () {
    let elements = this.KeplerElements["sun"];
    let M = this.getParameter(elements["M"]) % 360;
    let e = this.getParameter(elements["e"]);
    let a = this.getParameter(elements["a"]);
    let w = this.getParameter(elements["w"]) % 360;
    let E = this.solvKeplerEquation(M, e) % 360;
    let xv = a * (Math.cos(E * CalcAstroBase.DEG2RAD) - e);
    let yv = a * Math.sqrt(1.0 - e * e) * Math.sin(E * CalcAstroBase.DEG2RAD);
    let v = Math.atan2(yv, xv) * CalcAstroBase.RAD2DEG;
    let lonecl = v + w;

    while(lonecl < 0){
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * 月の黄経を取得する
 * @returns {number} 月の地心視黄経
 */
CalcOrbitKepler.prototype.getLonMoon = function () {
    let elements = this.KeplerElements["moon"];
    let lonecl = this.getLongitude(elements);

    // 摂動の補正
    let sunElements = this.KeplerElements["sun"];
    let Ms = this.getParameter(sunElements["M"]);
    let Mm = this.getParameter(elements["M"]);
    let Nm = this.getParameter(elements["N"]);
    let ws = this.getParameter(sunElements["w"]);
    let wm = this.getParameter(elements["w"]);
    let Ls = Ms + ws;
    let Lm = Mm + wm + Nm;
    let D = Lm - Ls;
    let F = Lm - Nm;

    lonecl -= 1.274 * Math.sin((Mm - 2 * D) * CalcAstroBase.DEG2RAD);
    lonecl += 0.658 * Math.sin(2 * D * CalcAstroBase.DEG2RAD);
    lonecl -= 0.186 * Math.sin(Ms * CalcAstroBase.DEG2RAD);
    lonecl -= 0.059 * Math.sin((2 * Mm - 2 * D) * CalcAstroBase.DEG2RAD);
    lonecl -= 0.057 * Math.sin((Mm - 2 * D + Ms) * CalcAstroBase.DEG2RAD);
    lonecl += 0.053 * Math.sin((Mm + 2 * D) * CalcAstroBase.DEG2RAD);
    lonecl += 0.046 * Math.sin((2 * D - Ms) * CalcAstroBase.DEG2RAD);
    lonecl += 0.041 * Math.sin((Mm - Ms));
    lonecl -= 0.035 * Math.sin(D * CalcAstroBase.DEG2RAD);
    lonecl -= 0.031 * Math.sin((Mm - Ms) * CalcAstroBase.DEG2RAD);
    lonecl -= 0.015 * Math.sin((2 * F - 2 * D) * CalcAstroBase.DEG2RAD);
    lonecl += 0.011 * Math.sin((Mm - 4 * D) * CalcAstroBase.DEG2RAD);

    let distance = this.getDistance(elements);
    distance -= 0.58 * Math.sin((F - 2 * D) * CalcAstroBase.RAD2DEG);
    distance -= 0.46 * Math.cos(2 * D * CalcAstroBase.DEG2RAD);

    let x = distance * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let y = distance * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    // 地平視差の補正
    // 地球上の座標を計算
    let epsilon = this.geteclipticInclinationAngle();
    // 赤経、赤緯を黄経、黄緯に変換
    let ecliptic = this.EquatorialToEcliptic(this.longitude, this.latitude, epsilon);
    // 地心からの距離
    let radius = EARTH_RADIUS * Math.cos(ecliptic.beta * CalcAstroBase.DEG2RAD);
    let earth_x = radius * Math.cos(this.ST * CalcAstroBase.DEG2RAD);
    let earth_y = radius * Math.sin(this.ST * CalcAstroBase.DEG2RAD);

    lonecl = Math.atan2(y - earth_y, x - earth_x) * CalcAstroBase.RAD2DEG;

    if(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl;
}

/**
 * 水星の黄経を取得する
 * @returns {number} 水星の地心黄経
 */
CalcOrbitKepler.prototype.getLonMercury = function() {
    let elements = this.KeplerElements["mercury"];
    let lonecl = this.getLongitude(elements);
    let r = this.getDistance(elements);

    let xh = r * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let yh = r * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    let possun = this.getPosSun();

    lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * 金星の黄経を取得する
 * @returns {number} 金星の地心黄経
 */
CalcOrbitKepler.prototype.getLonVenus = function() {
    let elements = this.KeplerElements["venus"];
    let lonecl = this.getLongitude(elements);
    let r = this.getDistance(elements);

    let xh = r * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let yh = r * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    let possun = this.getPosSun();

    lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * 火星の黄経を取得する
 * @returns {number} 火星の地心黄経
 */
CalcOrbitKepler.prototype.getLonMars = function() {
    let elements = this.KeplerElements["mars"];
    let lonecl = this.getLongitude(elements);
    let r = this.getDistance(elements);

    let xh = r * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let yh = r * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    let possun = this.getPosSun();

    lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * 木星の黄経を取得する
 * @returns {number} 木星の地心黄経
 */
CalcOrbitKepler.prototype.getLonJupiter = function() {
    let elements = this.KeplerElements["jupiter"];
    let lonecl = this.getLongitude(elements);

    let Mj = this.getParameter(this.KeplerElements["jupiter"]["M"]);
    let Ms = this.getParameter(this.KeplerElements["saturn"]["M"]);

    lonecl -= 0.332 * Math.sin((2 * Mj - 5 * Ms - 67.6) * CalcAstroBase.DEG2RAD);
    lonecl -= 0.056 * Math.sin((2 + Mj - 2 + Ms + 21) * CalcAstroBase.DEG2RAD);
    lonecl += 0.042 * Math.sin((3 * Mj - 5 * Ms + 21) * CalcAstroBase.DEG2RAD);
    lonecl -= 0.036 * Math.sin((Mj - 2 * Ms) * CalcAstroBase.DEG2RAD);
    lonecl += 0.022 * Math.cos((Mj - Ms) * CalcAstroBase.DEG2RAD);
    lonecl += 0.023 * Math.sin((2 * Mj - 3 * Ms + 52) * CalcAstroBase.DEG2RAD);
    lonecl -= 0.016 * Math.sin((Mj - 5 * Ms - 69) * CalcAstroBase.DEG2RAD);

    let r = this.getDistance(elements);

    let xh = r * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let yh = r * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    let possun = this.getPosSun();

    lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * 土星の黄経を取得する
 * @returns 土星の地心黄経
 */
CalcOrbitKepler.prototype.getLonSaturn = function() {
    let elements = this.KeplerElements["saturn"];
    let lonecl = this.getLongitude(elements);

    let Mj = this.getParameter(this.KeplerElements["jupiter"]["M"]);
    let Ms = this.getParameter(this.KeplerElements["saturn"]["M"]);

    lonecl += 0.812 * Math.sin((2 * Mj - 5 * Ms - 67.6) * CalcAstroBase.DEG2RAD);
    lonecl -= 0.229 * Math.cos((2 * Mj - 4 * Ms - 2) * CalcAstroBase.DEG2RAD);
    lonecl += 0.119 * Math.sin((Mj - 2 * Ms - 3) * CalcAstroBase.DEG2RAD);
    lonecl += 0.046 * Math.sin((2 * Mj - 6 * Ms - 69) * CalcAstroBase.DEG2RAD);
    lonecl += 0.014 * Math.sin((Mj - 3 * Ms + 32) * CalcAstroBase.DEG2RAD);

    let r = this.getDistance(elements);

    let xh = r * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let yh = r * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    let possun = this.getPosSun();

    lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * 天王星の黄経を取得する
 * @returns 天王星の地心黄経
 */
CalcOrbitKepler.prototype.getLonUranus = function() {
    let elements = this.KeplerElements["uranus"];
    let lonecl = this.getLongitude(elements);

    let Mj = this.getParameter(this.KeplerElements["jupiter"]["M"]);
    let Ms = this.getParameter(this.KeplerElements["saturn"]["M"]);
    let Mu = this.getParameter(this.KeplerElements["uranus"]["M"]);

    lonecl += 0.040 * Math.sin((Ms - 2 * Mu + 6) * CalcAstroBase.DEG2RAD);
    lonecl += 0.035 * Math.sin((Ms - 3 * Mu + 33) * CalcAstroBase.DEG2RAD);
    lonecl -= 0.015 * Math.sin((Mj - Mu + 20) * CalcAstroBase.DEG2RAD);

    let r = this.getDistance(elements);

    let xh = r * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let yh = r * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    let possun = this.getPosSun();

    lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * 海王星の黄経を取得する
 * @returns 海王星の地心黄経
 */
CalcOrbitKepler.prototype.getLonNeptune = function() {
    let elements = this.KeplerElements["neptune"];
    let lonecl = this.getLongitude(elements);

    // TODO: 摂動の補正

    let r = this.getDistance(elements);

    let xh = r * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let yh = r * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    let possun = this.getPosSun();

    lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * 冥王星の黄経を取得する
 * @returns 海王星の地心黄経
 */
CalcOrbitKepler.prototype.getLonPluto = function() {
    let S = 50.03 + 0.033459652 * this.d;
    S *= CalcAstroBase.DEG2RAD;
    let P = 238.95 + 0.003968789 * this.d;
    P *= CalcAstroBase.DEG2RAD;

    let lonecl = 238.9508 + 0.00400703 * this.d
    - 19.799 * Math.sin(P) + 19.848 * Math.cos(P)
    + 0.897 * Math.sin(2 * P) - 4.956 * Math.cos(2 * P)
    + 0.610 * Math.sin(3 * P) + 1.211 * Math.cos(3 * P)
    - 0.341 * Math.sin(4 * P) - 0.190 * Math.cos(4 * P)
    + 0.128 * Math.sin(5 * P) - 0.034 * Math.cos(5 * P)
    - 0.038 * Math.sin(6 * P) + 0.031 * Math.cos(6 * P)
    + 0.020 * Math.sin(S - P) - 0.010 * Math.cos(S - P);

    let r = 40.72
    + 6.68 * Math.sin(P) + 6.90 * Math.cos(P)
    - 1.18 * Math.sin(2 * P) - 0.03 * Math.cos(2 * P)
    + 0.15 * Math.sin(3 * P) - 0.14 * Math.cos(3 * P); 

    let xh = r * Math.cos(lonecl * CalcAstroBase.DEG2RAD);
    let yh = r * Math.sin(lonecl * CalcAstroBase.DEG2RAD);

    let possun = this.getPosSun();

    lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0) {
        lonecl += 360;
    }

    return lonecl % 360;
}

CalcOrbitKepler.prototype.getDragonHead = function() {
    let elements = CalcOrbitKepler.prototype.KeplerElements["moon"];
    let N = this.getParameter(elements["N"]) % 360;

    let lon_equ = N;
    let lat_equ = 0;
    // 地球上の座標を計算
    let epsilon = this.geteclipticInclinationAngle();
    // 赤経、赤緯を黄経、黄緯に変換
    let ecliptic = this.EquatorialToEcliptic(lon_equ, lat_equ, epsilon);

    return ecliptic.lambda;
}
/**
 * 小惑星の黄経を求める
 * @param {string} name 小惑星名
 * returns {number} 黄経[deg]
 */
CalcOrbitKepler.prototype.getLonAsteroid = function(name) {
    let elements = CalcOrbitKepler.prototype.KeplerElements[name];
    let lonecl = null;
    if(elements !== undefined){
        let M = this.getParameter(elements["M"]) % 360;
        let e = this.getParameter(elements["e"]);
        let a = this.getParameter(elements["a"]);
        let w = this.getParameter(elements["w"]) % 360;
        let N = this.getParameter(elements["N"]) % 360;
        let i = this.getParameter(elements["i"]) % 360;

        // let epoch_d = new Date(elements["epoch_d"][0]);
        let epoch = (elements["epoch"][0] - 2451545) / 365.25 + 2000.0;
        N += 0.013967 * ( 2000.0 - epoch) + 3.82394E-5 * this.d;
        let jd = CalcAstroBase.getJulianDay(CalcAstroBase.getGlobalTime(this.target_date, this.time_diff));
        let dt = jd - elements["epoch"][0];
        let n = elements["n"][0];
        M += n * dt;


        let E = this.solvKeplerEquation(M, e) % 360;
        let xv = a * (Math.cos(E * CalcAstroBase.DEG2RAD) - e);
        let yv = a * Math.sqrt(1.0 - e * e) * Math.sin(E * CalcAstroBase.DEG2RAD);
        let v = Math.atan2(yv, xv) * CalcAstroBase.RAD2DEG;
        let r = Math.sqrt(xv*xv + yv*yv);
        let xh = r * (Math.cos(N * CalcAstroBase.DEG2RAD) * Math.cos((v + w) * CalcAstroBase.DEG2RAD) - Math.sin(N * CalcAstroBase.DEG2RAD) * Math.sin((v + w) * CalcAstroBase.DEG2RAD) * Math.cos(i * CalcAstroBase.DEG2RAD));
        let yh = r * (Math.sin(N * CalcAstroBase.DEG2RAD) * Math.cos((v + w) * CalcAstroBase.DEG2RAD) + Math.cos(N * CalcAstroBase.DEG2RAD) * Math.sin((v + w) * CalcAstroBase.DEG2RAD) * Math.cos(i * CalcAstroBase.DEG2RAD));
        lonecl = Math.atan2(yh, xh) * CalcAstroBase.RAD2DEG;
    
        while(lonecl < 0){
            lonecl += 360;
        }
    
        let possun = this.getPosSun();
    
        lonecl = Math.atan2(yh + possun.y, xh + possun.x) * CalcAstroBase.RAD2DEG;
    
        while(lonecl < 0) {
            lonecl += 360;
        }
    }
    return lonecl;
}

/**
 * 太陽の直交座標を取得する
 * @returns {x: number, y: number} 太陽の直交座標（日心黄道座標）
 */
CalcOrbitKepler.prototype.getPosSun = function(epoch) {
    let lonsun = this.getLonSun();
    let sunElements = this.KeplerElements["sun"];
    let rsun = this.getDistance(sunElements);
    let xs = Math.cos(lonsun * CalcAstroBase.DEG2RAD) * rsun;
    let ys = Math.sin(lonsun * CalcAstroBase.DEG2RAD) * rsun;

    return {"x": xs, "y": ys};
}

/**
 * ケプラーの法則から惑星の黄経を求める
 * @param {array{number}} 軌道要素の係数
 * @return 黄経
 */
CalcOrbitKepler.prototype.getLongitude = function(elements) {
    let M = this.getParameter(elements["M"]) % 360;
    let e = this.getParameter(elements["e"]);
    let a = this.getParameter(elements["a"]);
    let w = this.getParameter(elements["w"]) % 360;
    let N = this.getParameter(elements["N"]) % 360;
    let i = this.getParameter(elements["i"]) % 360;
    let E = this.solvKeplerEquation(M, e) % 360;
    let xv = a * (Math.cos(E * CalcAstroBase.DEG2RAD) - e);
    let yv = a * Math.sqrt(1.0 - e * e) * Math.sin(E * CalcAstroBase.DEG2RAD);
    let v = Math.atan2(yv, xv) * CalcAstroBase.RAD2DEG;
    let r = Math.sqrt(xv*xv + yv*yv);
    let xh = r * (Math.cos(N * CalcAstroBase.DEG2RAD) * Math.cos((v + w) * CalcAstroBase.DEG2RAD) - Math.sin(N * CalcAstroBase.DEG2RAD) * Math.sin((v + w) * CalcAstroBase.DEG2RAD) * Math.cos(i * CalcAstroBase.DEG2RAD));
    let yh = r * (Math.sin(N * CalcAstroBase.DEG2RAD) * Math.cos((v + w) * CalcAstroBase.DEG2RAD) + Math.cos(N * CalcAstroBase.DEG2RAD) * Math.sin((v + w) * CalcAstroBase.DEG2RAD) * Math.cos(i * CalcAstroBase.DEG2RAD));
    let lonecl = Math.atan2(yh, xh) * CalcAstroBase.RAD2DEG;

    while(lonecl < 0){
        lonecl += 360;
    }

    return lonecl % 360;
}

/**
 * ケプラーの法則から惑星までの距離を求める
 * @param {array{number}} 軌道要素の係数
 * @return 惑星までの距離
 */
CalcOrbitKepler.prototype.getDistance = function(elements) {
    let M = this.getParameter(elements["M"]) % 360;
    let e = this.getParameter(elements["e"]);
    let a = this.getParameter(elements["a"]);
    let E = this.solvKeplerEquation(M, e) % 360;
    let xv = a * (Math.cos(E * CalcAstroBase.DEG2RAD) - e);
    let yv = a * Math.sqrt(1.0 - e * e) * Math.sin(E * CalcAstroBase.DEG2RAD);
    let r = Math.sqrt(xv*xv + yv*yv);

    return r;
}

/**
 * パラメータを計算する
 * @param {array{number}} params 係数配列
 * @return {number} パラメータ
 */
CalcOrbitKepler.prototype.getParameter = function(params){
    let param = 0;
    for(let i = 0; i < params.length; i++){
        param += params[i] * Math.pow(this.d, i);
    }
    return param;
}

/**
 * ケプラー運動方程式の計算
 * @param {number} M 平均点離角[deg]
 * @param {number} e 軌道離心率[deg]
 * @returns {number} 離心近点離角[deg]
 */
CalcOrbitKepler.prototype.solvKeplerEquation = function(M, e) {
    let E = M + e * Math.sin(M * CalcAstroBase.DEG2RAD) * (1.0 + e * Math.cos(M * CalcAstroBase.DEG2RAD));
    let dE;
    do{
        let dE = - (E - e * (180/Math.PI) * Math.sin(E * CalcAstroBase.DEG2RAD) - M) / (1 - e * Math.cos(E * CalcAstroBase.DEG2RAD));
        E += dE;
    }
    while(dE > 10e-7)
    return E;
}

/**
 * 黄道傾斜角を算出する
 * @param {*} target_date 指定日
 * @returns {number} 黄道傾斜角 [deg]
 */
CalcOrbitKepler.prototype.geteclipticInclinationAngle = function()
{
    let target_date = this.target_date;
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
 * 赤道座標系から黄道座標系へ変換する
 * @param {number} alpha 赤経[deg]
 * @param {number} delta 赤緯[deg]
 * @param {number} epsilon 黄道傾斜角[deg]
 * @returns {{lambda:number, beta:number}} 黄経[deg]、黄緯[deg]
 */
CalcOrbitKepler.prototype.EquatorialToEcliptic = function(alpha, delta, epsilon){
    alpha *= CalcAstroBase.DEG2RAD;
    delta *= CalcAstroBase.DEG2RAD;
    epsilon *= CalcAstroBase.DEG2RAD;
    let lambda = Math.atan2(Math.sin(delta) * Math.sin(epsilon) + Math.cos(delta) * Math.sin(alpha) * Math.cos(epsilon), Math.cos(delta) * Math.cos(alpha)) * CalcAstroBase.RAD2DEG;
    let beta = Math.asin(Math.sin(delta) * Math.cos(epsilon) - Math.cos(delta) * Math.sin(alpha) * Math.sin(epsilon)) * CalcAstroBase.RAD2DEG;

    return {"lambda": lambda, "beta": beta};
}

/**
 * 世界時を求める
 * @param {Date} local_date 地方時
 * @param {number} time_diff 時差
 * @return {Date} global_date
 */
CalcOrbitKepler.prototype.getGlobalTime = function(local_date, time_diff){
    let UT = new Date(local_date.getTime());
    UT.setHours(UT.getHours() - time_diff);
    return UT;
}
// 軌道要素
CalcOrbitKepler.prototype.KeplerElements = [];

// 太陽
CalcOrbitKepler.prototype.KeplerElements["sun"] = [];
CalcOrbitKepler.prototype.KeplerElements["sun"]["N"] = [0.0];
CalcOrbitKepler.prototype.KeplerElements["sun"]["i"] = [0.0];
CalcOrbitKepler.prototype.KeplerElements["sun"]["w"] = [282.9404, 4.70935E-5];
CalcOrbitKepler.prototype.KeplerElements["sun"]["a"] = [1.000];
CalcOrbitKepler.prototype.KeplerElements["sun"]["e"] = [0.016709, -1.151E-9];
CalcOrbitKepler.prototype.KeplerElements["sun"]["M"] = [356.0470, 0.9856002585];

// 月
CalcOrbitKepler.prototype.KeplerElements["moon"] = [];
CalcOrbitKepler.prototype.KeplerElements["moon"]["N"] = [125.1228, -0.0529538083];
CalcOrbitKepler.prototype.KeplerElements["moon"]["i"] = [5.1454];
CalcOrbitKepler.prototype.KeplerElements["moon"]["w"] = [318.0634, 0.1643573223];
CalcOrbitKepler.prototype.KeplerElements["moon"]["a"] = [60.2666];
CalcOrbitKepler.prototype.KeplerElements["moon"]["e"] = [0.054900];
CalcOrbitKepler.prototype.KeplerElements["moon"]["M"] = [115.3654, 13.0649929509];

// 水星
CalcOrbitKepler.prototype.KeplerElements["mercury"] = [];
CalcOrbitKepler.prototype.KeplerElements["mercury"]["N"] = [48.3313, 3.24587E-5];
CalcOrbitKepler.prototype.KeplerElements["mercury"]["i"] = [7.0047, 5.00E-8];
CalcOrbitKepler.prototype.KeplerElements["mercury"]["w"] = [29.1241, 1.01444E-5];
CalcOrbitKepler.prototype.KeplerElements["mercury"]["a"] = [0.387098];
CalcOrbitKepler.prototype.KeplerElements["mercury"]["e"] = [0.205635, 5.59E-10];
CalcOrbitKepler.prototype.KeplerElements["mercury"]["M"] = [168.6562, 4.0923344368];

// 金星
CalcOrbitKepler.prototype.KeplerElements["venus"] = [];
CalcOrbitKepler.prototype.KeplerElements["venus"]["N"] = [76.6799, 2.4659E-5];
CalcOrbitKepler.prototype.KeplerElements["venus"]["i"] = [3.3946, 2.75E-8];
CalcOrbitKepler.prototype.KeplerElements["venus"]["w"] = [54.8910, 1.38374E-5];
CalcOrbitKepler.prototype.KeplerElements["venus"]["a"] = [0.72333];
CalcOrbitKepler.prototype.KeplerElements["venus"]["e"] = [0.006773, -1.302E-9];
CalcOrbitKepler.prototype.KeplerElements["venus"]["M"] = [48.0052, 1.6021302244];

// 地球
CalcOrbitKepler.prototype.KeplerElements["earth"] = [];
CalcOrbitKepler.prototype.KeplerElements["earth"]["epoch"] = [2455209.5];
CalcOrbitKepler.prototype.KeplerElements["earth"]["N"] = [2.093395847137797E+02];
CalcOrbitKepler.prototype.KeplerElements["earth"]["i"] = [6.929615351029407];
CalcOrbitKepler.prototype.KeplerElements["earth"]["w"] = [3.398943577082272E+02];
CalcOrbitKepler.prototype.KeplerElements["earth"]["a"] = [1.370364193894473E+01];
CalcOrbitKepler.prototype.KeplerElements["earth"]["e"] = [3.787470786939693E-01];
CalcOrbitKepler.prototype.KeplerElements["earth"]["M"] = [9.890982612605885E+01];
CalcOrbitKepler.prototype.KeplerElements["earth"]["n"] = [1.942898308574450E-02];

// 火星
CalcOrbitKepler.prototype.KeplerElements["mars"] = [];
CalcOrbitKepler.prototype.KeplerElements["mars"]["N"] = [49.5574, 2.11081E-5];
CalcOrbitKepler.prototype.KeplerElements["mars"]["i"] = [1.8497, -1.78E-8];
CalcOrbitKepler.prototype.KeplerElements["mars"]["w"] = [286.5016, 2.92961E-5];
CalcOrbitKepler.prototype.KeplerElements["mars"]["a"] = [1.523688];
CalcOrbitKepler.prototype.KeplerElements["mars"]["e"] = [0.093405, 2.516E-9];
CalcOrbitKepler.prototype.KeplerElements["mars"]["M"] = [18.6021, 0.5240207766];

// 木星
CalcOrbitKepler.prototype.KeplerElements["jupiter"] = [];
CalcOrbitKepler.prototype.KeplerElements["jupiter"]["N"] = [100.4542, 2.76854E-5];
CalcOrbitKepler.prototype.KeplerElements["jupiter"]["i"] = [1.3030, -1.557E-7];
CalcOrbitKepler.prototype.KeplerElements["jupiter"]["w"] = [273.8777, 1.64505E-5];
CalcOrbitKepler.prototype.KeplerElements["jupiter"]["a"] = [5.20256];
CalcOrbitKepler.prototype.KeplerElements["jupiter"]["e"] = [0.048498, 4.469E-9];
CalcOrbitKepler.prototype.KeplerElements["jupiter"]["M"] = [19.8950, 0.0830853001];

// 土星
CalcOrbitKepler.prototype.KeplerElements["saturn"] = [];
CalcOrbitKepler.prototype.KeplerElements["saturn"]["N"] = [113.6634, 2.38980E-5];
CalcOrbitKepler.prototype.KeplerElements["saturn"]["i"] = [2.4886, -1.081E-7];
CalcOrbitKepler.prototype.KeplerElements["saturn"]["w"] = [339.3939, 2.97661E-5];
CalcOrbitKepler.prototype.KeplerElements["saturn"]["a"] = [9.55475];
CalcOrbitKepler.prototype.KeplerElements["saturn"]["e"] = [0.055546, -9.499E-9];
CalcOrbitKepler.prototype.KeplerElements["saturn"]["M"] = [316.9670, 0.0334442282];

// 天王星
CalcOrbitKepler.prototype.KeplerElements["uranus"] = [];
CalcOrbitKepler.prototype.KeplerElements["uranus"]["N"] = [74.0005, 1.3978E-5];
CalcOrbitKepler.prototype.KeplerElements["uranus"]["i"] = [0.7733, 1.9E-8];
CalcOrbitKepler.prototype.KeplerElements["uranus"]["w"] = [96.6612, 3.0565E-5];
CalcOrbitKepler.prototype.KeplerElements["uranus"]["a"] = [19.1817, -1.55E-8];
CalcOrbitKepler.prototype.KeplerElements["uranus"]["e"] = [0.047318, 7.45E-9];
CalcOrbitKepler.prototype.KeplerElements["uranus"]["M"] = [142.5905, 0.011725806];

// 海王星
CalcOrbitKepler.prototype.KeplerElements["neptune"] = [];
CalcOrbitKepler.prototype.KeplerElements["neptune"]["N"] = [131.7806, 3.0173E-5];
CalcOrbitKepler.prototype.KeplerElements["neptune"]["i"] = [1.7700, -2.55E-7];
CalcOrbitKepler.prototype.KeplerElements["neptune"]["w"] = [272.8461, -6.027E-6];
CalcOrbitKepler.prototype.KeplerElements["neptune"]["a"] = [30.05826, 3.313E-8];
CalcOrbitKepler.prototype.KeplerElements["neptune"]["e"] = [0.008606, 2.15E-9];
CalcOrbitKepler.prototype.KeplerElements["neptune"]["M"] = [260.2471, 0.005995147];

// 95P/Chiron
CalcOrbitKepler.prototype.KeplerElements["95P"] = [];
CalcOrbitKepler.prototype.KeplerElements["95P"]["epoch"] = [2455209.5];
CalcOrbitKepler.prototype.KeplerElements["95P"]["N"] = [2.093395847137797E+02];
CalcOrbitKepler.prototype.KeplerElements["95P"]["i"] = [6.929615351029407];
CalcOrbitKepler.prototype.KeplerElements["95P"]["w"] = [3.398943577082272E+02];
CalcOrbitKepler.prototype.KeplerElements["95P"]["a"] = [1.370364193894473E+01];
CalcOrbitKepler.prototype.KeplerElements["95P"]["e"] = [3.787470786939693E-01];
CalcOrbitKepler.prototype.KeplerElements["95P"]["M"] = [9.890982612605885E+01];
CalcOrbitKepler.prototype.KeplerElements["95P"]["n"] = [1.942898308574450E-02];

// 81 Terpsichore
CalcOrbitKepler.prototype.KeplerElements["81"] = [];
CalcOrbitKepler.prototype.KeplerElements["81"]["epoch"] = [ 2458600.5];
CalcOrbitKepler.prototype.KeplerElements["81"]["N"] = [.959645244860648];
CalcOrbitKepler.prototype.KeplerElements["81"]["i"] = [7.802982899585655];
CalcOrbitKepler.prototype.KeplerElements["81"]["w"] = [51.67737713296108];
CalcOrbitKepler.prototype.KeplerElements["81"]["a"] = [2.853597190980958];
CalcOrbitKepler.prototype.KeplerElements["81"]["e"] = [.2106974047661263];
CalcOrbitKepler.prototype.KeplerElements["81"]["M"] = [347.1899456280588];
CalcOrbitKepler.prototype.KeplerElements["81"]["n"] = [.2044631609833226];
