var aspects;
var magnify = 1.6;
const settingVersion = 3;
let setting = new Setting(JSON.stringify(SettingUtil.default_setting));

// 初期設定
$(function () {
    initBodySetting();
    displayHouseValue();
    $.datepicker.setDefaults($.datepicker.regional["ja"]);
    $('#birth-date').datepicker({
        changeYear: true, //年を表示
        changeMonth: true, //月を選択
        yearRange: '-100:+100',
        changeDate: changeSetting
    }).on('change', changeSetting);

    // 誕生時間の選択肢
    for (let i = 0; i < 24; i++) {
        let option = $('<option>');
        option.val(i);
        option.text(('0' + i).slice(-2));
        $('#birth-hour').append(option);
    }
    for (let i = 0; i < 60; i++) {
        let option = $('<option>');
        option.val(i);
        option.text(('0' + i).slice(-2));
        $('#birth-min').append(option);
    }
    for (let i = 12; i > -12; i--) {
        let option = $('<option>');
        option.val(i);
        if (i !== 0) {
            option.text((i > 0 ? '+' : '-') + ('0' + Math.abs(i)).slice(-2) + ':00時間');
        } else {
            option.text('世界標準時');
        }
        $('#time-diff').append(option);
    }
    $('#prefecture').append($('<option>'));
    for (let i = 0; i < prefecture_list.length; i++) {
        const elm = prefecture_list[i];
        const option = $('<option>');
        option.val(JSON.stringify(elm));
        option.text(elm.name);
        $('#prefecture').append(option);
    };

    initSetting();

    $('#birth-hour').change(changeSetting);
    $('#birth-min').change(changeSetting);
    $('#longitude-deg').change(changeSetting);
    $('#longitude-min').change(changeSetting);
    $('#latitude-deg').change(changeSetting);
    $('#latitude-min').change(changeSetting);
    $('#prefecture').change(function () {
        changePrefecture();
        changeSetting();
    });
    $('#time-diff').change(changeSetting);
    $('#house-system').change(changeSetting);
    $('#major-disp').change(changeSetting);
    $('#major-orb').change(changeSetting);
    $('#hard-disp').change(changeSetting);
    $('#hard-orb').change(changeSetting);
    $('#soft-disp').change(changeSetting);
    $('#soft-orb').change(changeSetting);

    $('#btn_calc').click(function () {
        calc();
    });
    $('#btn_remove_setting').click(function () {
        SettingUtil.removeSetting();
        initSetting();
        $('#horoscope').empty();
        $('#house-list').empty();
        $('#body-table').empty();
        $('#aspect-table').empty();
        localStorage.removeItem('magnify');
        localStorage.removeItem('display-bodydata');
        localStorage.removeItem('display-aspect');
    });
    $('#display-bodydata').change(function () {
        localStorage.setItem('display-bodydata', $('#display-bodydata').prop('checked'));
    });
    $('#display-aspect').change(function () {
        localStorage.setItem('display-aspect', $('#display-aspect').prop('checked'));
    });

    $(document).on('mousemove', '.aspect__cell', onAspectCell);
    $(document).on('mouseout', '.aspect__cell', outAspectCell);

    $('#minus').prop('disabled', magnify < 1.2);
    $('#plus').prop('disabled', magnify > 1.8);
    $('#display-aspect').prop('checked', localStorage.getItem('display-aspect') === 'true');
    if (localStorage.getItem('display-bodydata') === 'detail' || localStorage.getItem('display-bodydata') === 'name' || localStorage.getItem('display-bodydata') === 'none') {
        $('#display-bodydata').val(localStorage.getItem('display-bodydata'));
    }
    calc();
});

/** 初期表示用設定 */
function initSetting() {
    $.each(setting, function (key, value) {
        const elm = $('#' + key);
        if (elm && value !== null) {
            if (key.indexOf('disp') !== -1) {
                elm.prop('checked', value);
            } else {
                elm.val(value);
            }
        }
    });
}

/** 設定変更の保存 */
function changeSetting() {
    setting['birth-date'] = $('#birth-date').val();
    setting['birth-hour'] = $('#birth-hour').val();
    setting['birth-min'] = $('#birth-min').val();
    setting['longitude-deg'] = $('#longitude-deg').val();
    setting['longitude-min'] = $('#longitude-min').val();
    setting['latitude-deg'] = $('#latitude-deg').val();
    setting['latitude-min'] = $('#latitude-min').val();
    setting['prefecture'] = $('#prefecture').val();
    setting['time-diff'] = $('#time-diff').val();
    setting['house-system'] = $('#house-system').val();
    setting['disp-hard'] = $('#disp-hard').prop('checked');
    setting['disp-soft'] = $('#disp-soft').prop('checked');
    setting['disp-tight'] = $('#disp-tight').prop('checked');
    setting['disp-loose'] = $('#disp-loose').prop('checked');
    setting['orb-tight'] = parseFloat($('#orb-tight').val());
    setting['orb-loose'] = parseFloat($('#orb-loose').val());
    SettingUtil.saveSetting(setting);
}

/** 県選択時イベント */
function changePrefecture() {
    const prefecture = JSON.parse($('#prefecture').val());
    const longitude_deg = Math.floor(prefecture.longitude);
    const longitude_min = ('0' + Math.round((prefecture.longitude % 1) / (1 / 60))).slice(-2);
    const latitude_deg = Math.floor(prefecture.latitude);
    const latitude_min = ('0' + Math.round((prefecture.latitude % 1) / (1 / 60))).slice(-2);
    $('#longitude-deg').val(longitude_deg);
    $('#longitude-min').val(longitude_min);
    $('#latitude-deg').val(latitude_deg);
    $('#latitude-min').val(latitude_min);
}

/** 天体計算 */
function calc() {
    setting.bodies = getBodyData();
    draw();
}

function validate(setting) {
    if (setting.getBirthDate().toString() === "Invalid Date") {
        alert('日付の入力形式に誤りがあります。\n 2020/01/01　のように入力してください。');
        return false;
    }

    if (setting['longitude-deg'] > 180 || setting['longitude-deg'] < -179) {
        alert('経度は　-179° ~ 180°　の範囲で入力してください。');
        return false;
    }
    if (setting['longitude-min'] < 0 || setting['longitude-min'] > 59) {
        alert('経度（分）は 0\'~59\'　の範囲で入力してください。');
        return false;
    }
    if (Math.abs(setting['latitude-deg']) > 90) {
        alert('緯度は -90° ～ 90°　の範囲で入力してください。');
        return false;
    }
    if (setting['latitude-min'] < 0 || setting['latitude-min'] > 59) {
        alert('緯度（分）は 0\'~59\'　の範囲で入力してください。');
        return false;
    }

    return true;
}

/** ホロスコープおよび各表を描画する */
function draw() {
    if (setting.bodies) {
        // 描画を削除
        $('#horoscope').empty();

        // アスペクトを取得
        const aspect_calculator = new AspectCalculator();
        const elements = [];
        $.each(setting.bodies, function (key, value) {
            if (value) {
                elements.push({ 'name': value.name, 'angle': value.longitude });
            }
        });
        aspect_calculator.setTargets(elements);
        aspects = aspect_calculator.getAspects();

        // ハウスを取得
        const caspdata = getHouse(setting);
        casps = caspdata;
        setting.casps = casps;

        // viewBOX設定
        const VIEW_BOX_WIDTH = 800;
        const VIEW_BOX_HEIGHT = 800;
        const OUTER_CIRCLE_RADIUS = 390;
        const INNER_CIRCLE_RADIUS = OUTER_CIRCLE_RADIUS - 26 * magnify;
        const VIEW_BOX_LEFT = -1 * VIEW_BOX_WIDTH * 0.5;
        const VIEW_BOX_TOP = -1 * VIEW_BOX_HEIGHT * 0.5;

        // SVG本体
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("viewBox", VIEW_BOX_LEFT + "," + VIEW_BOX_TOP + "," + VIEW_BOX_WIDTH + "," + VIEW_BOX_HEIGHT);
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute('class', 'horoscope');

        // サイン
        // カスプ情報を取得
        let base = (caspdata.casps[0].angle + 180) % 360;
        let ASC;
        let MC;
        if (setting['house-system'] === "campanus") {
            base = (caspdata.ASC.angle + 180) % 360;
            ASC = caspdata.ASC.angle;
            MC = caspdata.MC.angle;
        }
        let sign = new GroupBuilder()
            .setId('sign')
            .build();
        svg.append(sign);

        // サインの色
        for (let i = 0; i < 12; i++) {
            let x = 0;
            let y = 0;
            let r = (OUTER_CIRCLE_RADIUS + INNER_CIRCLE_RADIUS) / 2;
            let start = -360 / 12 * (i + 1) + base;
            let end = -360 / 12 * i + base;
            let arc = new ArcBuilder(x, y, r, start, end).setStroke(CalcAstroBase.sign_symbol_colors[i]).setStrokeWidth(OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS).build();
            sign.append(arc);
        }

        // カスプ
        let house = setting['house-system'];
        caspdata.casps.forEach(function (casp) {
            let width = 1.0
            let color = "#aaa";
            if (house === 'placidus' || house === 'regiomontanus' || house === 'koch') {
                if (casp === caspdata.casps[0] || casp === caspdata.casps[3] || casp === caspdata.casps[6] || casp === caspdata.casps[9]) {
                    width = 2.0;
                }
            }
            let line = new RadialLineBuilder(base - casp.angle, INNER_CIRCLE_RADIUS)
                .setStroke(color)
                .setStrokeWidth(width)
                .build();
            sign.append(line);
        });

        // ASCの矢印
        if (house === 'placidus' || house === 'regiomontanus' || house === 'koch') {
            const deg1 = base - caspdata.casps[9].angle;
            const deg2 = deg1 + 1;
            const deg3 = deg1 - 1;
            const r2 = INNER_CIRCLE_RADIUS - 16;
            const p1 = { x: INNER_CIRCLE_RADIUS * Math.cos(deg1 * Math.PI / 180), y: INNER_CIRCLE_RADIUS * Math.sin(deg1 * Math.PI / 180) };
            const p2 = { x: r2 * Math.cos(deg2 * Math.PI / 180), y: r2 * Math.sin(deg2 * Math.PI / 180) };
            const p3 = { x: r2 * Math.cos(deg3 * Math.PI / 180), y: r2 * Math.sin(deg3 * Math.PI / 180) };
            let polygon = new PolygonBuilder([p1, p2, p3])
                .setFill('#aaa')
                .setStroke('none')
                .build();
            sign.append(polygon);
        }

        // MCの矢印
        if (house === 'placidus' || house === 'regiomontanus' || house === 'koch') {
            const deg1 = 180;
            const deg2 = deg1 + 1;
            const deg3 = deg1 - 1;
            const r2 = INNER_CIRCLE_RADIUS - 16;
            const p1 = { x: INNER_CIRCLE_RADIUS * Math.cos(deg1 * Math.PI / 180), y: INNER_CIRCLE_RADIUS * Math.sin(deg1 * Math.PI / 180) };
            const p2 = { x: r2 * Math.cos(deg2 * Math.PI / 180), y: r2 * Math.sin(deg2 * Math.PI / 180) };
            const p3 = { x: r2 * Math.cos(deg3 * Math.PI / 180), y: r2 * Math.sin(deg3 * Math.PI / 180) };
            let polygon = new PolygonBuilder([p1, p2, p3])
                .setFill('#aaa')
                .setStroke('none')
                .build();
            sign.append(polygon);
        }

        // 外側の円
        let outer_circle = new CircleBuilder()
            .set('r', OUTER_CIRCLE_RADIUS)
            .setFill("none")
            .build();
        sign.append(outer_circle);

        // 内側の円
        let inner_circle1 = new CircleBuilder()
            .set('r', INNER_CIRCLE_RADIUS)
            .setFill("none")
            .build();
        sign.append(inner_circle1);

        // 星座の区切り
        for (let i = 0; i < 12; i++) {
            let start = INNER_CIRCLE_RADIUS;
            let end = OUTER_CIRCLE_RADIUS;
            let line = new RadialLineBuilder(i * 30 + base, start, end).setStrokeWidth(0.5).build();
            sign.append(line);
        }

        // 星座アイコン
        for (let i = 0; i < 12; i++) {
            let image = new RadialImageBuilder(
                CalcAstroBase.svg_sign_symbol[i],
                -360 / 12 * i + base - 17.5,
                (OUTER_CIRCLE_RADIUS + INNER_CIRCLE_RADIUS) / 2,
                OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS,
                (OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS) * 0.7)
                .build();
            sign.append(image);
        }
        // 星座の守護星アイコン
        for (let i = 0; i < 12; i++) {
            let image = new RadialImageBuilder(
                CalcAstroBase.svg_gardian_symbol[i],
                -360 / 12 * i + base - 10,
                (OUTER_CIRCLE_RADIUS + INNER_CIRCLE_RADIUS) / 2,
                OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS,
                (OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS) * 0.45)
                .set('gardian', CalcAstroBase.gardian[i])
                .set('onmouseover', 'dispGardian()')
                .set('onmouseout', 'hideGardian()')
                .build();
            sign.append(image);
        }

        // カスプ
        if (setting['house-system'] === "campanus") {
            let color = "#aaa";
            let width = 0.5
            let line = new RadialLineBuilder(base - ASC, INNER_CIRCLE_RADIUS, INNER_CIRCLE_RADIUS * 0.7)
                .setStroke(color)
                .setStrokeWidth(width)
                .set('stroke-dasharray', '4 4')
                .build();
            svg.append(line);
            line = new RadialLineBuilder(base - MC, INNER_CIRCLE_RADIUS, INNER_CIRCLE_RADIUS * 0.7)
                .setStroke(color)
                .setStrokeWidth(width)
                .set('stroke-dasharray', '4 4')
                .build();
            svg.append(line);
        }

        // 天体
        const wPlanets = 18 * magnify;
        const gapPlanets = wPlanets + 8;
        const inner_gap = wPlanets / 4;
        const hitArea = 3.5 * magnify;
        var layouted = [];
        var angles = [];
        for (let key in setting.bodies) {
            var target = setting.bodies[key].name;
            const elm = setting.bodies[key];
            if (elm) {
                var angle = (180 + elm.longitude - base) * Math.PI / 180;

                // 天体サイン配置計算
                let dup = 0;
                for (var j = 0; j < layouted.length; j++) {
                    if (!layouted[j]) {
                        layouted[j] = [];
                    }

                    var hit = false;
                    for (var k = 0; k < layouted[j].length; k++) {
                        let target = layouted[j][k];
                        if (CalcAstroBase.getAngleBetween(elm.longitude, target) < hitArea * Math.pow(1.1, j)) {
                            hit = true;
                            break;
                        }
                    }
                    if (!hit) {
                        dup = j;
                        break;
                    } else {
                        if (!layouted[j + 1]) {
                            layouted[j + 1] = [];
                        }
                    }
                }

                if (!layouted[dup]) {
                    layouted[dup] = [];
                }
                layouted[dup].push(elm.longitude);

                let src = SettingUtil.body_list[target].svg;
                let image = new RadialImageBuilder(
                    src,
                    base - elm.longitude,
                    INNER_CIRCLE_RADIUS - inner_gap - (gapPlanets - wPlanets) / 2 - wPlanets * 0.5 - dup * gapPlanets,
                    wPlanets,
                    wPlanets)
                    .set('name', target)
                    .set('onmousemove', 'onBody(this)')
                    .set('onmouseover', 'overBody(this)')
                    .set('onmouseout', 'outBody()')
                    .set('class', 'body')
                    .set('title', SettingUtil.body_list[target].name)
                    .set('id', target)
                    .build()
                svg.append(image);

                let r = INNER_CIRCLE_RADIUS - inner_gap - (gapPlanets - wPlanets) / 2 - wPlanets * 0.5 - dup * gapPlanets
                let x = r * Math.cos((base - elm.longitude) * Math.PI / 180) + wPlanets / 2;
                let y = r * Math.sin((base - elm.longitude) * Math.PI / 180);
                let angle_text = new SvgBuilder('text')
                    .set('x', x)
                    .set('y', y)
                    .setFill('#000')
                    .setStroke('rgba(255,255,255,0.75)')
                    .set('stroke-width', 3)
                    .set('paint-order', 'stroke')
                    .set('style', 'visiblity: hidden')
                    .set('id', target + '-angle')
                    .set('class', 'body-angle')
                    .set('font-size', wPlanets / 2)
                    .build();
                angles.push(angle_text);
            }
        }

        $.each(angles, function (key, elm) {
            svg.append(elm);
        });

        for (let i = 0; i < caspdata.casps.length; i++) {
            let deg1 = caspdata.casps[0].angle;
            if (i + 1 < caspdata.casps.length) {
                deg1 = caspdata.casps[i + 1].angle;
            }
            let deg2 = caspdata.casps[i].angle;
            if (deg1 < deg2) {
                deg1 += 360;
            }
            let deg = base - (caspdata.casps[i].angle + (deg1 - deg2) * 0.5);
            let r = INNER_CIRCLE_RADIUS - (layouted.length + 1) * gapPlanets + 10 * magnify;
            r = Math.max(r, 100);
            let fontSize = r / magnify * Math.PI / 9;
            fontSize = Math.max(fontSize, 16);
            let text = new RadialTextBuilder(deg, r, i + 1)
                .set('class', 'symbol')
                .setStroke("#aaa")
                .setFill("#aaa")
                .set('font-size', 16 * magnify)
                .build();
            sign.append(text);
        }

        // アスペクト
        aspects.forEach(function (elm) {
            elm.value.forEach(function (data) {
                if (data.aspect.display) {
                    let aspect_line = new AspectLineBuilder(Math.max(INNER_CIRCLE_RADIUS - (layouted.length + 1) * gapPlanets - 2, 10), base - data.node1.angle, base - data.node2.angle)
                        .setStroke(data.aspect.stroke)
                        .set('stroke-dasharray', data.aspect['stroke-dasharray'])
                        .set('node1', data['node1'].name)
                        .set('node2', data['node2'].name)
                        .set('angle', data.aspect.angle.toFixed(0))
                        .set('class', 'aspect-line')
                        .build();
                    svg.append(aspect_line);
                }
            });
        });

        // アスペクトの円
        let aspect_circle = new CircleBuilder()
            .set('r',
                Math.max(INNER_CIRCLE_RADIUS - (layouted.length + 1) * gapPlanets, 10))
            .setFill("none")
            .build();
        sign.append(aspect_circle);
        $('#horoscope').append(svg);

        // アスペクトテーブルを作る
        $('#aspect-table').empty();
        $('#aspect-table').append(getAspectTable(aspects));

        makeBodyList();
        makeHouseList();
        makeDivTable();
    }
}

function redraw() {
    calc();
}

/** ハウス情報を取得 */
function getHouse() {
    var casp1_sign = parseFloat($('#casp1-sign').val());
    var casp1_deg = parseFloat($('#casp1-deg').val());
    var casp1_min = parseFloat($('#casp1-min').val());
    var casp1 = fixDeg(casp1_sign + casp1_deg + (1 / 60 * casp1_min));

    var casp2_deg = parseFloat($('#casp2-deg').val());
    var casp2_min = parseFloat($('#casp2-min').val());
    var casp2 = fixDeg(casp1 + casp2_deg + (1 / 60 * casp2_min));

    var casp3_deg = parseFloat($('#casp3-deg').val());
    var casp3_min = parseFloat($('#casp3-min').val());
    var casp3 = fixDeg(casp1 + casp3_deg + (1 / 60 * casp3_min));

    var casp10_deg = parseFloat($('#casp10-deg').val());
    var casp10_min = parseFloat($('#casp10-min').val());
    var casp10 = fixDeg(casp1 - casp10_deg - (1 / 60 * casp10_min));

    var casp11_deg = parseFloat($('#casp11-deg').val());
    var casp11_min = parseFloat($('#casp11-min').val());
    var casp11 = fixDeg(casp1 - casp11_deg - (1 / 60 * casp11_min));

    var casp12_deg = parseFloat($('#casp12-deg').val());
    var casp12_min = parseFloat($('#casp12-min').val());
    var casp12 = fixDeg(casp1 - casp12_deg - (1 / 60 * casp12_min));

    var casp4 = fixDeg(casp10 + 180);
    var casp5 = fixDeg(casp11 + 180);
    var casp6 = fixDeg(casp12 + 180);
    var casp7 = fixDeg(casp1 + 180);
    var casp8 = fixDeg(casp2 + 180);
    var casp9 = fixDeg(casp3 + 180);

    return {
        'ASC': { angle: casp1 },
        'MC': { angle: casp10 },
        'casps': [
            { angle: casp1 },
            { angle: casp2 },
            { angle: casp3 },
            { angle: casp4 },
            { angle: casp5 },
            { angle: casp6 },
            { angle: casp7 },
            { angle: casp8 },
            { angle: casp9 },
            { angle: casp10 },
            { angle: casp11 },
            { angle: casp12 },
        ]
    }
}

function fixDeg(deg) {
    while (deg < 0) {
        deg += 360;
    }
    return deg % 360;
}

/** アスペクトテーブルを作る */
function getAspectTable(aspects) {
    // 情報をもとにテーブルを作成
    let aspect_table = document.createElement("table");
    for (let i = 0; i < setting.targets.length; i++) {
        let colgroup = document.createElement('col');
        colgroup.span = 1;
        aspect_table.append(colgroup);
    }
    aspects.forEach(function (elm) {
        let row = document.createElement("tr");
        elm.value.forEach(function (pair) {
            let cell = document.createElement("td");
            cell.innerHTML = pair.aspect.angle !== null & pair.aspect.angle !== undefined ? pair.aspect.angle.toFixed(0) : "";
            cell.setAttribute("style", "color:" + (pair.aspect.stroke !== undefined ? pair.aspect.stroke : '#fff'));
            cell.setAttribute("data-aspect", JSON.stringify(pair));
            cell.setAttribute("class", "aspect__cell");
            if (pair.aspect.tight) {
                $(cell).addClass('bold');
            }
            if (pair.aspect.diff !== undefined) {
                $('<div class="small aspect__cell">').attr("data-aspect", JSON.stringify(pair)).text('(' + pair.aspect.diff + ')').appendTo(cell);
            }
            row.append(cell);
        });
        let body = document.createElement("th");
        body.innerHTML = SettingUtil.body_list[elm.key].name;
        row.append(body);
        aspect_table.append(row);
    });

    return aspect_table;
}

/**
 * 天体一覧を作る
 */
function makeBodyList() {
    const table = $('#body-table');
    table.empty();
    for (let i = 0; i < setting.targets.length; i++) {
        const tr = $('<tr>').appendTo(table);
        const key = setting.targets[i];
        const name = SettingUtil.body_list[key].name;
        const data = setting.bodies[key];
        if (data === null || data === undefined) {
            continue;
        }
        const sign = CalcAstroBase.getSign(data.longitude);
        const time = CalcAstroBase.deg2time(data.longitude % 30);
        const house_num = getHouseNum(data.longitude);
        const td = $('<td>').appendTo(tr);
        const img = $('<img class="body-table__icon">').appendTo(td);
        const sabianDeg = SabianUtil.getSabianDeg(data.longitude);
        const sabianSymbol = SabianUtil.getSabianSymbol(data.longitude);
        img.prop('src', SettingUtil.body_list[key].svg);
        $('<span class="body_name">').text(name).appendTo(td);
        $('<td class="body_sign">').text(sign).appendTo(tr);
        $('<td>').text(time).appendTo(tr);
        $('<td>').text(house_num + '室').appendTo(tr);
        if (data.longitudeSpeed < 0) {
            $('<td>').text('逆行').appendTo(tr);
        } else {
            $('<td>').appendTo(tr);
        }
        $('<td>').text(sabianDeg).appendTo(tr);
        $('<td>').text(sabianSymbol).appendTo(tr);
    }

}

function makeHouseList() {
    const ul = $('#house-list');
    let ASC;
    let MC;
    ul.empty();
    if (casps.ASC !== undefined) {
        ASC = casps.ASC.angle;
    } else {
        ASC = casps.casps[0].angle;
    }
    if (casps.MC !== undefined) {
        MC = casps.MC.angle;
    } else {
        MC = casps.casps[9].angle;
    }

    const sign_asc = CalcAstroBase.getSign(ASC);
    const time_asc = CalcAstroBase.deg2time(ASC % 30);
    const li_asc = $('<li>').appendTo(ul);
    $('<span class="house_name">').text('ASC').appendTo(li_asc);
    $('<span class="house_sign">').text(sign_asc).appendTo(li_asc);
    $('<span clsss="house_time">').text(time_asc).appendTo(li_asc);

    const sign_mc = CalcAstroBase.getSign(MC);
    const time_mc = CalcAstroBase.deg2time(MC % 30);
    const li_mc = $('<li>').appendTo(ul);
    $('<span class="house_name">').text('MC').appendTo(li_mc);
    $('<span class="house_sign">').text(sign_mc).appendTo(li_mc);
    $('<span class="house_time">').text(time_mc).appendTo(li_mc);

    for (let i = 0; i < casps.casps.length; i++) {
        const deg = casps.casps[i].angle;
        const sign = CalcAstroBase.getSign(deg);
        const time = CalcAstroBase.deg2time(deg % 30);
        const li = $('<li>').appendTo(ul);
        $('<span class="house_name">').text('第' + (i + 1) + 'カスプ').appendTo(li);
        $('<span class="house_sign">').text(sign).appendTo(li);
        $('<span class="house_time">').text(time).appendTo(li);

    }
}

/**
 * 区分テーブルの作成
 */
function makeDivTable() {
    makeDiv4Table();
    makeDiv3Table();
    makeDiv2Table();
}

function makeDiv4Table() {
    $('#div4').empty();
    // 四区分
    const div4 = [[], [], [], []];
    for (let i = 0; i < setting.bodies.length; i++) {
        const body = setting.bodies[i];
        const num = (Math.floor(body.longitude / 30)) % 4;
        div4[num].push(SettingUtil.body_list[setting.bodies[i].name]);
    }
    let table = $('<table>');
    let tr1 = $('<tr>').appendTo(table);
    $('<th>').text("火").appendTo(tr1);
    $('<th>').text("地").appendTo(tr1);
    $('<th>').text("風").appendTo(tr1);
    $('<th>').text("水").appendTo(tr1);
    let tr2 = $('<tr>').appendTo(table);
    for (let i = 0; i < div4.length; i++) {
        let td = $('<td>').appendTo(tr2);
        for (let j = 0; j < div4[i].length; j++) {
            let body = div4[i][j];
            let div = $('<div>').appendTo(td);
            let img = $('<img class="body-table__icon">').appendTo(div);
            img.prop('src', body.svg);
            $('<span>').text(body.name).appendTo(div);
        }
    }
    $('#div4').append(table);
}

function makeDiv3Table() {
    $('#div3').empty();
    // 三区分
    const div3 = [[], [], []];
    for (let i = 0; i < setting.bodies.length; i++) {
        const body = setting.bodies[i];
        const num = (Math.floor(body.longitude / 30)) % 3;
        div3[num].push(SettingUtil.body_list[setting.bodies[i].name]);
    }
    let table = $('<table>');
    let tr1 = $('<tr>').appendTo(table);
    $('<th>').text("活動宮").appendTo(tr1);
    $('<th>').text("不動宮").appendTo(tr1);
    $('<th>').text("柔軟宮").appendTo(tr1);
    let tr2 = $('<tr>').appendTo(table);
    for (let i = 0; i < div3.length; i++) {
        let td = $('<td>').appendTo(tr2);
        for (let j = 0; j < div3[i].length; j++) {
            let body = div3[i][j];
            let div = $('<div>').appendTo(td);
            let img = $('<img class="body-table__icon">').appendTo(div);
            img.prop('src', body.svg);
            $('<span>').text(body.name).appendTo(div);
        }
    }
    $('#div3').append(table);
}

function makeDiv2Table() {
    $('#div2').empty();
    // 二区分
    const div2 = [[], []];
    for (let i = 0; i < setting.bodies.length; i++) {
        const body = setting.bodies[i];
        const num = (Math.floor(body.longitude / 30)) % 2;
        div2[num].push(SettingUtil.body_list[setting.bodies[i].name]);
    }
    let table = $('<table>');
    let tr1 = $('<tr>').appendTo(table);
    $('<th>').text("男性宮").appendTo(tr1);
    $('<th>').text("女性宮").appendTo(tr1);
    let tr2 = $('<tr>').appendTo(table);
    for (let i = 0; i < div2.length; i++) {
        let td = $('<td>').appendTo(tr2);
        for (let j = 0; j < div2[i].length; j++) {
            let body = div2[i][j];
            let div = $('<div>').appendTo(td);
            let img = $('<img class="body-table__icon">').appendTo(div);
            img.prop('src', body.svg);
            $('<span>').text(body.name).appendTo(div);
        }
    }
    $('#div2').append(table);
}

/** 天体にオンマウス */
function overBody() {
    const name = event.target.getAttribute('name');
    // アスペクトの強調表示
    if ($('#display-aspect').prop('checked')) {
        $('.body').css('opacity', 0.1);
        $(event.target).css('opacity', 1);
        $(event.target).css('outline', '1px solid red');
        $('.aspect-line').css('opacity', 0);
        let aspect_bodies = [];
        $('line[node1="' + name + '"]').each(function (key, elm) {
            $(elm).css('opacity', 1);
            $(elm).attr('stroke-width', 2);
            aspect_bodies.push({ name: $(elm).attr('node2'), angle: $(elm).attr('angle') });
        })
        $('line[node2="' + name + '"]').each(function (key, elm) {
            $(elm).css('opacity', 1);
            $(elm).attr('stroke-width', 2);
            aspect_bodies.push({ name: $(elm).attr('node1'), angle: $(elm).attr('angle') });
        });

        $.each(aspect_bodies, function (key, elm) {
            if (elm.name !== name) {
                const body = document.getElementById(elm.name);
                $(body).css('opacity', 1);
                const angle = document.getElementById(elm.name + '-angle');
                $(angle)
                    .text(elm.angle + '°')
                    .css('visibility', 'visible');
            }
        });
    }
}
function onBody() {
    const name = event.target.getAttribute('name');
    const checked = $('#display-bodydata').prop('checked');
    const onBodySetting = $('#display-bodydata').val();

    // 天体の詳細表示
    if (checked || onBodySetting === 'detail') {
        let div = $('#description');
        $(div).empty();
        let x = event.pageX;
        let y = event.pageY;
        let elm = SettingUtil.body_list[name];
        let body = setting.bodies[name];
        let title = event.target.getAttribute('title') + (body.longitudeSpeed < 0 ? ' 逆行' : '');
        let house = getHouseNum(body.longitude) + '室';

        $('<img class="description__icon">').prop('src', elm.svg).appendTo(div);
        $('<span>').text(title).appendTo(div);

        let sign = CalcAstroBase.getSign(body.longitude);
        let time = CalcAstroBase.deg2time(body.longitude % 30);
        let sign_str = sign + ' ' + time;
        $('<div>').text(`${sign_str} ${house}`).appendTo(div);

        let sabian = SabianUtil.getSabianString(body.longitude);
        $('<div>').text(sabian).appendTo(div);

        div.css('display', 'block');
        if (event.clientX > window.innerWidth - div.width()) {
            div.css('left', x - div.width() - 10)
        } else {
            div.css('left', x + 16);
        }
        if (event.clientY > window.innerHeight - div.height()) {
            div.css('top', y - div.height() - 5);
        } else {
            div.css('top', y + 5);
        }
    } else if (onBodySetting === 'name') {
        let div = $('#description');
        $(div).empty();
        let x = event.pageX;
        let y = event.pageY;
        let elm = SettingUtil.body_list[name];
        let body = setting.bodies[name];
        let title = event.target.getAttribute('title');

        $('<img class="description__icon">').prop('src', elm.svg).appendTo(div);
        $('<span>').text(title).appendTo(div);

        div.css('display', 'block');
        if (event.clientX > window.innerWidth - div.width()) {
            div.css('left', x - div.width() - 10)
        } else {
            div.css('left', x + 16);
        }
        if (event.clientY > window.innerHeight - div.height()) {
            div.css('top', y - div.height() - 5);
        } else {
            div.css('top', y + 5);
        }
    }
}

/**
 * 角度から所属ハウスを取得する
 * @param {number} deg 
 */
function getHouseNum(deg) {
    let base = casps.casps[0].angle;
    deg = (deg - base + 360) % 360;
    for (let i = 0; i < 11; i++) {
        let deg1 = (casps.casps[i].angle - base + 360) % 360;
        let deg2 = (casps.casps[i + 1].angle - base + 360) % 360;
        if (deg >= deg1 && deg <= deg2) {
            return i + 1;
        }
    }
    return 12;
}

/**
 * 天体からのマウスアウト
 */
function outBody() {
    $('#description').css('display', 'none');
    $('.body').css('opacity', 1);
    $('.body').css('outline', 'none');
    $('.aspect-line').css('opacity', 1);
    $('.aspect-line').attr('stroke-width', 1);
    $('.body-angle').css('visibility', 'hidden');
}

/**
 * アスペクトテーブルのセルオンマウス
 */
function onAspectCell() {
    const aspect = JSON.parse(event.target.dataset.aspect);
    if (aspect.aspect.angle !== null) {
        let node1 = SettingUtil.body_list[aspect.node1.name].name;
        let node2 = SettingUtil.body_list[aspect.node2.name].name;
        let body1 = setting.bodies[aspect.node1.name];
        let body2 = setting.bodies[aspect.node2.name];
        let sign1 = CalcAstroBase.getSign(body1.longitude);
        let sign2 = CalcAstroBase.getSign(body2.longitude);
        let house1 = getHouseNum(body1.longitude);
        let house2 = getHouseNum(body2.longitude);
        let data1 = node1 + ':' + sign1 + ' ' + house1 + '室';
        let data2 = node2 + ':' + sign2 + ' ' + house2 + '室';

        let div = $('#aspect-data');
        div.empty();
        $('<div>').text(data1).appendTo(div);
        $('<div>').text(data2).appendTo(div);
        $('<div>').text(aspect.aspect.angle.toFixed(0) + '°:' + aspect.aspect.name).appendTo(div);

        div.css('display', 'block');
        if (event.clientX > window.innerWidth - div.width()) {
            div.css('left', event.pageX - div.width() - 16);
        } else {
            div.css('left', event.pageX + 5);
        }
        div.css('top', event.pageY - div.height() - 2);
    }
}

/**
 * アスペクトテーブルのセルマウスアウト
 */
function outAspectCell() {
    $('#aspect-data').css('display', 'none');
}

// 拡大縮小ボタン
$('#plus').click(function () {
    if (magnify < 2) {
        magnify += 0.2;
    }
    if (magnify > 1.8) {
        $('#plus').prop('disabled', true);
    }
    $('#minus').prop('disabled', false);

    localStorage.setItem('magnify', magnify);

    redraw();
});
$('#minus').click(function () {
    if (magnify > 1) {
        magnify -= 0.2;
    }
    if (magnify < 1.2) {
        $('#minus').prop('disabled', true);
    }
    $('#plus').prop('disabled', false);

    localStorage.setItem('magnify', magnify);

    redraw();
});

// 守護星を強調
function dispGardian() {
    $('.body').css('opacity', 0.1);
    $('image[name="' + $(event.target).attr('gardian') + '"]').css('opacity', 1);
}
// 守護星の強調を削除
function hideGardian() {
    $('.body').css('opacity', 1);
}

/** 県リスト */
const prefecture_list = [
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

function initBodySetting() {
    var div = $('#body-setting');
    div.empty();
    const keys = Object.keys(setting.bodies);
    keys.forEach((key) => {
        const body = setting.bodies[key];
        div.append(getBodySettingItem(key, body.longitude, body.longitudeSpeed < 0));
    });
}

function getBodySettingItem(body, longitude, reverse) {
    var div = $('<div class="body-setting__item">');
    const sign = CalcAstroBase.getSign(longitude);
    $('<button onclick="deleteBodyItem()">').text(' - ').appendTo(div);
    div.append(getBodySelect(body));
    div.append(getSignSelect(sign));
    $('<input type="number" inputmode="numeric" min="0" max="29" class="body-setting__deg" onchange="calc()">').val(Math.floor(longitude % 30)).appendTo(div);
    div.append($('<span>').text('°'));
    $('<input type="number" inputmode="mumeric" min="0" max="59" class="body-setting__min" onchange="calc()">').val(Math.round((longitude % 1) * 60)).appendTo(div);
    div.append($('<span>').text('\' 逆行'));
    $('<input type="checkbox" class="body-setting__reverse" onchange="calc()">').prop('checked', reverse).appendTo(div);
    div.append($)
    return div;
}

function getBodySelect(body) {
    var select = $('<select class="body-setting__body" onchange="calc()">');
    var list = SettingUtil.body_list;
    for (var key in list) {
        var item = list[key];
        var option = $('<option>').appendTo(select);
        option.val(key);
        option.text(item.name);
        if (body == key) {
            option.prop('selected', true);
        }
    }
    return select;
}

function getSignSelect(sign) {
    var select = $('<select class="body-setting__sign" onchange="calc()">');
    $('<option>').val(0).text('牡羊座').prop('selected', sign == undefined || sign == '牡羊座').appendTo(select);
    $('<option>').val(30).text('牡牛座').prop('selected', sign == undefined || sign == '牡牛座').appendTo(select);
    $('<option>').val(60).text('双子座').prop('selected', sign == undefined || sign == '双子座').appendTo(select);
    $('<option>').val(90).text('蟹　座').prop('selected', sign == undefined || sign == '蟹座').appendTo(select);
    $('<option>').val(120).text('獅子座').prop('selected', sign == undefined || sign == '獅子座').appendTo(select);
    $('<option>').val(150).text('乙女座').prop('selected', sign == undefined || sign == '乙女座').appendTo(select);
    $('<option>').val(180).text('天秤座').prop('selected', sign == undefined || sign == '天秤座').appendTo(select);
    $('<option>').val(210).text('蠍　座').prop('selected', sign == undefined || sign == '蠍座').appendTo(select);
    $('<option>').val(240).text('射手座').prop('selected', sign == undefined || sign == '射手座').appendTo(select);
    $('<option>').val(270).text('山羊座').prop('selected', sign == undefined || sign == '山羊座').appendTo(select);
    $('<option>').val(300).text('水瓶座').prop('selected', sign == undefined || sign == '水瓶座').appendTo(select);
    $('<option>').val(330).text('魚　座').prop('selected', sign == undefined || sign == '魚座').appendTo(select);
    return select;
}

function getBodyData(div) {
    var data = [];
    var items = $('.body-setting__item');
    for (var i = 0; i < items.length; i++) {
        var div = items[i];
        var bodyName = $(div).find(".body-setting__body")[0].value;
        var offset = parseFloat($(div).find(".body-setting__sign")[0].value);
        var deg = parseFloat($(div).find(".body-setting__deg")[0].value);
        var min = parseFloat($(div).find(".body-setting__min")[0].value);
        var r = $(div).find(".body-setting__reverse")[0].checked ? -1 : 1;
        data.push({
            'name': bodyName,
            'longitude': offset + deg + (1 / 60 * min),
            'longitudeSpeed': r
        })
    }

    console.log(data);
    return data;
}

function deleteBodyItem() {
    $(event.target).parent().remove();
    calc();
}

function addBodyItem() {
    var div = $('#body-setting');
    div.append(getBodySettingItem(null, '牡羊座'));
}

function displayHouseValue() {
    casps = setting.casps.casps;
    $('#casp1-sign').val(Math.floor(casps[0].angle / 30) * 30);
    $('#casp1-deg').val(Math.floor(casps[0].angle % 30));
    $('#casp1-min').val(Math.round(casps[0].angle % 1 * 60));


    let deff_2 = casps[1].angle - casps[0].angle;
    if (deff_2 < 0) deff_2 += 360;
    $('#casp2-deg').val(Math.floor(Math.floor(deff_2)));
    $('#casp2-min').val(Math.round(deff_2 % 1 * 60));

    let deff_3 = casps[2].angle - casps[0].angle;
    if (deff_3 < 0) deff_3 += 360;
    $('#casp3-deg').val(Math.floor(Math.floor(deff_3)));
    $('#casp3-min').val(Math.round(deff_3 % 1 * 60));

    let deff_10 = casps[0].angle - casps[9].angle;
    if (deff_10 < 0) deff_10 += 360;
    $('#casp10-deg').val(Math.floor(Math.floor(deff_10)));
    $('#casp10-min').val(Math.round(deff_10 % 1 * 60));

    let deff_11 = casps[0].angle - casps[10].angle;
    if (deff_11 < 0) deff_11 += 360;
    $('#casp11-deg').val(Math.floor(Math.floor(deff_11)));
    $('#casp11-min').val(Math.round(deff_11 % 1 * 60));

    let deff_12 = casps[0].angle - casps[11].angle;
    if (deff_12 < 0) deff_12 += 360;
    $('#casp12-deg').val(Math.floor(Math.floor(deff_12)));
    $('#casp12-min').val(Math.round(deff_12 % 1 * 60));

    $('#casp2-value').val(getHouseValueString(casps[1].angle));
    $('#casp3-value').val(getHouseValueString(casps[2].angle));
    $('#casp4-value').val(getHouseValueString(casps[3].angle));
    $('#casp5-value').val(getHouseValueString(casps[4].angle));
    $('#casp6-value').val(getHouseValueString(casps[5].angle));
    $('#casp7-value').val(getHouseValueString(casps[6].angle));
    $('#casp8-value').val(getHouseValueString(casps[7].angle));
    $('#casp9-value').val(getHouseValueString(casps[8].angle));
    $('#casp10-value').val(getHouseValueString(casps[9].angle));
    $('#casp11-value').val(getHouseValueString(casps[10].angle));
    $('#casp12-value').val(getHouseValueString(casps[11].angle));
}

function getHouseValueString(deg) {
    const sign = CalcAstroBase.getSign(deg);
    const time = CalcAstroBase.deg2time(deg);

    return sign + ' ' + time;
}

function changeCaspSetting() {
    setting.casps = getHouse();
    displayHouseValue();
    calc();
}
/** 天体設定ボタンクリックイベント */
$("#open_body_setting").on("click", () => {
    $("#body_setting__inputs").empty();

    makeSetting();
    initValue();
    $("#body_setting").modal();
});

$("#body_setting").on($.modal.AFTER_CLOSE, () => {
    calc();
});

/** オーブ設定ボタンクリックイベント */
$("#open_obe_setting").on("click", () => {
    $("#aspect_setting__inputs").empty();
    init_obe_setting();
    $("#obe_setting").modal();
});

$("#obe_setting").on($.modal.AFTER_CLOSE, () => {
    calc();
});

/** 設定保存モーダル */
$("#show_save_setting").on("click", () => {
    $("#setting_name").val($("#name").val());
    $("#save_setting_dialog").modal();
    $("#setting_name").focus();
});

$("#btn_save_setting").on("click", () => {
    $("#setting_name").blur();
    setTimeout(() => {

        if ($("#setting_name").val()) {
            SettingUtil.saveSetting(setting, $("#setting_name").val());
            $.modal.close();
            $("#setting_name").val("");
        } else {
            alert("設定名を入力してください");
        }
    }, 200);
});


$("#show_load_setting").on("click", () => {
    const settings = JSON.parse(localStorage.getItem(SettingUtil.setting_key));
    if (settings && settings.saved != null && Object.keys(settings.saved).length > 0) {
        let keys = Object.keys(settings.saved);
        $("#load_setting_list").empty();
        for (let i = 0; i < keys.length; i++) {
            let div = createSettingItem(keys[i]);
            $("#load_setting_list").append(div);
        }

        $("#load_setting_dialog").modal();
    } else {
        alert("保存された設定がありません");
    }
});

$(document).on("click", ".setting_item", () => {
    let elm = $(event.target);
    let target = elm.data("name");
    let settings = JSON.parse(localStorage.getItem(SettingUtil.setting_key));
    if (settings.saved[target]) {
        setting = new Setting(JSON.stringify(settings.saved[target]));
        console.log(setting);
        initBodySetting();
        displayHouseValue();
        $("#name").val(target);
        redraw();
        $.modal.close();
    }
});
$(document).on("click", ".delete_setting", () => {
    let elm = $(event.target);
    let target = elm.data("name");

    if (confirm(target + " を削除してよろしいですか？")) {
        let settings = JSON.parse(localStorage.getItem(SettingUtil.setting_key));
        delete settings.saved[target];
        localStorage.setItem(SettingUtil.setting_key, JSON.stringify(settings));
        let keys = Object.keys(settings.saved);
        $("#load_setting_list").empty();
        for (let i = 0; i < keys.length; i++) {
            let div = createSettingItem(keys[i]);
            $("#load_setting_list").append(div);
        }
    }
});

/**
 * 読み込み用の設定一覧のアイテムを作成する
 * @param {*} key 
 */
function createSettingItem(key) {
    let div = $("<div>").addClass("setting_item_wrapper");
    $("<span>").text(key).attr("data-name", key).addClass("setting_item").appendTo(div);
    $("<button>").text("━").attr("data-name", key).addClass("delete_setting").appendTo(div);
    return div;
}