/**
 * @author tamaki.nakamura
 * @version 1.0.0
 * @since 2019/11/01
 */

// 依存関係のあるファイルを読み込む
// 天体計算ベースクラス
let base = document.createElement('script');
base.src = "CalcAstroBase.js";
document.head.appendChild(base);
// 海上保安庁計算クラス
let coastguard = document.createElement('script');
coastguard.src = "CoastGuardMethod.js";
document.head.appendChild(coastguard);
// 軌道計算クラス
let kepler = document.createElement('script');
kepler.src = "CalcOrbitKepler.js";
document.head.appendChild(kepler);
// 天文暦ライブラリ
let ephemeris = document.createElement('script');
ephemeris.src = "ephemeris-0.1.0.min.js";
document.head.appendChild(ephemeris);
//// ハウスシステム
// プラシーダス
let placidus = document.createElement('script');
placidus.src = "PlacidusHouse.js";
document.head.appendChild(placidus);
// アスペクト計算クラス
let aspect_js = document.createElement('script');
aspect_js.src = "AspectCalculator.js?ver=120201128";
document.head.appendChild(aspect_js);
//// チャート
// SVGビルダ
let svg_builder = document.createElement('script');
svg_builder.src = "SvgBuilder.js";
document.head.appendChild(svg_builder);

// 1天体の締める角度[deg]
let BODY_SPACE_DEG = 10;

/**
 * ホロスコープ計算クラス
 * @param {date} target_date 指定日時
 * @param {number} time_diff グリニッジ標準時からの時差[hour]
 * @param {number} longitude 東経[deg]
 * @param {number} latitude 北緯[deg]
 * @constructor
 */
let HoroscopeCalculator = function (target_date, time_diff, longitude, latitude) {
    // 基本データを保存
    // 指定日時
    this.target_date = target_date;
    // 時差
    this.time_diff = time_diff;
    // 東経
    this.longitude = longitude;
    // 北緯
    this.latitude = latitude;
    // 表示設定
    this.display_setting = HoroscopeCalculator.DEFAULT_DESPLAY_SETTING;
    // ハウスシステム
    this.house_system = "soler_sign";
    // 海保のアルゴリズムが採用できるか
    let coast_guard = new CoastGuardMethod(target_date, time_diff);
    this.coast_guard = coast_guard.getParams(CalcAstroBase.Planet.SUN) != null;
}

/**
 * デフォルト表示設定
 * @constant
 */
HoroscopeCalculator.DEFAULT_DESPLAY_SETTING = [
    { "name": "sun", "display": true, "display_name": "太陽", "sign": "☉" },          // 太陽
    { "name": "moon", "display": true, "display_name": "月", "sign": "☽" },           // 月
    { "name": "mercury", "display": true, "display_name": "水星", "sign": "☿" },      // 水星
    { "name": "venus", "display": true, "display_name": "金星", "sign": "♀" },        // 金星
    { "name": "mars", "display": true, "display_name": "火星", "sign": "♂" },         // 火星
    { "name": "jupiter", "display": true, "display_name": "木星", "sign": "♃" },      // 木星
    { "name": "saturn", "display": true, "display_name": "土星", "sign": "♄" },       // 土星
    { "name": "uranus", "display": true, "display_name": "天王星", "sign": "♅" },     // 天王星
    { "name": "neptune", "display": true, "display_name": "海王星", "sign": "♆" },    // 海王星
    { "name": "pluto", "display": true, "display_name": "冥王星", "sign": "♇" },       // 冥王星
    /** 月の起動 */
    { "name": "dragon_head", "display": false, "display_name": "龍頭", "sign": "☊" },       // ドラゴンヘッド
    /** 小惑星 */
    { "name": "95P", "display": false, "display_name": "chiron", "sign": "chiron" },       // テレプシコーレ
    { "name": "81", "display": false, "display_name": "Terpsichore", "sign": "terepsicore" },       // テレプシコーレ
];

/**
 * ハウスシステム選択肢
 * @constant
 */
HoroscopeCalculator.HOUSE_SYSTEMS = [
    "placidus",
    // "koch",
    // "equal",
    // "campanus",
    // "regiomontanus",
    "soler",
    "soler_sign"
];

/**
 * 表示対象の天体の天体構造体リストを取得する
 * @returns {array{CelestialElement}} 天体構造体リスト
 */
HoroscopeCalculator.prototype.getElementList = function () {
    let element_list = [];
    let obj = this;
    this.display_setting.forEach(function (elm) {
        if (elm.display) {
            element_list.push(obj.getElement(elm));
        }
    });
    return element_list;
}

/**
 * 対象の天体構造インスタンスを取得する
 * @param {string} name 天体名
 * @return {CelestialElement} 天体構造体
 */
HoroscopeCalculator.prototype.getElement = function (elm) {
    let time2 = new Date(this.target_date.getFullYear(), this.target_date.getMonth(), this.target_date.getDate(), this.target_date.getHours() + 1, this.target_date.getMinutes());
    let kepler = new CalcOrbitKepler(this.target_date, this.time_diff, this.longitude, this.latitude);
    let kepler2 = new CalcOrbitKepler(time2, this.time_diff, this.longitude, this.latitude);
    // let coast_guard_method = new CoastGuardMethod(this.target_date, this.time_diff);
    // let coast_guard_method2 = new CoastGuardMethod(time2, this.time_diff);
    let angle1 = 0;
    let angle2 = 0;

    // 太陽
    if (elm.name === "sun") {
        angle1 = this.getEphemeris($moshier.body.sun, this.target_date);
        angle2 = this.getEphemeris($moshier.body.sun, time2);
    }
    // 月
    else if (elm.name === "moon") {
        angle1 = this.getEphemeris($moshier.body.moon, this.target_date);
        angle2 = this.getEphemeris($moshier.body.moon, time2);
    }
    // 水星
    else if (elm.name === "mercury") {
        angle1 = this.getEphemeris($moshier.body.mercury, this.target_date);
        angle2 = this.getEphemeris($moshier.body.mercury, time2);
    }
    // 金星
    else if (elm.name === "venus") {
        angle1 = this.getEphemeris($moshier.body.venus, this.target_date);
        angle2 = this.getEphemeris($moshier.body.venus, time2);
    }
    // 火星
    else if (elm.name === "mars") {
        angle1 = this.getEphemeris($moshier.body.mars, this.target_date);
        angle2 = this.getEphemeris($moshier.body.mars, time2);
    }
    // 木星
    else if (elm.name === "jupiter") {
        angle1 = this.getEphemeris($moshier.body.jupiter, this.target_date);
        angle2 = this.getEphemeris($moshier.body.jupiter, time2);
    }
    // 土星
    else if (elm.name === "saturn") {
        angle1 = this.getEphemeris($moshier.body.saturn, this.target_date);
        angle2 = this.getEphemeris($moshier.body.saturn, time2);
    }
    // 天王星
    else if (elm.name === "uranus") {
        angle1 = this.getEphemeris($moshier.body.uranus, this.target_date);
        angle2 = this.getEphemeris($moshier.body.uranus, time2);
    }
    // 海王星
    else if (elm.name === "neptune") {
        angle1 = this.getEphemeris($moshier.body.neptune, this.target_date);
        angle2 = this.getEphemeris($moshier.body.neptune, time2);
    }
    // 冥王星
    else if (elm.name === "pluto") {
        angle1 = this.getEphemeris($moshier.body.pluto, this.target_date);
        angle2 = this.getEphemeris($moshier.body.pluto, time2);
    }
    // 龍頭
    else if (elm.name === "dragon_head") {
        angle1 = kepler.getDragonHead();
        angle2 = kepler2.getDragonHead();
    }
    // 小惑星
    else {
        angle1 = kepler.getLonAsteroid(elm.name);
        angle2 = kepler2.getLonAsteroid(elm.name);
    }

    if (angle1 > angle2) {
        angle2 += 360
    }

    return new CelestialElement(elm.display_name, angle1, angle2 - angle1 > 180, elm.sign);
}

HoroscopeCalculator.prototype.getEphemeris = function (body, target_date) {
    let ut = CalcAstroBase.getGlobalTime(target_date, this.time_diff);
    var date = { year: ut.getFullYear(), month: ut.getMonth() + 1, day: ut.getDate(), hours: ut.getHours(), minutes: ut.getMinutes(), seconds: 0 };

    $const.tlong = -1 * this.longitude; // longitude
    $const.glat = this.longitude; // latitude

    $processor.init();

    $processor.calc(date, body);

    return body.position.apparentLongitude;
}

/**
 * 天体構造体
 * @param {string} name 名称 
 * @param {number} angle 黄経[deg]
 * @param {boolean} retrograde_flag 逆行フラグ　true:逆行 false:順行
 * @param {string} symbol 天体シンボル
 */
let CelestialElement = function (name, angle, retrograde_flag, display_name, symbol) {
    if (name === undefined || name === null || angle === undefined || angle === null || retrograde_flag === undefined || retrograde_flag === null) {
        throw "Celettialelement コンストラクタ 引数が足りない";
    }
    this.name = name;
    this.angle = angle;
    this.retrograde_flag = retrograde_flag;
    this.sign = CalcAstroBase.getSign(angle);
    this.sign_angle = CalcAstroBase.deg2time(angle % 30);
    this.display_name = display_name;
}

/**
 * カプスリスト取得
 * @return {array{Casp}} カスプリスト
 */
HoroscopeCalculator.prototype.getCapseList = function () {
    let house_list = [];
    if (this.house_system === "placidus") {
        let placidus = new PlacidusHouse(this.target_date, this.time_diff, this.longitude, this.latitude);
        // 第1カスプ
        house_list = [
            new Casp(1, placidus.getASC()),
            //new Casp( 2, placidus.getCasp2()),
            //new Casp( 3, placidus.getCasp3()),
            new Casp(4, placidus.getMC() + 180),
            //new Casp( 5, placidus.getCasp11() + 180),
            //new Casp( 6, placidus.getCasp12() + 180),
            new Casp(7, placidus.getASC() + 180),
            //new Casp( 8, placidus.getCasp2() + 180),
            //new Casp( 9, placidus.getCasp3() + 180),
            new Casp(10, placidus.getMC()),
            //new Casp(11, placidus.getCasp11()),
            //new Casp(12, placidus.getCasp12())
        ]
    } else if (this.house_system === "soler") {
        let elements = this.getElementList();
        let sun = elements[0];
        for (let i = 1; i <= 12; i++) {
            house_list.push(new Casp(i, (sun.angle + 30 * (i - 1)) % 360));
        }
    } else if (this.house_system === "soler_sign") {
        let elements = this.getElementList();
        let sun = elements[0];
        let base = sun.angle - sun.angle % 30;
        for (let i = 1; i <= 12; i++) {
            house_list.push(new Casp(i, (base + 30 * (i - 1)) % 360));
        }
    }
    return house_list;
}

/**
 * カスプ構造体
 * @param {number} num カスプ番号
 * @param {number} angle 黄経[deg] 
 */
let Casp = function (num, angle) {
    this.num = num;
    while (angle < 0) {
        angle += 360;
    }
    this.angle = angle % 360;
    this.sign = CalcAstroBase.getSign(angle);
    this.sign_angle = CalcAstroBase.deg2time(angle % 30);
}

HoroscopeCalculator.prefecture_list = [
    { "name": "北海道", "latitude": 43.06417, "longitude": 141.34694 },
    { "name": "青森県", "latitude": 40.82444, "longitude": 140.74 },
    { "name": "岩手県", "latitude": 39.70361, "longitude": 141.1525 },
    { "name": "宮城県", "latitude": 38.26889, "longitude": 140.87194 },
    { "name": "秋田県", "latitude": 39.71861, "longitude": 140.1025 },
    { "name": "山形県", "latitude": 38.24056, "longitude": 140.36333 },
    { "name": "福島県", "latitude": 37.75, "longitude": 140.46778 },
    { "name": "茨城県", "latitude": 36.34139, "longitude": 140.44667 },
    { "name": "栃木県", "latitude": 36.56583, "longitude": 139.88361 },
    { "name": "群馬県", "latitude": 36.39111, "longitude": 139.06083 },
    { "name": "埼玉県", "latitude": 35.85694, "longitude": 139.64889 },
    { "name": "千葉県", "latitude": 35.60472, "longitude": 140.12333 },
    { "name": "東京都", "latitude": 35.68944, "longitude": 139.69167 },
    { "name": "神奈川県", "latitude": 35.44778, "longitude": 139.6425 },
    { "name": "新潟県", "latitude": 37.90222, "longitude": 139.02361 },
    { "name": "富山県", "latitude": 36.69528, "longitude": 137.21139 },
    { "name": "石川県", "latitude": 36.59444, "longitude": 136.62556 },
    { "name": "福井県", "latitude": 36.06528, "longitude": 136.22194 },
    { "name": "山梨県", "latitude": 35.66389, "longitude": 138.56833 },
    { "name": "長野県", "latitude": 36.65139, "longitude": 138.18111 },
    { "name": "岐阜県", "latitude": 35.39111, "longitude": 136.72222 },
    { "name": "静岡県", "latitude": 34.97694, "longitude": 138.38306 },
    { "name": "愛知県", "latitude": 35.18028, "longitude": 136.90667 },
    { "name": "三重県", "latitude": 34.73028, "longitude": 136.50861 },
    { "name": "滋賀県", "latitude": 35.00444, "longitude": 135.86833 },
    { "name": "京都府", "latitude": 35.02139, "longitude": 135.75556 },
    { "name": "大阪府", "latitude": 34.68639, "longitude": 135.52 },
    { "name": "兵庫県", "latitude": 34.69139, "longitude": 135.18306 },
    { "name": "奈良県", "latitude": 34.68528, "longitude": 135.83278 },
    { "name": "和歌山県", "latitude": 34.22611, "longitude": 135.1675 },
    { "name": "鳥取県", "latitude": 35.50361, "longitude": 134.23833 },
    { "name": "島根県", "latitude": 35.47222, "longitude": 133.05056 },
    { "name": "岡山県", "latitude": 34.66167, "longitude": 133.935 },
    { "name": "広島県", "latitude": 34.39639, "longitude": 132.45944 },
    { "name": "山口県", "latitude": 34.18583, "longitude": 131.47139 },
    { "name": "徳島県", "latitude": 34.06583, "longitude": 134.55944 },
    { "name": "香川県", "latitude": 34.34028, "longitude": 134.04333 },
    { "name": "愛媛県", "latitude": 33.84167, "longitude": 132.76611 },
    { "name": "高知県", "latitude": 33.55972, "longitude": 133.53111 },
    { "name": "福岡県", "latitude": 33.60639, "longitude": 130.41806 },
    { "name": "佐賀県", "latitude": 33.24944, "longitude": 130.29889 },
    { "name": "長崎県", "latitude": 32.74472, "longitude": 129.87361 },
    { "name": "熊本県", "latitude": 32.78972, "longitude": 130.74167 },
    { "name": "大分県", "latitude": 33.23806, "longitude": 131.6125 },
    { "name": "宮崎県", "latitude": 31.91111, "longitude": 131.42389 },
    { "name": "鹿児島県", "latitude": 31.56028, "longitude": 130.55806 },
    { "name": "沖縄県", "latitude": 26.2125, "longitude": 127.68111 },
];

/**
 * 都道府県プルダウンを取得する
 * @returns {array{object}} プルダウン
 */
HoroscopeCalculator.getPrefectureOptions = function () {
    let list = HoroscopeCalculator.prefecture_list;
    let select = document.createElement('select');
    select.setAttribute("id", "selected_prefecture");
    select.setAttribute("onChange", "HoroscopeCalculator.changePrefecture(this)");
    let option = document.createElement('option');
    option.value = ""
    option.text = "";
    select.append(option);
    list.forEach(function (elm) {
        let option = document.createElement('option');
        option.value = JSON.stringify(elm);
        option.text = elm.name;
        select.append(option);
    });
    return select;
}

/**
 * セレクトボックス変更イベント
 */
HoroscopeCalculator.changePrefecture = function (obj) {
    let data = JSON.parse(obj.value);
    let lon = document.getElementById("longitude");
    if (lon !== undefined && lon !== null) {
        lon.value = data.longitude;
    }
    let lat = document.getElementById("latitude");
    if (lat !== undefined && lat !== null) {
        lat.value = data.latitude;
    }
}

/**
 * ネイタルチャートのＳＶＧを取得する
 * @returns {element} svg
 */
HoroscopeCalculator.prototype.getNatalChart = function () {
    // viewBOX設定
    const VIEW_BOX_WIDTH = 510;
    const VIEW_BOX_HEIGHT = 510;
    const VIEW_BOX_LEFT = -1 * VIEW_BOX_WIDTH * 0.5;
    const VIEW_BOX_TOP = -1 * VIEW_BOX_HEIGHT * 0.5;
    let svg = document.createElement('svg');

    svg.setAttribute("viewBox", VIEW_BOX_LEFT + "," + VIEW_BOX_TOP + "," + VIEW_BOX_WIDTH + "," + VIEW_BOX_HEIGHT);
}

/**
 * 天体配置表を取得する
 * @returns {element} テーブル
 */
HoroscopeCalculator.prototype.getLayoutTable = function () {
    // 配置情報を取得
    let elements = this.getElementList();
    // 配置情報をもとにテーブルを作成
    let layout_table = document.createElement("table");
    elements.forEach(function (elm) {
        let row = document.createElement("tr");
        let name = document.createElement("th");
        name.innerHTML = elm.name;
        row.append(name);
        let data = document.createElement("td");
        data.innerHTML = elm.sign + " " + elm.sign_angle;
        row.append(data);
        let r = document.createElement("td");
        r.setAttribute("crass", "r");
        r.innerHTML = elm.retrograde_flag ? "R" : "";
        row.append(r);
        layout_table.append(row);
    });

    return layout_table;
}

/**
 * カスプ表を取得する
 * @returns {element} テーブル
 */
HoroscopeCalculator.prototype.getCaspTable = function () {
    // カスプ情報を取得
    let casps = this.getCapseList();
    // カスプ情報をもとにテーブルを作成
    let casp_table = document.createElement("table");
    casps.forEach(function (elm) {
        let row = document.createElement("tr");
        let name = document.createElement("th");
        name.innerHTML = "第" + elm.num + "カスプ";
        row.append(name);
        let data = document.createElement("td");
        data.innerHTML = elm.sign + " " + elm.sign_angle;
        row.append(data);
        casp_table.append(row);
    });
    return casp_table;
}

/**
 * アスペクト表を取得する
 * @returns {element} テーブル
 */
HoroscopeCalculator.prototype.getAspectTable = function () {
    // 配置情報を取得
    let elements = this.getElementList();
    // アスペクトを計算
    let aspect_calculator = new AspectCalculator(this.OrbMajor, this.OrbHard, this.OrbSoft, this.DispMajor, this.DispHard, this.DispSoft);
    aspect_calculator.setTargets(elements);
    let aspects = aspect_calculator.getAspects();

    // 情報をもとにテーブルを作成
    let aspect_table = document.createElement("table");
    aspects.forEach(function (elm) {
        let row = document.createElement("tr");
        elm.value.forEach(function (pair) {
            let cell = document.createElement("td");
            cell.innerHTML = pair.aspect.angle !== null & pair.aspect.angle !== undefined ? pair.aspect.angle.toFixed(0) : "";
            cell.setAttribute("style", "color:" + pair.aspect.stroke);
            row.append(cell);
        });
        let body = document.createElement("th");
        body.innerHTML = elm.key;
        row.append(body);
        aspect_table.append(row);
    });

    return aspect_table;
}

/**
 * ネイタルチャートを取得する
 * @returns {svg} ネイタルチャート
 */
HoroscopeCalculator.prototype.getNatalChart = function () {
    // viewBOX設定
    const VIEW_BOX_WIDTH = 410;
    const VIEW_BOX_HEIGHT = 410;
    const OUTER_CIRCLE_RADIUS = 200;
    const INNER_CIRCLE_RADIUS = 170;
    const VIEW_BOX_LEFT = -1 * VIEW_BOX_WIDTH * 0.5;
    const VIEW_BOX_TOP = -1 * VIEW_BOX_HEIGHT * 0.5;

    // SVG本体
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("viewBox", VIEW_BOX_LEFT + "," + VIEW_BOX_TOP + "," + VIEW_BOX_WIDTH + "," + VIEW_BOX_HEIGHT);

    // サイン
    // カスプ情報を取得
    let casps = this.getCapseList();
    let sign = new GroupBuilder()
        .setId('sign')
        .rotate(casps[0].angle)
        .build();
    svg.append(sign);


    // 内側の円


    let inner_circle2 = new CircleBuilder()
        .set('r', INNER_CIRCLE_RADIUS)
        .setFill("none")
        .build();
    sign.append(inner_circle2);

    let base = (casps[0].angle + 180) % 360;
    var pair = location.search.substring(1).split('&');
    var textList = [];
    var arg = new Object;
    for (var i = 0; pair[i]; i++) {
        var kv = pair[i].split('=');
        arg[kv[0]] = kv[1];
        textList.push(decodeURI(kv[1]));
    }
    if (textList.length === 5) {
        document.getElementsByTagName('h1')[0].innerHTML = textList[4];
    }
    if (textList.length < 4) {
        textList = ["自分（店自体）のため", "キッチン・バックヤード", "お客様のため", "客席側"];
    }
    var i = 0;
    casps.forEach(function (casp) {
        let width = 1;
        let color = "#aaa";
        let line = new RadialLineBuilder(base - casp.angle, INNER_CIRCLE_RADIUS)
            .setStroke(color)
            .setStrokeWidth(width)
            .build();
        svg.append(line);

        var str = textList[i++];
        let txt = new RadialTextBuilder(base - casp.angle, OUTER_CIRCLE_RADIUS * 0.95, str)
            .set('font-size', '12')
            .build();
        svg.append(txt);
    });



    // アスペクト
    let elements = this.getElementList();
    let aspect_calculator = new AspectCalculator(this.OrbMajor, this.OrbHard, this.OrbSoft, this.DispMajor, this.DispHard, this.DispSoft);
    aspect_calculator.setTargets(elements);
    let aspects = aspect_calculator.getAspects();

    // 表示用の角度を算出
    this.calcDisplayAngle(elements);

    // 天体
    elements.forEach(function (elm) {
        let txt = new RadialTextBuilder(base - elm.angle_end, INNER_CIRCLE_RADIUS * 0.9 - 14, elm.display_name)
            .set('font-size', 20)
            .build();
        svg.append(txt);


        let line = new RadialLineBuilder(
            base - elm.angle,
            INNER_CIRCLE_RADIUS,
            INNER_CIRCLE_RADIUS * 0.9,
            base - elm.angle_end)
            .setStrokeWidth(0.5)
            .build();
        svg.append(line);
    });

    return svg;
}

/**
 * ホロスコープ表示用の角度を計算する
 */
HoroscopeCalculator.prototype.calcDisplayAngle = function (elements) {
    // グループにまとめる
    let group_list = [];
    for (let i = 0; i < elements.length; i++) {
        var elm = elements[i];
        var grouped = false;
        for (let j = 0; j < group_list.length; j++) {
            var group = group_list[j];
            for (let k = 0; k < group.length; k++) {
                var target = group[k];
                if (CalcAstroBase.getAngleBetween(elm.angle, target.angle) < BODY_SPACE_DEG) {
                    group.push(elm);
                    grouped = true;
                    break;
                }
            }
        }

        // グループ化されなかったらグループを追加
        if (!grouped) {
            group_list.push([elm]);
        }
    }

    // グループ毎に処理
    group_list.forEach(function (group) {
        let x = 0;
        let y = 0;

        group.forEach(function (elm) {
            var rad = elm.angle * Math.PI / 180;
            x += Math.cos(rad);
            y += Math.sin(rad);
        });

        let center = Math.atan2(y, x) * 180 / Math.PI;
        if (center < 0) {
            center += 360;
        }

        group.sort(function (a, b) {
            var angle1 = CalcAstroBase.getAngleBetween(a.angle, center - 90);
            var angle2 = CalcAstroBase.getAngleBetween(b.angle, center - 90);

            return angle1 - angle2;
        });

        for (let i = 0; i < group.length; i++) {
            group[i].angle_end = center + (- (group.length - 1) / 2 + i) * BODY_SPACE_DEG;
        }
    });

    for (var i = 0; i < 2; i++) {
        this.calcDisplayAngle2(elements);
    }
}

/**
 * ホロスコープ表示用の角度を計算する
 */
HoroscopeCalculator.prototype.calcDisplayAngle2 = function (elements) {
    // グループにまとめる
    let group_list = [];
    for (let i = 0; i < elements.length; i++) {
        var elm = elements[i];
        var grouped = false;
        for (let j = 0; j < group_list.length; j++) {
            var group = group_list[j];
            for (let k = 0; k < group.length; k++) {
                var target = group[k];
                if (CalcAstroBase.getAngleBetween(elm.angle_end, target.angle_end) < BODY_SPACE_DEG) {
                    group.push(elm);
                    grouped = true;
                    break;
                }
            }
        }

        // グループ化されなかったらグループを追加
        if (!grouped) {
            group_list.push([elm]);
        }
    }

    // グループ毎に処理
    group_list.forEach(function (group) {
        let x = 0;
        let y = 0;

        group.forEach(function (elm) {
            var rad = elm.angle_end * Math.PI / 180;
            x += Math.cos(rad);
            y += Math.sin(rad);
        });

        let center = Math.atan2(y, x) * 180 / Math.PI;
        if (center < 0) {
            center += 360;
        }

        group.sort(function (a, b) {
            var angle1 = CalcAstroBase.getAngleBetween(a.angle, center - 90);
            var angle2 = CalcAstroBase.getAngleBetween(b.angle, center - 90);

            return angle1 - angle2;
        });

        for (let i = 0; i < group.length; i++) {
            group[i].angle_end = center + (- (group.length - 1) / 2 + i) * BODY_SPACE_DEG;
        }
    });
}

/**
 * ホロスコープ的イベントの予報を取得する
 * @returns {array(string)} 予報のリスト
 */
HoroscopeCalculator.prototype.getForecast = function () {
    let target_date = this.target_date;
    let count = 24 * 30; // 30日分を1時間ごと
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    this.target_date = today;

    let prevList = this.getElementList();
    let resultList = [];
    let day;
    let list;
    let obj;
    let prev;
    let sign;
    let prevSign;
    let event;

    for (let i = 1; i < count; i++) {
        // 日付をずらす
        day = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i);
        this.target_date = day;
        list = this.getElementList();

        for (let j = 0; j < list.length; j++) {
            obj = list[j];
            // if(obj.name === "月"){
            //     continue;
            // }
            prev = prevList[j];
            sign = CalcAstroBase.getSign(obj.angle);
            prevSign = CalcAstroBase.getSign(prev.angle);
            if (sign !== prevSign) {
                event = day.getFullYear() + "/" + ("0" + (day.getMonth() + 1)).slice(-2) + "/" + ("0" + day.getDate()).slice(-2) + " " + ("0" + day.getHours()).slice(-2) + "時頃 ";
                event += obj.name + " が " + sign + "入り"
                resultList.push(event);
            }

            if (obj.retrograde_flag !== prev.retrograde_flag) {
                event = day.getFullYear() + "/" + ("0" + (day.getMonth() + 1)).slice(-2) + "/" + ("0" + day.getDate()).slice(-2) + " " + ("0" + day.getHours()).slice(-2) + "時頃 ";
                event += obj.name + " が逆行 " + (obj.retrograde_flag ? "開始" : "終了");
                resultList.push(event);
            }
        }
        prevList = list;
    }

    this.target_date = target_date;

    return resultList;
}