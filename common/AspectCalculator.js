/**
 * アスペクト計算クラス
 */
let AspectCalculator = function () {
    // 計算対象の初期値
    this.targets = [];
}

// 定数
MajorBodys = [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'neptune',
    'uranus',
    'pluto'
]

/**
 * 許容誤差[deg]
 */
AspectCalculator.OrbMajor = 5;
AspectCalculator.OrbMinor = 3;

/**
 * タイトスペクトのダッシュ間隔
 */
AspectCalculator.TIGHT_ASPECT_DASH_ARRY = "none";
/**
 * ルーズアスペクトのダッシュ間隔
 */
AspectCalculator.LOOSE_ASPECT_DASH_ARRY = "3";

/**
 * ハードアスペクトの表示色
 */
AspectCalculator.HARD_ASPECT_COLOR = "#f00";
/**
 * ハードアスペクトのダッシュ間隔
 */
AspectCalculator.HARD_ASPECT_DASH_ARRY = "none";
/**
 * ソフトアスペクトの表示色
 */
AspectCalculator.SOFT_ASPECT_COLOR = "#00f";

/**
 * ハードアスペクト
 */
AspectCalculator.HARD_ASPECT = [
    { "symbol": "☌", name: "Conjunction", angle: 0, display: true, "stroke": AspectCalculator.HARD_ASPECT_COLOR },
    { "symbol": "∠", name: "Semi-Square", angle: 45, display: true, "stroke": AspectCalculator.HARD_ASPECT_COLOR },
    { "symbol": "Se", name: "Septile", angle: 360 / 7, display: true, "stroke": AspectCalculator.HARD_ASPECT_COLOR },
    { "symbol": "□", name: "Square", angle: 90, display: true, "stroke": AspectCalculator.HARD_ASPECT_COLOR },
    { "symbol": "⚼", name: "Sesqui-square", angle: 135, display: true, "stroke": AspectCalculator.HARD_ASPECT_COLOR },
    { "symbol": "⚻", name: "Inconjunct", angle: 150, display: true, "stroke": AspectCalculator.HARD_ASPECT_COLOR },
    { "symbol": "☍", name: "Opposition", angle: 180, display: true, "stroke": AspectCalculator.HARD_ASPECT_COLOR },
];

/**
 * ソフトアスペクト
 */
AspectCalculator.SOFT_ASPECT = [
    { "symbol": "⚺", name: "Semi-Sextile", angle: 30, display: true, "stroke": AspectCalculator.SOFT_ASPECT_COLOR },
    { "symbol": "⊥", name: "Decile", angle: 36, display: true, "stroke": AspectCalculator.SOFT_ASPECT_COLOR },
    { "symbol": "No", name: "Novaile", angle: 40, display: true, "stroke": AspectCalculator.SOFT_ASPECT_COLOR },
    { "symbol": "⚹", name: "Sextile", angle: 60, display: true, "stroke": AspectCalculator.SOFT_ASPECT_COLOR },
    { "symbol": "Q", name: "Quintile", angle: 72, display: true, "stroke": AspectCalculator.SOFT_ASPECT_COLOR },
    { "symbol": "△", name: "Trine", angle: 120, display: true, "stroke": AspectCalculator.SOFT_ASPECT_COLOR },
    { "symbol": "bq", name: "Biquintile", angle: 144, display: true, "stroke": AspectCalculator.SOFT_ASPECT_COLOR },
];

/**
 * nullアスペクト
 */
AspectCalculator.NULL_ASPECT = { "symbol": "", name: "", angle: null, display: false };

/**
 * 許容誤差を設定
 * @param {number} err 許容誤差[deg]
 */
AspectCalculator.prototype.setErr = function (err) {
    this.err = err;
}

/**
 * 計算ターゲット設定
 * @param {array({name: string, angle: number})} 天体データのリスト array{name: 天体名, angel: 黄経[deg]}
 */
AspectCalculator.prototype.setTargets = function (targets) {
    this.targets = targets;
}

/**
 * 2角度間の角度を計算
 * @param {number} angle1 角度1[deg]
 * @param {number} angle2 角度2[deg]
 * @returns {number} 2角度間の角度[deg] 0 ~ 180
 */
AspectCalculator.prototype.calcAngle = function (angle1, angle2) {
    let x1 = Math.cos(angle1 * Math.PI / 180);
    let y1 = Math.sin(angle1 * Math.PI / 180);
    let x2 = Math.cos(angle2 * Math.PI / 180);
    let y2 = Math.sin(angle2 * Math.PI / 180);

    let cosTheta = (x1 * x2 + y1 * y2) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2));
    if (cosTheta > 1 || cosTheta < -1) {
        cosTheta = cosTheta / Math.abs(cosTheta);
    }
    let dtheta = Math.acos(cosTheta) * 180 / Math.PI;

    return dtheta == 180 ? 180 : dtheta % 180;
}

/**
 * 設定値をもとにアスペクトを取得する
 * @returns {array(array(string))} アスペクトシンボルの配列の連想配列（キー：天体名）
 */
AspectCalculator.prototype.getAspects = function () {
    let aspects = [];
    let targets = setting.targets;
    for (let i = 0; i < this.targets.length; i++) {
        let target1 = this.targets[i];
        if (targets.indexOf(target1.name) === -1) continue;
        let list = [];
        for (let j = 0; j < i; j++) {
            let target2 = this.targets[j];
            if (targets.indexOf(target2.name) === -1) continue;
            let aspect = this.getAspect(target1, target2);
            let item = { "node1": target2, "node2": target1, "aspect": aspect }
            list.push(item);
        }
        let elm = { "key": target1.name, "value": list };
        aspects.push(elm)
    }
    return aspects;
}

/**
 * 角度に応じたアスペクトを返す
 * @param {number} angle 角度[deg]
 * @returns {string} 角度に応じたアスペクトのシンボル
 */
AspectCalculator.prototype.getAspect = function (target1, target2) {
    const angle = this.calcAngle(target1["angle"], target2["angle"]);
    const type = (MajorBodys.indexOf(target1.name) !== -1 && MajorBodys.indexOf(target2.name) !== -1) ? 'major' : 'minor';
    let result = AspectCalculator.NULL_ASPECT;
    // ハードアスペクト
    if (setting['disp-hard']) {
        for (let i = 0; i < AspectCalculator.HARD_ASPECT.length; i++) {
            let aspect = AspectCalculator.HARD_ASPECT[i];
            const aspectSetting =
                (setting.indivisuals && setting.indivisuals[target1.name]) ? setting.indivisuals[target1.name].aspectsetting[aspect.name]
                    : (setting.indivisuals && setting.indivisuals[target2.name]) ? setting.indivisuals[target2.name].aspectsetting[aspect.name]
                        : setting.aspectsetting[aspect.name];
            if (!aspectSetting.display) {
                continue;
            }
            if (Math.abs(aspect.angle - angle) < aspectSetting.orb[type].tight) {
                if (!setting['disp-tight']) continue;
                result = {};
                result.name = aspect.name;
                result.angle = aspect.angle;
                result["stroke-dasharray"] = AspectCalculator.TIGHT_ASPECT_DASH_ARRY;
                if (setting['disp-tight']) {
                    result.display = true;
                } else {
                    result.display = false;
                }
                result.stroke = aspect.stroke;
                result.tight = true;
                result.diff = Math.abs(aspect.angle - angle).toFixed(1);
                return result;
            } else if (Math.abs(aspect.angle - angle) < aspectSetting.orb[type].loose) {
                if (!setting['disp-loose']) continue;
                result = {};
                result.name = aspect.name;
                result.angle = aspect.angle;
                result["stroke-dasharray"] = AspectCalculator.LOOSE_ASPECT_DASH_ARRY;
                result.display = true;
                result.stroke = aspect.stroke;
                result.tight = false;
                result.diff = Math.abs(aspect.angle - angle).toFixed(1);
                return result;
            }
        }
    }
    // ソフトアスペクト
    if (setting['disp-soft']) {
        for (let i = 0; i < AspectCalculator.SOFT_ASPECT.length; i++) {
            let aspect = AspectCalculator.SOFT_ASPECT[i];
            const aspectSetting =
                (setting.indivisuals && setting.indivisuals[target1.name]) ? setting.indivisuals[target1.name].aspectsetting[aspect.name]
                    : (setting.indivisuals && setting.indivisuals[target2.name]) ? setting.indivisuals[target2.name].aspectsetting[aspect.name]
                        : setting.aspectsetting[aspect.name];
            if (!aspectSetting.display) {
                continue;
            }
            if (Math.abs(aspect.angle - angle) < aspectSetting.orb[type].tight) {
                if (!setting['disp-tight']) continue;
                result = {};
                result.name = aspect.name;
                result.angle = aspect.angle;
                result["stroke-dasharray"] = AspectCalculator.TIGHT_ASPECT_DASH_ARRY;
                result.display = true;
                result.stroke = aspect.stroke;
                result.tight = true;
                result.diff = Math.abs(aspect.angle - angle).toFixed(1);
                return result;
            } else if (Math.abs(aspect.angle - angle) < aspectSetting.orb[type].loose) {
                if (!setting['disp-loose']) continue
                result = {};
                result.name = aspect.name;
                result.angle = aspect.angle;
                result["stroke-dasharray"] = AspectCalculator.LOOSE_ASPECT_DASH_ARRY;
                result.display = true;
                result.stroke = aspect.stroke;
                result.tight = false;
                result.diff = Math.abs(aspect.angle - angle).toFixed(1);
                return result;
            }
        }
    }
    return result;
}

AspectCalculator.prototype.getAspectBetween = function (targets1, targets2) {
    let aspects = [];
    for (let i = 0; i < targets1.length; i++) {
        let target1 = targets1[i];
        let list = [];
        for (let j = 0; j < targets2.length; j++) {
            let target2 = targets2[j];
            let aspect = this.getAspect(target1, target2);
            let item = { "node1": target1, "node2": target2, "aspect": aspect }
            list.push(item);
        }
        let elm = { "key": target1.name, "value": list };
        aspects.push(elm)
    }
    return aspects;
}