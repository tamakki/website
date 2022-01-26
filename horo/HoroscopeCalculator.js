/**
 * @author tamaki.nakamura
 * @version 1.0.0
 * @since 2019/11/01
 */

 // 依存関係のあるファイルを読み込む
 // 天体計算ベースクラス
 let ver = "20220126";
 let base = document.createElement('script');
 base.src = "CalcAstroBase.js?ver=" + ver;
 document.head.appendChild(base);
// 天文暦ライブラリ
let ephemeris = document.createElement('script');
ephemeris.src="ephemeris-0.1.0.min.js?ver=" + ver;
document.head.appendChild(ephemeris);
//// ハウスシステム
// プラシーダス
let house_calcurator = document.createElement('script');
house_calcurator.src = "HouseCalcurator.js?ver=" + ver;
document.head.appendChild(house_calcurator);
// アスペクト計算クラス
 let aspect_js = document.createElement('script');
 aspect_js.src = "AspectCalculator.js?ver=" + ver;
 document.head.appendChild(aspect_js);
 //// チャート
 // SVGビルダ
 let svg_builder = document.createElement('script');
 svg_builder.src="SvgBuilder.js?ver=" + ver;
 document.head.appendChild(svg_builder);

 // 1天体の締める角度[deg]
 let BODY_SPACE_DEG = 7;

/**
 * ホロスコープ計算クラス
 * @param {date} target_date 指定日時
 * @param {number} time_diff グリニッジ標準時からの時差[hour]
 * @param {number} longitude 東経[deg]
 * @param {number} latitude 北緯[deg]
 * @constructor
 */
let HoroscopeCalculator = function(target_date, time_diff, longitude, latitude){
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
    // ASC
    this.ASC = null;
    // MC
    this.MC = null;
    // オーブ
    this.OrbMajor = null;
    this.OrbHard = null;
    this.OrbSoft = null;
    // アスペクトの表示
    this.DispMajor = true;
    this.DispHard = true;
    this.DispSoft = true;
    this.DispTight = true;
    this.DispLoose = true;
}

/**
 * デフォルト表示設定
 * @constant
 */
HoroscopeCalculator.DEFAULT_DESPLAY_SETTING = [
    {"name": "sun", "display": true, "display_name": "太陽", "sign": "☉"},          // 太陽
    {"name": "moon", "display": true, "display_name": "月", "sign": "☽"},           // 月
    {"name": "mercury", "display": true, "display_name": "水星", "sign": "☿"},      // 水星
    {"name": "venus", "display": true, "display_name": "金星", "sign": "♀"},        // 金星
    {"name": "mars", "display": true, "display_name": "火星", "sign": "♂"},         // 火星
    {"name": "jupiter", "display": true, "display_name": "木星", "sign": "♃"},      // 木星
    {"name": "saturn", "display": true, "display_name": "土星", "sign": "♄"},       // 土星
    {"name": "uranus", "display": true, "display_name": "天王星", "sign": "♅"},     // 天王星
    {"name": "neptune", "display": true, "display_name": "海王星", "sign": "♆"},    // 海王星
    {"name": "pluto", "display": true, "display_name": "冥王星", "sign": "♇"},       // 冥王星
    /** 月の起動 */
    {"name": "dragon_head", "display": false, "display_name": "龍頭", "sign": "☊"},       // ドラゴンヘッド
    /** 小惑星 */
    {"name": "95P", "display": false, "display_name": "chiron", "sign": "chiron"},       // テレプシコーレ
    {"name": "81", "display": false, "display_name": "Terpsichore", "sign": "terepsicore"},       // テレプシコーレ
];

/**
 * ハウスシステム選択肢
 * @constant
 */
HoroscopeCalculator.HOUSE_SYSTEMS = [
    "placidus",
    "koch",
    // "equal",
    "campanus",
    "regiomontanus",
    "soler",
    "soler_sign"
];

/**
 * 表示対象の天体の天体構造体リストを取得する
 * @returns {array{CelestialElement}} 天体構造体リスト
 */
HoroscopeCalculator.prototype.getElementList = function() {
    let element_list = [];
    let obj = this;
    this.display_setting.forEach(function(elm) {
        if(elm.display){
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
HoroscopeCalculator.prototype.getElement = function(elm) {
    let time2 = new Date(this.target_date.getFullYear(), this.target_date.getMonth(), this.target_date.getDate(), this.target_date.getHours() + 1, this.target_date.getMinutes());

    let angle1 = 0;
    let angle2 = 0;

    // 太陽
    if(elm.name === "sun") {
        angle1 = this.getEphemeris($moshier.body.sun, this.target_date);
        angle2 = this.getEphemeris($moshier.body.sun, time2);
    }
    // 月
    else if(elm.name === "moon") {
        angle1 = this.getEphemeris($moshier.body.moon, this.target_date);
        angle2 = this.getEphemeris($moshier.body.moon, time2);
    }
    // 水星
    else if(elm.name === "mercury") {
        angle1 = this.getEphemeris($moshier.body.mercury, this.target_date);
        angle2 = this.getEphemeris($moshier.body.mercury, time2);
    }
    // 金星
    else if(elm.name === "venus") {
        angle1 = this.getEphemeris($moshier.body.venus, this.target_date);
        angle2 = this.getEphemeris($moshier.body.venus, time2);
    }
    // 火星
    else if(elm.name === "mars") {
        angle1 = this.getEphemeris($moshier.body.mars, this.target_date);
        angle2 = this.getEphemeris($moshier.body.mars, time2);
    }
    // 木星
    else if(elm.name === "jupiter") {
        angle1 = this.getEphemeris($moshier.body.jupiter, this.target_date);
        angle2 = this.getEphemeris($moshier.body.jupiter, time2);
    }
    // 土星
    else if(elm.name === "saturn") {
        angle1 = this.getEphemeris($moshier.body.saturn, this.target_date);
        angle2 = this.getEphemeris($moshier.body.saturn, time2);
    }
    // 天王星
    else if(elm.name === "uranus"){
        angle1 = this.getEphemeris($moshier.body.uranus, this.target_date);
        angle2 = this.getEphemeris($moshier.body.uranus, time2);
    }
    // 海王星
    else if(elm.name === "neptune"){
        angle1 = this.getEphemeris($moshier.body.neptune, this.target_date);
        angle2 = this.getEphemeris($moshier.body.neptune, time2);
    }
    // 冥王星
    else if(elm.name === "pluto"){
        angle1 = this.getEphemeris($moshier.body.pluto, this.target_date);
        angle2 = this.getEphemeris($moshier.body.pluto, time2);
    }
    // 龍頭
    else if(elm.name === "dragon_head") {
        angle1 = kepler.getDragonHead();
        angle2 = kepler2.getDragonHead();
    }
    // 小惑星
    else {
        angle1 = kepler.getLonAsteroid(elm.name);
        angle2 = kepler2.getLonAsteroid(elm.name);
    }

    if(angle1 > angle2){
        angle2 += 360
    }

    return new CelestialElement(elm.display_name, angle1, angle2 - angle1 > 180, elm.sign, './svg/' + elm.name + '.svg?ver=1.0.0');
}

HoroscopeCalculator.prototype.getEphemeris = function(body, target_date) {
    let ut = CalcAstroBase.getGlobalTime(target_date, this.time_diff);
    var date = {year: ut.getFullYear(), month: ut.getMonth() + 1, day: ut.getDate(), hours: ut.getHours(), minutes: ut.getMinutes(), seconds: 0};
            
    $const.tlong = -1 * this.longitude; // longitude
    $const.glat = this.longitude; // latitude
    
    $processor.init ();
    
    $processor.calc (date, body);

    return body.position.apparentLongitude;
}

/**
 * 天体構造体
 * @param {string} name 名称 
 * @param {number} angle 黄経[deg]
 * @param {boolean} retrograde_flag 逆行フラグ　true:逆行 false:順行
 * @param {string} symbol 天体シンボル
 */
let CelestialElement = function(name, angle, retrograde_flag, display_name, symbol) {
    if(name === undefined || name === null || angle === undefined || angle === null || retrograde_flag === undefined || retrograde_flag === null){
        throw "Celettialelement コンストラクタ 引数が足りない";
    }
    this.name = name;
    this.angle = angle;
    this.retrograde_flag = retrograde_flag;
    this.sign = CalcAstroBase.getSign(angle);
    this.sign_angle = CalcAstroBase.deg2time(angle % 30);
    this.display_name = display_name;
    this.symbol = symbol;
}

/**
 * カプスリスト取得
 * @return {array{Casp}} カスプリスト
 */
HoroscopeCalculator.prototype.getCapseList = function() {
    let house_list = [];
    let calcurator = new HouseCalcurator(this.target_date, this.longitude, this.latitude);
    this.ASC = calcurator.ASC;
    this.MC = calcurator.MC;
    if(this.house_system === "placidus"){
        return calcurator.getPlacidus();
    } else if(this.house_system === "soler"){
        let elements = this.getElementList();
        let sun = elements[0];
        let caspdata = {};
        let casps = [];
        for(let i = 1; i <= 12; i++){
            casps.push({angle:sun.angle + 30 * (i - 1) % 360});
        }
        caspdata.casps = casps;
        return caspdata;
    } else if(this.house_system === "soler_sign"){
        let elements = this.getElementList();
        let sun = elements[0];
        let base = sun.angle - sun.angle % 30;
        let caspdata = {};
        let casps = [];
        for(let i = 1; i <= 12; i++){
            casps.push({angle: base + 30 * (i - 1) % 360});
        }
        caspdata.casps = casps;
        return caspdata;
    } else if(this.house_system === "campanus") {
        return calcurator.getCampanus();
    } else if(this.house_system === "regiomontanus") {
        return calcurator.getRegiomontanus();
    } else if(this.house_system === "koch") {
        return calcurator.getKoch();
    }
    return house_list;
}

HoroscopeCalculator.prefecture_list = [
    {"name":"北海道","latitude":43.06417,"longitude":141.34694},
    {"name":"青森県","latitude":40.82444,"longitude":140.74},
    {"name":"岩手県","latitude":39.70361,"longitude":141.1525},
    {"name":"宮城県","latitude":38.26889,"longitude":140.87194},
    {"name":"秋田県","latitude":39.71861,"longitude":140.1025},
    {"name":"山形県","latitude":38.24056,"longitude":140.36333},
    {"name":"福島県","latitude":37.75,"longitude":140.46778},
    {"name":"茨城県","latitude":36.34139,"longitude":140.44667},
    {"name":"栃木県","latitude":36.56583,"longitude":139.88361},
    {"name":"群馬県","latitude":36.39111,"longitude":139.06083},
    {"name":"埼玉県","latitude":35.85694,"longitude":139.64889},
    {"name":"千葉県","latitude":35.60472,"longitude":140.12333},
    {"name":"東京都","latitude":35.68944,"longitude":139.69167},
    {"name":"神奈川県","latitude":35.44778,"longitude":139.6425},
    {"name":"新潟県","latitude":37.90222,"longitude":139.02361},
    {"name":"富山県","latitude":36.69528,"longitude":137.21139},
    {"name":"石川県","latitude":36.59444,"longitude":136.62556},
    {"name":"福井県","latitude":36.06528,"longitude":136.22194},
    {"name":"山梨県","latitude":35.66389,"longitude":138.56833},
    {"name":"長野県","latitude":36.65139,"longitude":138.18111},
    {"name":"岐阜県","latitude":35.39111,"longitude":136.72222},
    {"name":"静岡県","latitude":34.97694,"longitude":138.38306},
    {"name":"愛知県","latitude":35.18028,"longitude":136.90667},
    {"name":"三重県","latitude":34.73028,"longitude":136.50861},
    {"name":"滋賀県","latitude":35.00444,"longitude":135.86833},
    {"name":"京都府","latitude":35.02139,"longitude":135.75556},
    {"name":"大阪府","latitude":34.68639,"longitude":135.52},
    {"name":"兵庫県","latitude":34.69139,"longitude":135.18306},
    {"name":"奈良県","latitude":34.68528,"longitude":135.83278},
    {"name":"和歌山県","latitude":34.22611,"longitude":135.1675},
    {"name":"鳥取県","latitude":35.50361,"longitude":134.23833},
    {"name":"島根県","latitude":35.47222,"longitude":133.05056},
    {"name":"岡山県","latitude":34.66167,"longitude":133.935},
    {"name":"広島県","latitude":34.39639,"longitude":132.45944},
    {"name":"山口県","latitude":34.18583,"longitude":131.47139},
    {"name":"徳島県","latitude":34.06583,"longitude":134.55944},
    {"name":"香川県","latitude":34.34028,"longitude":134.04333},
    {"name":"愛媛県","latitude":33.84167,"longitude":132.76611},
    {"name":"高知県","latitude":33.55972,"longitude":133.53111},
    {"name":"福岡県","latitude":33.60639,"longitude":130.41806},
    {"name":"佐賀県","latitude":33.24944,"longitude":130.29889},
    {"name":"長崎県","latitude":32.74472,"longitude":129.87361},
    {"name":"熊本県","latitude":32.78972,"longitude":130.74167},
    {"name":"大分県","latitude":33.23806,"longitude":131.6125},
    {"name":"宮崎県","latitude":31.91111,"longitude":131.42389},
    {"name":"鹿児島県","latitude":31.56028,"longitude":130.55806},
    {"name":"沖縄県","latitude":26.2125,"longitude":127.68111},
];

/**
 * 都道府県プルダウンを取得する
 * @returns {array{object}} プルダウン
 */
HoroscopeCalculator.getPrefectureOptions = function() {
    let list = HoroscopeCalculator.prefecture_list;
    let select = document.createElement('select');
    select.setAttribute("id", "selected_prefecture");
    select.setAttribute("onChange", "HoroscopeCalculator.changePrefecture(this)");
    let option = document.createElement('option');
    option.value = ""
    option.text = "";
    select.append(option);
    list.forEach(function(elm){
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
HoroscopeCalculator.changePrefecture = function(obj){
    let data = JSON.parse(obj.value);
    let lon = document.getElementById("longitude");
    if(lon !== undefined && lon !== null){
        lon.value = data.longitude;
    }
    let lat = document.getElementById("latitude");
    if(lat !== undefined && lat !== null){
        lat.value = data.latitude;
    }
}

/**
 * 天体配置表を取得する
 * @returns {element} テーブル
 */
HoroscopeCalculator.prototype.getLayoutTable = function(){
    // 配置情報を取得
    let elements = this.getElementList();
    // 配置情報をもとにテーブルを作成
    let layout_table = document.createElement("table");
    elements.forEach(function(elm){
        let row = document.createElement("tr");
        let name = document.createElement("th");
        name.innerHTML = elm.name;
        row.append(name);
        let data = document.createElement("td");
        data.innerHTML = elm.sign + " " + elm.sign_angle;
        row.append(data);
        let r = document.createElement("td");
        r.setAttribute("crass", "r");
        r.innerHTML = elm.retrograde_flag? "R": "";
        row.append(r);
        layout_table.append(row);
    });

    return layout_table;
}

/**
 * カスプ表を取得する
 * @returns {element} テーブル
 */
HoroscopeCalculator.prototype.getCaspTable = function(){
    // カスプ情報を取得
    let caspdata = this.getCapseList();
    // カスプ情報をもとにテーブルを作成
    let casp_table = document.createElement("table");
    let i = 1;
    caspdata.casps.forEach(function(elm){
        let row = document.createElement("tr");
        let name = document.createElement("th");
        name.innerHTML = "第" + i++ + "カスプ";
        row.append(name);
        let data = document.createElement("td");
        data.innerHTML = CalcAstroBase.getSign(elm.angle) + " " + CalcAstroBase.deg2time(elm.angle % 30);
        row.append(data);
        casp_table.append(row);
    });
    return casp_table;
}

/**
 * アスペクト表を取得する
 * @returns {element} テーブル
 */
HoroscopeCalculator.prototype.getAspectTable = function(){
    // 配置情報を取得
    let elements = this.getElementList();
    // アスペクトを計算
    let aspect_calculator = new AspectCalculator(this.OrbMajor,this.OrbHard,this.OrbSoft,this.DispMajor,this.DispHard,this.DispSoft,this.DispTight,this.DispLoose);
    aspect_calculator.setTargets(elements);
    let aspects = aspect_calculator.getAspects();

    // 情報をもとにテーブルを作成
    let aspect_table = document.createElement("table");
    aspects.forEach(function(elm){
        let row = document.createElement("tr");
        elm.value.forEach(function(pair){
            let cell = document.createElement("td");
            cell.innerHTML = (pair.aspect.angle !== null & pair.aspect.angle !== undefined? pair.aspect.angle.toFixed(0) : "") + (pair.aspect.diff !== undefined? '<br>(' + pair.aspect.diff + ')': '');
            cell.setAttribute("style","color:" + pair.aspect.stroke);
            if(pair.aspect.tight) {
                cell.classList.add('bold');
            }
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
HoroscopeCalculator.prototype.getNatalChart = function(){
    // viewBOX設定
    const VIEW_BOX_WIDTH = 410;
    const VIEW_BOX_HEIGHT = 410;
    const OUTER_CIRCLE_RADIUS = 200;
    const INNER_CIRCLE_RADIUS = 170;
    const VIEW_BOX_LEFT = -1 * VIEW_BOX_WIDTH * 0.5;
    const VIEW_BOX_TOP = -1 * VIEW_BOX_HEIGHT * 0.5;

    // SVG本体
    let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute("viewBox", VIEW_BOX_LEFT + "," + VIEW_BOX_TOP + "," + VIEW_BOX_WIDTH + "," + VIEW_BOX_HEIGHT);
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // サイン
    // カスプ情報を取得
    let caspdata = this.getCapseList();
    let base = (caspdata.casps[0].angle + 180) % 360;
    let ASC;
    let MC;
    if(this.house_system === "campanus") {
        base = (caspdata.ASC.angle + 180) % 360;
        ASC = caspdata.ASC.angle;
        MC = caspdata.MC.angle;
    }
    let sign = new GroupBuilder()
    .setId('sign')
    .rotate(base - 180)
    .build();
    svg.append(sign);

    for(let i = 0; i < 12; i++){
        let x = 0;
        let y = 0;
        let r = (OUTER_CIRCLE_RADIUS + INNER_CIRCLE_RADIUS) / 2;
        let start = 180 - 360 / 12 * (i + 1);
        let end = 180 - 360 / 12 * i;
        let arc = new ArcBuilder(x,y,r,start,end).setStroke(CalcAstroBase.sign_symbol_colors[i]).setStrokeWidth(OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS).build();
        sign.append(arc);
    
    }

    // 外側の円
    let outer_circle = new CircleBuilder()
    .set('r', OUTER_CIRCLE_RADIUS)
    .setFill("none")
    .build();
    sign.append(outer_circle);

    // 内側の円
    let inner_circle1 = new CircleBuilder()
    .set('r', INNER_CIRCLE_RADIUS - 7)
    .setFill("none")
    .build();
    sign.append(inner_circle1);

    let inner_circle2 = new CircleBuilder()
    .set('r', INNER_CIRCLE_RADIUS)
    .setFill("none")
    .build();
    sign.append(inner_circle2);

    // 目盛

    for(let i = 0; i < 360; i++){
        let start = INNER_CIRCLE_RADIUS - 7;
        let end = start + (i % 30 === 0 ? (OUTER_CIRCLE_RADIUS - start): (i % 10 === 0 ? 7: (i % 5 === 0? 7/2: 7/4)));
        let line = new RadialLineBuilder(i, start, end).setStrokeWidth(0.5).build();
        sign.append(line);
    }
    
    for(let i = 0; i < 12; i++){
        let image = new RadialImageBuilder(
            CalcAstroBase.svg_sign_symbol[i], 
            180 - 360 / 12 * i - 15, 
            (OUTER_CIRCLE_RADIUS + INNER_CIRCLE_RADIUS)/2, 
            OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS, 
            (OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS) * 0.7)
        .build();
        sign.append(image);
    }

    // カスプ
    if(this.house_system === "campanus") {
        let color = "#aaa";
        let width = 0.5
        let line = new RadialLineBuilder(base - ASC, INNER_CIRCLE_RADIUS -7, INNER_CIRCLE_RADIUS * 0.7)
        .setStroke(color)
        .setStrokeWidth(width)
        .set('stroke-dasharray', '4 4')
        .build();
        svg.append(line);
        line = new RadialLineBuilder(base - MC, INNER_CIRCLE_RADIUS -7, INNER_CIRCLE_RADIUS * 0.7)
        .setStroke(color)
        .setStrokeWidth(width)
        .set('stroke-dasharray', '4 4')
        .build();
        svg.append(line);
    }
    let house = this.house_system;
    caspdata.casps.forEach(function(casp){
        let width = 0.5
        let color = "#aaa";
        if(house === 'placidus' || house === 'regiomontanus' || house === 'koch'){
            if(casp === casps[0] || casp === casps[3] || casp === casps[6] || casp === casps[9]){
                width = 1.0;
            }
        }
        let line = new RadialLineBuilder(base - casp.angle, INNER_CIRCLE_RADIUS - 7)
        .setStroke(color)
        .setStrokeWidth(width)
        .build();
        svg.append(line);
    });

    for(let i = 0; i < caspdata.casps.length; i++){
        let deg1 = caspdata.casps[0].angle;
        if(i + 1 < caspdata.casps.length){
            deg1 = caspdata.casps[i + 1].angle;
        }
        let deg2 = caspdata.casps[i].angle;
        if(deg1 < deg2) {
            deg1 += 360;
        }
        let deg = base - (caspdata.casps[i].angle + (deg1 - deg2) * 0.5);
        let text = new RadialTextBuilder(deg, INNER_CIRCLE_RADIUS * 0.3, i+1)
        .set('class','symbol')
        .setStroke("#aaa")
        .setFill("#aaa")
        .build();
        svg.append(text);
    }

    // アスペクトの円
    let aspect_circle = new CircleBuilder()
    .set('r', INNER_CIRCLE_RADIUS * 0.75)
    .setFill("none")
    .setStroke("#aaa")
    .build();
    sign.append(aspect_circle);

    // アスペクト
    let elements = this.getElementList();
    let aspect_calculator = new AspectCalculator(this.OrbMajor,this.OrbHard,this.OrbSoft,this.DispMajor,this.DispHard,this.DispSoft);
    aspect_calculator.setTargets(elements);
    let aspects = aspect_calculator.getAspects();
    aspects.forEach(function(elm){
        elm.value.forEach(function(data){
            if(data.aspect.display){
                let aspect_line = new AspectLineBuilder(INNER_CIRCLE_RADIUS * 0.75, base - data.node1.angle, base - data.node2.angle)
                .setStroke(data.aspect.stroke)
                .set("stroke-dasharray", data.aspect["stroke-dasharray"])
                .build();
                svg.append(aspect_line);
            }
        });
    });
    
    // 表示用の角度を算出
    this.calcDisplayAngle(elements);

    // 天体
    elements.forEach(function(elm) {
        let src = elm.symbol;
        let image = new RadialImageBuilder(
            src, 
            base - elm.angle_end , 
            INNER_CIRCLE_RADIUS  * 0.9 - 8, 
            15, 
            15)
        .build()
        svg.append(image);

        let line = new RadialLineBuilder(
            base - elm.angle, 
            INNER_CIRCLE_RADIUS - 7, 
            (INNER_CIRCLE_RADIUS - 7) * 0.97, 
            base - elm.angle_end)
        .setStrokeWidth(0.5)
        .build();
        svg.append(line);


        let line2 = new RadialLineBuilder(
            base - elm.angle, 
            INNER_CIRCLE_RADIUS * 0.75, 
            INNER_CIRCLE_RADIUS * 0.75 + 5, 
            base - elm.angle_end)
        .setStrokeWidth(0.5)
        .build();
        svg.append(line2);
    });

    return svg;
}

/**
 * ホロスコープ表示用の角度を計算する
 */
HoroscopeCalculator.prototype.calcDisplayAngle = function(elements){
    // グループにまとめる
    let group_list = [];
    for(let i = 0; i < elements.length; i++){
        var elm = elements[i];
        var grouped = false;
        for(let j = 0; j < group_list.length; j++){
            var group = group_list[j];
            for(let k = 0; k < group.length; k++){
                var target = group[k];
                if(CalcAstroBase.getAngleBetween(elm.angle, target.angle) < BODY_SPACE_DEG){
                    group.push(elm);
                    grouped = true;
                    break;
                }
            }
        }

        // グループ化されなかったらグループを追加
        if(!grouped){
            group_list.push([elm]);
        }
    }

    // グループ毎に処理
    group_list.forEach(function(group){
        let x = 0;
        let y = 0;

        group.forEach(function(elm){
            var rad = elm.angle * Math.PI / 180;
            x += Math.cos(rad);
            y += Math.sin(rad);
        });

        let center = Math.atan2(y, x) * 180 / Math.PI;
        if(center < 0){
            center += 360;
        }

        group.sort(function(a, b){
            var angle1 = CalcAstroBase.getAngleBetween(a.angle, center - 90);
            var angle2 = CalcAstroBase.getAngleBetween(b.angle, center - 90);

            return angle1 - angle2;
        });

        for(let i = 0; i < group.length; i++){
            group[i].angle_end = center + (- (group.length - 1)/2 + i) * BODY_SPACE_DEG;
        }
    });

    for(var i = 0; i < 2; i++){
        this.calcDisplayAngle2(elements);
    }
}

/**
 * ホロスコープ表示用の角度を計算する
 */
HoroscopeCalculator.prototype.calcDisplayAngle2 = function(elements){
    // グループにまとめる
    let group_list = [];
    for(let i = 0; i < elements.length; i++){
        var elm = elements[i];
        var grouped = false;
        for(let j = 0; j < group_list.length; j++){
            var group = group_list[j];
            for(let k = 0; k < group.length; k++){
                var target = group[k];
                if(CalcAstroBase.getAngleBetween(elm.angle_end, target.angle_end) < BODY_SPACE_DEG){
                    group.push(elm);
                    grouped = true;
                    break;
                }
            }
        }

        // グループ化されなかったらグループを追加
        if(!grouped){
            group_list.push([elm]);
        }
    }

    // グループ毎に処理
    group_list.forEach(function(group){
        let x = 0;
        let y = 0;

        group.forEach(function(elm){
            var rad = elm.angle_end * Math.PI / 180;
            x += Math.cos(rad);
            y += Math.sin(rad);
        });

        let center = Math.atan2(y, x) * 180 / Math.PI;
        if(center < 0){
            center += 360;
        }

        group.sort(function(a, b){
            var angle1 = CalcAstroBase.getAngleBetween(a.angle, center - 90);
            var angle2 = CalcAstroBase.getAngleBetween(b.angle, center - 90);

             return angle1 - angle2;
        });

        for(let i = 0; i < group.length; i++){
            group[i].angle_end = center + (- (group.length - 1)/2 + i) * BODY_SPACE_DEG;
        }
    });
}

/**
 * ホロスコープ的イベントの予報を取得する
 * @returns {array(string)} 予報のリスト
 */
HoroscopeCalculator.prototype.getForecast = function() {
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

    for(let i = 1; i < count; i++){
        // 日付をずらす
        day = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i);
        this.target_date = day;
        list = this.getElementList();

        for(let j = 0; j < list.length; j++){
            obj = list[j];
            // if(obj.name === "月"){
            //     continue;
            // }
            prev = prevList[j];
            sign = CalcAstroBase.getSign(obj.angle);
            prevSign = CalcAstroBase.getSign(prev.angle);
            if(sign !== prevSign){
                event = day.getFullYear() + "/" + ("0" + (day.getMonth() + 1)).slice(-2) + "/" + ("0" + day.getDate()).slice(-2) + " " + ("0" + day.getHours()).slice(-2) + "時頃 ";
                event += obj.name + " が " + sign + "入り"
                resultList.push(event);
            }

            if(obj.retrograde_flag !== prev.retrograde_flag){
                event = day.getFullYear() + "/" + ("0" + (day.getMonth() + 1)).slice(-2) + "/" + ("0" + day.getDate()).slice(-2) + " " + ("0" + day.getHours()).slice(-2) + "時頃 ";
                event += obj.name + " が逆行 " + (obj.retrograde_flag? "開始":"終了");
                resultList.push(event);
            }
        }
        prevList = list;
    }

    this.target_date = target_date;

    return resultList;
}