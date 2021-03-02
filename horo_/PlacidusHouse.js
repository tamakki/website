
/**
 * カプス計算クラス
 * @param {Date} target_date 地方時間
 * @param {number} time_diff 世界標準時からの時差[時間]
 * @param {number} longitude 東経[deg]
 * @param {number} latitude 北緯[deg]
 */
let PlacidusHouse = function(target_date, time_diff, longitude, latitude){
    // 世界標準時
    this.UT = CalcAstroBase.getGlobalTime(target_date, time_diff);
    // ユリウス日
    this.JD = CalcAstroBase.getJulianDay(this.UT);
    // 世界時
    this.TJD = CalcAstroBase.getTJD(this.JD);
    // グリニッジ恒星時
    this.ST0 = CalcAstroBase.getGreenwichSiderealTime(this.TJD);
    // 地方恒星時
    this.ST = (this.ST0 + longitude) % 360;
    this.ecliptic = CalcAstroBase.geteclipticInclinationAngle(target_date);
    this.latitude = latitude;
    this.MC = this.getMC();
    this.DEC = (this.MC + 180) % 360;

    // 固定値
    this.init_value = 0.0;
    this.err = Math.PI / 360 / 60;
    this.dx = Math.PI / 360 / 60 / 10000;
    this.calc_max = 1000;
}

/**
 * MCを求める
 * @return {number} MC
 */
PlacidusHouse.prototype.getMC = function(){
    let MC =  Math.atan2(Math.tan(this.ST * CalcAstroBase.DEG2RAD), Math.cos(this.ecliptic * CalcAstroBase.DEG2RAD)) * CalcAstroBase.RAD2DEG;
    
    // 象限を合わせる
    while(MC < this.ST){
        MC += 180;
    }
    while(Math.abs(MC - this.ST) > 90){
        MC -= 180;
    }

    return MC % 360;
}

/**
 * ASCを求める
 * @param {number} latitude 緯度 [deg]
 * @param {number} ecliptic 黄道傾斜角 [deg]
 * @param {number} ST 地方恒星時 [deg]
 * @returns {number} ASC
 */
PlacidusHouse.prototype.getASC = function(){
    let ASC = Math.PI / 2 
    - Math.atan2(-(Math.tan(this.latitude * CalcAstroBase.DEG2RAD) 
    * Math.sin(this.ecliptic * CalcAstroBase.DEG2RAD)+(Math.sin(this.ST * CalcAstroBase.DEG2RAD)
    * Math.cos(this.ecliptic * CalcAstroBase.DEG2RAD))), Math.cos(this.ST * CalcAstroBase.DEG2RAD));
    ASC *= CalcAstroBase.RAD2DEG;
    let MC = this.getMC();

    if(PlacidusHouse.getAngle(ASC, MC) > 180){
        ASC -= 180;
    }
    return ASC % 360;
}

/**
 * カスプの計算
 */
PlacidusHouse.prototype.calcCasp = function (fx){
    let casp = this.newtonApproximation(fx, this.init_value, this.dx, this.err, this.calc_max);
    casp = Math.atan2(Math.tan(casp), Math.cos(this.ecliptic * CalcAstroBase.DEG2RAD));
    if(casp < 0) casp += Math.PI * 2;
    casp *= CalcAstroBase.RAD2DEG;
    if(casp < 0){
        casp += 360;
    }
    casp %= 360;

    // 象限を合わせる
    if(Math.sin((casp - this.MC) * CalcAstroBase.DEG2RAD) < 0){
        casp += 180;
    }

    return casp % 360;
}

/**
 * 第2カスプを取得する
 * @returns {number} 第2カスプ
 */
PlacidusHouse.prototype.getCasp2 = function(){
    let ST = this.ST * CalcAstroBase.DEG2RAD;
    let ecliptic = this.ecliptic * CalcAstroBase.DEG2RAD;
    let latitude = this.latitude * CalcAstroBase.DEG2RAD;
    let deg = this.calcCasp(function(x){ return ST + Math.PI - Math.acos(Math.sin(x) * Math.tan(ecliptic) * Math.tan(latitude)) / 1.5 - x});
    let asc = this.getASC();

    if(PlacidusHouse.getAngle(deg, asc) > 180){
        deg -= 180;
    }

    return deg;
}

/**
 * 第3カスプを取得する
 * @returns {number} 第3カスプ
 */
PlacidusHouse.prototype.getCasp3 = function(){
    let ST = this.ST * CalcAstroBase.DEG2RAD;
    let ecliptic = this.ecliptic * CalcAstroBase.DEG2RAD;
    let latitude = this.latitude * CalcAstroBase.DEG2RAD;
    let deg = this.calcCasp(function(x){ return ST + Math.PI - Math.acos(Math.sin(x) * Math.tan(ecliptic) * Math.tan(latitude)) / 3 - x});
    let asc = this.getASC();

    if(PlacidusHouse.getAngle(deg, asc) > 180){
        deg -= 180;
    }

    return deg;
}

/**
 * 第11カスプを取得する
 * @returns {number} 第11カスプ
 */
PlacidusHouse.prototype.getCasp11 = function(){
    let ST = this.ST * CalcAstroBase.DEG2RAD;
    let ecliptic = this.ecliptic * CalcAstroBase.DEG2RAD;
    let latitude = this.latitude * CalcAstroBase.DEG2RAD;
    let deg =  this.calcCasp(function(x){ return ST + Math.acos(-Math.sin(x) * Math.tan(ecliptic) * Math.tan(latitude)) / 3.0 - x});
    let asc = this.getASC();

    if(PlacidusHouse.getAngle(deg, asc) < 180){
        deg += 180;
    }

    return deg;
}

/**
 * 第12カスプを取得する
 * @returns {number} 第12カスプ
 */
PlacidusHouse.prototype.getCasp12 = function(){
    let ST = this.ST * CalcAstroBase.DEG2RAD;
    let ecliptic = this.ecliptic * CalcAstroBase.DEG2RAD;
    let latitude = this.latitude * CalcAstroBase.DEG2RAD;
    let deg = this.calcCasp(function(x) { return ST + Math.acos(-Math.sin(x) * Math.tan(ecliptic) * Math.tan(latitude)) / 1.5 - x});
    let asc = this.getASC();

    if(PlacidusHouse.getAngle(deg, asc) < 180){
        deg += 180;
    }

    return deg;
}

/**
 * ニュートン法による近似解の算出
 * @param {PlacidusHouse} 計算クラス
 * @param {number} init_value 初期値
 * @param {number} dx 微分するときの差分
 * @param {number} err 許容誤差
 * @param {number} calc_max 最大計算回数
 */
PlacidusHouse.prototype.newtonApproximation = function(fx, init_value, dx, err, calc_max){
    let x = init_value;
    for(let i = 0; i < calc_max; i++){
        let current = fx(x);
        if(Math.abs(current) < err){
            return x;
        }
        let a = (fx(x + dx) - current) / dx;
        x -= current / a;
    }
    return x;
}

/**
 * 2角度間の角度を計算
 * @param {number} deg1 角度1[deg]
 * @param {number} deg2 角度2[deg]
 * @returns {number} 2角度間のなす角
 */
PlacidusHouse.getAngle = function(deg1, deg2){
    while(deg1 < 0){
        deg1 += 360;
    }
    while(deg2 < 0){
        deg2 += 360;
    }
    deg1 %= 360;
    deg2 %= 360;
    if(deg1 < deg2){
        deg1 += 360;
    }
    return deg1 - deg2;
}
