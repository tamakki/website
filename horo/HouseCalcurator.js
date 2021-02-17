//const SignUtil = require('./SignUtil');
/**
 * カプス計算クラス
 * @param {Date} date 日付
 * @param {Number} longitude 経度 degree
 * @param {Number} latitude 緯度 degree
 */
let HouseCalcurator = function(date, longitude, latitude){
    this.DEG2RAD = Math.PI / 180.0;
    this.RAD2DEG = 180.0 / Math.PI;
    this.date = date;
    //// 日付の変換
    // ユリウス日
    let JD = this.getJD(date);
    // ユリウス世紀
    let TJD = this.getTJD(JD);
    // グリニッジ恒星時
    let ST0 = this.getGreenwichSiderealTime(TJD);
    this.ST0 = ST0 * this.DEG2RAD;
    // 地方恒星時
    let ST = (ST0 + longitude) % 360;

    // 黄道傾斜角
    let ecliptic = this.geteclipticInclinationAngle(date);

    // カスプの計算準備
    this.ST = ST * this.DEG2RAD;
    this.ecliptic = ecliptic * this.DEG2RAD;
    this.latitude = latitude * this.DEG2RAD;
    this.longitude = longitude * this.DEG2RAD;

    this.MC = this.getMC();
    this.ASC = this.getASC();

    // 固定値
    this.init_value = 0.0;
    this.err = Math.PI / 360 / 60;
    this.dx = Math.PI / 360 / 60 / 10000;
    this.calc_max = 1000;

}

/**
 * プラシーダスハウス　カスプ一覧を取得する
 */
HouseCalcurator.prototype.getPlacidus = function() {
    const C1 = this.ASC;
    const C2 = this.getPlacidusC2();
    const C3 = this.getPlacidusC3();
    const C7 = (this.ASC + 180) % 360;
    const C10 = this.MC;
    const C11 = this.getPlacidusC11();
    const C12 = this.getPlacidusC12();
    const C4 = (this.MC + 180) % 360;
    const C5 = (C11 + 180) % 360;
    const C6 = (C12 + 180) % 360;
    const C8 = (C2 + 180) % 360;
    const C9 = (C3 + 180) % 360;
    return {
        'ASC': {'angle': this.ASC},
        'MC': {'angle': this.MC},
        'casps' :[
            {'angle': C1},
            {'angle': C2},
            {'angle': C3},
            {'angle': C4},
            {'angle': C5},
            {'angle': C6},
            {'angle': C7},
            {'angle': C8},
            {'angle': C9},
            {'angle': C10},
            {'angle': C11},
            {'angle': C12}
        ]
    }
}

/**
 * キャンパナスシステムのカスプを取得する
 */
HouseCalcurator.prototype.getCampanus = function() {
    // C1 東から見上げ　 15度
    const C1 = this.getPrimVerticalCasp(15);
    // C2 東から見上げ　-15度
    const C2 = this.getPrimVerticalCasp(-15);
    // C3 東から見上げ　-45度
    const C3 = this.getPrimVerticalCasp(-45);
    // C4 東から見上げ　-75度
    const C4 = this.getPrimVerticalCasp(-75);
    // C11 東から見上げ  75度
    const C11 = this.getPrimVerticalCasp(75);
    // C12 東から見上げ  45度
    const C12 = this.getPrimVerticalCasp(45);
    // C5 = C11 + 180度
    const C5 = (C11 + 180) % 360;
    // C6 = C12 + 180度
    const C6 = (C12 + 180) % 360;
    // C7 = C1 + 180度
    const C7 = (C1 + 180) % 360;
    // C8 = C2 + 180度
    const C8 = (C2 + 180) % 360;
    // C9 = C3 + 180度
    const C9 = (C3 + 180) % 360;
    // C10 = C4 + 180度
    const C10 = (C4 + 180) % 360;


    return {
        'ASC': {'angle': this.ASC},
        'MC': {'angle': this.MC},
        'casps' :[
            {'angle': C1},
            {'angle': C2},
            {'angle': C3},
            {'angle': C4},
            {'angle': C5},
            {'angle': C6},
            {'angle': C7},
            {'angle': C8},
            {'angle': C9},
            {'angle': C10},
            {'angle': C11},
            {'angle': C12}
        ]
    }

}


/**
 * レジオモンタナスシステムのカスプを取得する
 */
HouseCalcurator.prototype.getRegiomontanus = function() {
    // C1 東から見上げ　 0度
    const C1 = this.getPrimVerticalCasp(0);
    // C2 東から見上げ　-30度
    const C2 = this.getPrimVerticalCasp(-30);
    // C3 東から見上げ　-60度
    const C3 = this.getPrimVerticalCasp(-60);
    // C4 東から見上げ　-90度
    const C4 = this.getPrimVerticalCasp(-90);
    // C11 東から見上げ  60度
    const C11 = this.getPrimVerticalCasp(60);
    // C12 東から見上げ  30度
    const C12 = this.getPrimVerticalCasp(30);
    // C5 = C11 + 180度
    const C5 = (C11 + 180) % 360;
    // C6 = C12 + 180度
    const C6 = (C12 + 180) % 360;
    // C7 = C1 + 180度
    const C7 = (C1 + 180) % 360;
    // C8 = C2 + 180度
    const C8 = (C2 + 180) % 360;
    // C9 = C3 + 180度
    const C9 = (C3 + 180) % 360;
    // C10 = C4 + 180度
    const C10 = (C4 + 180) % 360;


    return {
        'ASC': {'angle': this.ASC},
        'MC': {'angle': this.MC},
        'casps' :[
            {'angle': C1},
            {'angle': C2},
            {'angle': C3},
            {'angle': C4},
            {'angle': C5},
            {'angle': C6},
            {'angle': C7},
            {'angle': C8},
            {'angle': C9},
            {'angle': C10},
            {'angle': C11},
            {'angle': C12}
        ]
    }

}

/**
 * 卯酉線上の大円の点の黄経を取得する
 * @param {number} nue 東の点から見上げた角度[deg]
 */
HouseCalcurator.prototype.getPrimVerticalCasp = function(deg) {
    var sin = Math.sin;
    var cos = Math.cos;
    var atan2 = Math.atan2;
    var s = this.ST;
    var nue = deg * this.DEG2RAD;
    var lambda = atan2(
        sin(s) * sin(nue) + cos(s) * cos(this.latitude) * cos(nue)
        , cos(s) * sin(nue) * cos(this.ecliptic) - sin(this.ecliptic) * sin(this.latitude) * cos(nue) - sin(s) * cos(this.latitude) * cos(this.ecliptic) * cos(nue)
    ) * this.RAD2DEG;
    if(lambda < 360) lambda += 360;
    if(this.getAngle(lambda, this.MC) > 180) {
        lambda -= 180;
    }
    return lambda % 360;
}
/**
 * コッホシステムのハウスを取得する
 */
HouseCalcurator.prototype.getKoch = function() {
    const ASC = this.ASC;
    const MC = this.MC;

    var time_ASC = this.date.getTime();
    var deg = this.getAngle(ASC, MC);
    var i = 0;
    var diff = 1000 * 60 * 60;
    do {
        time_ASC -= diff;
        const newASC = this.getASCfromDate(new Date(time_ASC));
        if(deg < this.getAngle(newASC, MC) % 180) {
            diff *= -0.1;
        }
        if(Math.abs(diff) < 1) {
            break;
        }
        deg = this.getAngle(MC, newASC);
    } while(deg > 0.1);

    const DEC = (this.ASC + 180) % 360;
    var time_DEC = this.date.getTime();
    diff = 1000 * 60 * 60;
    deg = this.getAngle(MC, DEC);
    do {
        time_DEC += diff;
        const newDEC = (this.getASCfromDate(new Date(time_DEC)) + 180) % 360;

        if(deg < this.getAngle(MC, newDEC) % 180) {
            diff *= -0.1;
        }
        if(Math.abs(diff) < 1) {
            break;
        }
        deg = this.getAngle(MC, newDEC);
    } while(deg > 0.1);
    
    const diff_ASC = this.date.getTime() - time_ASC;
    const diff_DEC = time_DEC - this.date.getTime();
    const C11 = this.getASCfromDate(new Date(time_ASC + diff_ASC / 3.0));
    const C12 = this.getASCfromDate(new Date(time_ASC + diff_ASC / 3.0 * 2));
    const C9 = (this.getASCfromDate(new Date(time_DEC - diff_DEC / 3.0)) + 180) % 360;
    const C8 = (this.getASCfromDate(new Date(time_DEC - diff_DEC / 3.0 * 2)) + 180) % 360;

    const C1 = this.ASC;
    const C7 = (this.ASC + 180) % 360;
    const C10 = this.MC;
    const C4 = (this.MC + 180) % 360;
    const C5 = (C11 + 180) % 360;
    const C6 = (C12 + 180) % 360;
    const C2 = (C8 + 180) % 360;
    const C3 = (C9 + 180) % 360;


    return {
        'ASC': {'angle': this.ASC},
        'MC': {'angle': this.MC},
        'casps' :[
            {'angle': C1},
            {'angle': C2},
            {'angle': C3},
            {'angle': C4},
            {'angle': C5},
            {'angle': C6},
            {'angle': C7},
            {'angle': C8},
            {'angle': C9},
            {'angle': C10},
            {'angle': C11},
            {'angle': C12}
        ]
    }
}

/**
 * 日時からMCを求める
 * @param {Date} date 
 */
HouseCalcurator.prototype.getMCfromDate = function(date) {
    //// 日付の変換
    // ユリウス日
    let JD = this.getJD(date);
    // ユリウス世紀
    let TJD = this.getTJD(JD);
    // グリニッジ恒星時
    let ST0 = this.getGreenwichSiderealTime(TJD);
    // 地方恒星時
    let ST = (ST0 + this.longitude * this.RAD2DEG) % 360;
    ST *= this.DEG2RAD;

    // 黄道傾斜角
    let ecliptic = this.geteclipticInclinationAngle(date) * this.DEG2RAD;
    let MC =  Math.atan2(Math.tan(ST), Math.cos(ecliptic)) * this.RAD2DEG;
    
    // 象限を合わせる
    while(MC < ST * this.RAD2DEG){
        MC += 180;
    }
    while(Math.abs(MC - ST * this.RAD2DEG) > 90){
        MC -= 180;
    }

    return (MC + 360) % 360;

}

/**
 * 日時を指定してASCを求める
 * @param {Date} date　指定日時 
 */
HouseCalcurator.prototype.getASCfromDate = function(date) {
    const ecliptic = this.geteclipticInclinationAngle(date) * this.DEG2RAD;
    const MC = this.getMCfromDate(date);
    
    //// 日付の変換
    // ユリウス日
    let JD = this.getJD(date);
    // ユリウス世紀
    let TJD = this.getTJD(JD);
    // グリニッジ恒星時
    let ST0 = this.getGreenwichSiderealTime(TJD);
    // 地方恒星時
    let ST = (ST0 + this.longitude * this.RAD2DEG) % 360;
    ST *= this.DEG2RAD;

    let ASC = Math.PI / 2 
    - Math.atan2(-(Math.tan(this.latitude) 
    * Math.sin(ecliptic)+(Math.sin(ST)
    * Math.cos(ecliptic))), Math.cos(ST));
    ASC *= this.RAD2DEG;

    if(this.getAngle(ASC, MC) > 180) {
        ASC -= 180;
    }
    return (ASC + 360) % 360;
}

/**
 * ユリウス日を求める
 * @param {*} date 日付
 */
HouseCalcurator.prototype.getJD = function(date) {
    let y = date.getUTCFullYear();
    let M = date.getUTCMonth() + 1;
    let d = date.getUTCDate();
    let h = date.getUTCHours();
    let m = date.getUTCMinutes();
    // 1月2月は前年の13月14月と読み替える
    if(M <= 2){
        y--;
        M += 12;
    }

    // ユリウス暦に変換
    var JD = 
        Math.floor(y * 365.25) 
        + Math.floor(y/400.0) 
        - Math.floor(y/100.0) 
        + Math.floor(30.59*(M - 2.0)) 
        + d + 1721088.5 + h/24.0 + m /1440.0;
    return JD;
}

/**
 * ユリウス世紀数を求める
 * @param {*} JD ユリウス日
 */
HouseCalcurator.prototype.getTJD = function(JD) {
    return JD - 2440000.5;
}

/**
 * グリニッジ恒星時を求める
 * @param {number} TJD
 * @returns {number} グリニッジ恒星時 [deg]
 */
HouseCalcurator.prototype.getGreenwichSiderealTime = function (TJD){
    var ST0 = 360.0 * (0.671262 + 1.0027379094 * TJD);
    return ST0 % 360.0;
}

/**
 * 黄道傾斜角を算出する
 * @param {*} target_date 指定日
 * @returns {number} 黄道傾斜角 [deg]
 */
HouseCalcurator.prototype.geteclipticInclinationAngle = function (target_date)
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
 * MCを求める
 * @param {*} ST 地方恒星時[rad] 
 * @param {*} e 黄道傾斜角[deg]
 */
HouseCalcurator.prototype.getMC = function (){
    let MC =  Math.atan2(Math.tan(this.ST), Math.cos(this.ecliptic)) * this.RAD2DEG;
    
    // 象限を合わせる
    while(MC < this.ST * this.RAD2DEG){
        MC += 180;
    }
    while(Math.abs(MC - this.ST * this.RAD2DEG) > 90){
        MC -= 180;
    }

    return (MC + 360) % 360;
}

/**
 * ASCを求める
 * @param {number} latitude 緯度 [deg]
 * @param {number} ecliptic 黄道傾斜角 [deg]
 * @param {number} ST 地方恒星時 [deg]
 */
HouseCalcurator.prototype.getASC = function(){
    let ASC = Math.PI / 2 
    - Math.atan2(-(Math.tan(this.latitude) 
    * Math.sin(this.ecliptic)+(Math.sin(this.ST)
    * Math.cos(this.ecliptic))), Math.cos(this.ST));
    ASC *= this.RAD2DEG;

    if(this.getAngle(ASC, this.MC) > 180) {
        ASC -= 180;
    }
    return (ASC + 360) % 360;
}

/**
 * 第2カプスの計算
 */
HouseCalcurator.prototype.getPlacidusC2 = function() {
    const ecliptic = this.ecliptic;
    const ST = this.ST;
    const latitude = this.latitude;
    const fx = function(x) {
        return ST + Math.PI - Math.acos(Math.sin(x)*Math.tan(ecliptic)*Math.tan(latitude))/1.5 - x;
    }
    return this.calc(fx);
}

/**
 * 第3カプスの計算
 */
HouseCalcurator.prototype.getPlacidusC3 = function() {
    const ecliptic = this.ecliptic;
    const ST = this.ST;
    const latitude = this.latitude;
    const fx = function(x){
        return ST + Math.PI - Math.acos(Math.sin(x) * Math.tan(ecliptic) * Math.tan(latitude)) / 3 - x;
    }
    return this.calc(fx);
}

/**
 * 第11カプスの計算
 */
HouseCalcurator.prototype.getPlacidusC11 = function() {
    const ecliptic = this.ecliptic;
    const ST = this.ST;
    const latitude = this.latitude;
    const fx = function(x){
        return ST + Math.acos(-Math.sin(x) * Math.tan(ecliptic) * Math.tan(latitude)) / 3.0 - x;
    }
    return this.calc(fx);
}

/**
 * 第12カプスの計算
 */
HouseCalcurator.prototype.getPlacidusC12 = function() {
    const ecliptic = this.ecliptic;
    const ST = this.ST;
    const latitude = this.latitude;
    const fx = function(x){
        return ST + Math.acos(-Math.sin(x) * Math.tan(ecliptic) * Math.tan(latitude)) / 1.5 - x
    }
    return this.calc(fx);
}

/**
 * 計算の実行
 * @param {function} fx カスプ計算用の式
 */
HouseCalcurator.prototype.calc = function(fx) {
    let casp = this.NewtonApproximation(fx, this.init_value, this.dx, this.err, this.calc_max);
    casp = Math.atan2(Math.tan(casp), Math.cos(this.ecliptic));
    if(casp < 0) casp += Math.PI * 2;
    casp *= this.RAD2DEG;
    if(casp < 0){
        casp += 360;
    }
    casp %= 360;

    // 象限を合わせる

    if(Math.sin((casp - this.MC)*this.DEG2RAD) < 0){
        casp += 180;
    }

    return casp % 360;
}

/**
 * ニュートン法による近似解の算出
 * @param {CalcCasp} 計算クラス
 * @param {number} init_value 初期値
 * @param {number} dx 微分するときの差分
 * @param {number} err 許容誤差
 * @param {number} calc_max 最大計算回数
 */
HouseCalcurator.prototype.NewtonApproximation = function(fx, init_value, dx, err, calc_max){
    let x = init_value;
    for(let i = 0; i < calc_max; i++){
        let current = fx(x);
        if(Math.abs(current) < err){
            return x;
        }
        let a = (fx(x + dx) - current) / dx;
        x -= current / a;
    }
    throw null;
}

/**
 * 2つの角度間の角度を計算する
 * @param {number} deg1 
 * @param {number} deg2 
 */
HouseCalcurator.prototype.getAngle = function(angle1, angle2){
    let x1 = Math.cos(angle1 * Math.PI / 180);
    let y1 = Math.sin(angle1 * Math.PI / 180);
    let x2 = Math.cos(angle2 * Math.PI / 180);
    let y2 = Math.sin(angle2 * Math.PI / 180);

    let cosTheta = (x1*x2 + y1*y2) / (Math.sqrt(x1*x1 + y1*y1) * Math.sqrt(x2*x2 + y2*y2));
    let dtheta = Math.acos(cosTheta) * 180 / Math.PI;

    return dtheta % 180;
}
