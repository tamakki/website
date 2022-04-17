var bodies;
var casps;
var aspects;
var magnify = 1.6;
const settingVersion = 3;
var setting_open = true;
let setting = new Setting(JSON.stringify(SettingUtil.default_setting));

// 初期設定
$(function () {
    $.datepicker.setDefaults($.datepicker.regional["ja"]);
    $('#birth-date').datepicker({
        changeYear: true, //年を表示
        changeMonth: true, //月を選択
        yearRange:'-100:+100',
        changeDate: changeSetting
    }).on('change', changeSetting);

    // 誕生時間の選択肢
    for(let i = 0; i < 24; i++){
        let option = $('<option>');
        option.val(i);
        option.text(('0' + i).slice(-2));
        $('#birth-hour').append(option);
    }
    for(let i = 0; i < 60; i++){
        let option = $('<option>');
        option.val(i);
        option.text(('0' + i).slice(-2));
        $('#birth-min').append(option);
    }
    for(let i = 12; i > -12; i--) {
        let option = $('<option>');
        option.val(i);
        if(i !== 0) {
            option.text((i > 0? '+': '-') + ('0' + Math.abs(i)).slice(-2) + ':00時間');
        } else {
            option.text('世界標準時');
        }
        $('#time-diff').append(option);
    }
    $('#prefecture').append($('<option>'));
    for(let i = 0; i < prefecture_list.length; i++) {
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
    $('#prefecture').change(function() {
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

    $('#btn_calc').click(function() {
        calc();
    });
    $('#btn_remove_setting').click(function() {
        if(confirm('設定を初期化します。よろしいですか？')){
            setting = new Setting(JSON.stringify(SettingUtil.default_setting));
            initSetting();
            $('#horoscope').empty();
            $('#house-list').empty();
            $('#body-table').empty();
            $('#aspect-table').empty();
            localStorage.removeItem('bodies');
            localStorage.removeItem('casps');
            localStorage.removeItem('magnify');
            localStorage.removeItem('display-bodydata');
            localStorage.removeItem('display-aspect');
        }
    });
    $('#display-bodydata').change(function() {
        localStorage.setItem('display-bodydata', $('#display-bodydata').val());
    });
    $('#display-aspect').change(function() {
        localStorage.setItem('display-aspect', $('#display-aspect').prop('checked'));
    });
    
    $(document).on('mousemove', '.aspect__cell', onAspectCell);
    $(document).on('mouseout', '.aspect__cell', outAspectCell);

    $('#minus').prop('disabled', magnify < 1.2);
    $('#plus').prop('disabled', magnify > 1.8);

    $('#display-aspect').prop('checked', localStorage.getItem('display-aspect') === 'true');

    if(localStorage.getItem('display-bodydata') === 'detail' || localStorage.getItem('display-bodydata') === 'name' || localStorage.getItem('display-bodydata') === 'none') {
        $('#display-bodydata').val(localStorage.getItem('display-bodydata'));
    }

    calc();
});

/** 初期表示用設定 */
function initSetting() {
    $.each(setting, function(key, value) {
        const elm = $('#' + key);
        if(elm) {
            if(key.indexOf('disp') !== -1){
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
}

/** 県選択時イベント */
function changePrefecture() {
    const prefecture = JSON.parse($('#prefecture').val());
    const longitude_deg = Math.floor(prefecture.longitude);
    const longitude_min = ('0' + Math.round((prefecture.longitude % 1) / (1/60))).slice(-2);
    const latitude_deg = Math.floor(prefecture.latitude);
    const latitude_min = ('0' + Math.round((prefecture.latitude % 1) / (1/60))).slice(-2);
    $('#longitude-deg').val(longitude_deg);
    $('#longitude-min').val(longitude_min);
    $('#latitude-deg').val(latitude_deg);
    $('#latitude-min').val(latitude_min);
}

/** 天体計算 */
function calc() {
    let targets = [];
    targets = targets.concat(setting.targets);
    if(targets.indexOf('sun') === -1) targets.push('sun');
    if(targets.indexOf('moon') === -1) targets.push('moon');
    if(validate(setting)) {
        $.LoadingOverlay('show');
        $.ajax({
            url: 'https://acidic-chill-bat.glitch.me/api/horo',
            //url: 'http://localhost:53907/api/horo',
            type: 'post',
            data: {
                date: setting.getBirthDate(),
                bodies: targets,
                geo: {longitude: setting.getLongitude(), latitude: setting.getLatitude()}
            }
        }).done(function(res) {
            bodies = res;
            localStorage.setItem('bodies', JSON.stringify(bodies));
            try {
                draw();
            } catch(ex) {
                alert('描画中にエラーが発生しました。\n');
                $.LoadingOverlay('hide');
            }
        }).fail(function(res) {
            alert('天体位置の計算でエラーが発生しました。');
        }).always(function() {
            $.LoadingOverlay('hide');
        });
    }
}

function validate(setting) {
    if(setting.getBirthDate().toString() === "Invalid Date") {
        alert('日付の入力形式に誤りがあります。\n 2020/01/01　のように入力してください。');
        return false;
    }

    if(setting['longitude-deg'] > 180 || setting['longitude-deg']  < -179) {
        alert('経度は　-179° ~ 180°　の範囲で入力してください。');
        return false;
    }
    if(setting['longitude-min'] < 0 || setting['longitude-min'] > 59) {
        alert('経度（分）は 0\'~59\'　の範囲で入力してください。');
        return false;
    }
    if(Math.abs(setting['latitude-deg']) > 90) {
        alert('緯度は -90° ～ 90°　の範囲で入力してください。');
        return false;
    }
    if(setting['latitude-min'] < 0 || setting['latitude-min'] > 59) {
        alert('緯度（分）は 0\'~59\'　の範囲で入力してください。');
        return false;
    }

    return true;
 }

/** ホロスコープおよび各表を描画する */
function draw() {
    changeSetting();
    if(bodies) {
        // 描画を削除
        $('#horoscope').empty();   

        // ハウスを取得
        const caspdata = getHouse(setting);
        casps = caspdata;
        localStorage.setItem('casps', JSON.stringify(casps));
        // カスプ情報を取得
        let base = (caspdata.casps[0].angle + 180) % 360;
        let ASC;
        let MC;
        if(setting['house-system'] === "campanus") {
            base = (caspdata.ASC.angle + 180) % 360;
            ASC = caspdata.ASC.angle;
            MC = caspdata.MC.angle;
        } else {
            ASC = caspdata.casps[0].angle;
            MC = caspdata.casps[9].angle;
        }
        if(setting['house-system'] !== 'solar-sign' && setting['house-system'] !== 'solar'){
            if(setting.targets.indexOf('ASC') !== -1) {
                bodies['ASC'] ={
                    longitude: ASC
                };
            }

            if(setting.targets.indexOf('MC') !== -1) {
                bodies['MC'] = {
                    longitude: MC
                };
            }
        } else {
            delete bodies['ASC'];
            delete bodies['MC'];
        }

        // アスペクトを取得
        const aspect_calculator = new AspectCalculator();
        const elements = [];
        $.each(bodies, function(key, value) {
            if(value){
                elements.push({name: key, angle: value.longitude});
            }
        });
        aspect_calculator.setTargets(elements);
        aspects = aspect_calculator.getAspects();
        

        // viewBOX設定
        const VIEW_BOX_WIDTH = 800;
        const VIEW_BOX_HEIGHT = 800;
        const OUTER_CIRCLE_RADIUS = 390;
        const INNER_CIRCLE_RADIUS = OUTER_CIRCLE_RADIUS - 26 * magnify;
        const VIEW_BOX_LEFT = -1 * VIEW_BOX_WIDTH * 0.5;
        const VIEW_BOX_TOP = -1 * VIEW_BOX_HEIGHT * 0.5;
    
        // SVG本体
        let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute("viewBox", VIEW_BOX_LEFT + "," + VIEW_BOX_TOP + "," + VIEW_BOX_WIDTH + "," + VIEW_BOX_HEIGHT);
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute('class', 'horoscope');

        let background = new PolygonBuilder(
            [
                {x:-VIEW_BOX_WIDTH/2, y:-VIEW_BOX_HEIGHT/2},
                {x: VIEW_BOX_WIDTH/2, y:-VIEW_BOX_HEIGHT/2},
                {x: VIEW_BOX_WIDTH/2, y: VIEW_BOX_HEIGHT/2},
                {x:-VIEW_BOX_WIDTH/2, y: VIEW_BOX_HEIGHT/2}
            ]
        )
        .setFill('#fff')
        .setStroke('none')
        .build();
        svg.append(background);

        let sign = new GroupBuilder()
        .setId('sign')
        .build();
        svg.append(sign);
    
        // サインの色
        for(let i = 0; i < 12; i++){
            let x = 0;
            let y = 0;
            let r = (OUTER_CIRCLE_RADIUS + INNER_CIRCLE_RADIUS) / 2;
            let start = -360 / 12 * (i + 1) + base;
            let end = -360 / 12 * i + base;
            let arc = new ArcBuilder(x,y,r,start,end).setStroke(CalcAstroBase.sign_symbol_colors[i]).setStrokeWidth(OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS).build();
            sign.append(arc);
        }

        // カスプ
        let house = setting['house-system'] ;
        caspdata.casps.forEach(function(casp){
            let width = 1.0
            let color = "#aaa";
            if(house === 'placidus' || house === 'regiomontanus' || house === 'koch'){
                if(casp === caspdata.casps[0] || casp === caspdata.casps[3] || casp === caspdata.casps[6] || casp === caspdata.casps[9]){
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
        if(house === 'placidus' || house === 'regiomontanus' || house === 'koch') {
            const deg1 = base - caspdata.casps[9].angle;
            const deg2 = deg1 + 1;
            const deg3 = deg1  - 1;
            const r2 = INNER_CIRCLE_RADIUS - 16;
            const p1 = {x: INNER_CIRCLE_RADIUS * Math.cos(deg1*Math.PI/180), y: INNER_CIRCLE_RADIUS * Math.sin(deg1*Math.PI/180)};
            const p2 = {x: r2 * Math.cos(deg2*Math.PI/180), y: r2 * Math.sin(deg2*Math.PI/180)};
            const p3 = {x: r2 * Math.cos(deg3*Math.PI/180), y: r2 * Math.sin(deg3*Math.PI/180)};
            let polygon = new PolygonBuilder([p1,p2,p3])
            .setFill('#aaa')
            .setStroke('none')
            .build();
            sign.append(polygon);
        }

        // MCの矢印
        if(house === 'placidus' || house === 'regiomontanus' || house === 'koch') {
            const deg1 = 180;
            const deg2 = deg1 + 1;
            const deg3 = deg1  - 1;
            const r2 = INNER_CIRCLE_RADIUS - 16;
            const p1 = {x: INNER_CIRCLE_RADIUS * Math.cos(deg1*Math.PI/180), y: INNER_CIRCLE_RADIUS * Math.sin(deg1*Math.PI/180)};
            const p2 = {x: r2 * Math.cos(deg2*Math.PI/180), y: r2 * Math.sin(deg2*Math.PI/180)};
            const p3 = {x: r2 * Math.cos(deg3*Math.PI/180), y: r2 * Math.sin(deg3*Math.PI/180)};
            let polygon = new PolygonBuilder([p1,p2,p3])
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
        for(let i = 0; i < 12; i++) {
            let start = INNER_CIRCLE_RADIUS;
            let end = OUTER_CIRCLE_RADIUS;
            let line = new RadialLineBuilder(i * 30 + base, start, end).setStrokeWidth(0.5).build();
            sign.append(line);
        }
        
        // 星座アイコン
        for(let i = 0; i < 12; i++){
            let image = new RadialImageBuilder(
                CalcAstroBase.svg_sign_symbol[i], 
                -360 / 12 * i + base - 17.5, 
                (OUTER_CIRCLE_RADIUS + INNER_CIRCLE_RADIUS)/2, 
                (OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS) * 0.7, 
                (OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS) * 0.7)
            .build();
            sign.append(image);
        }
        // 星座の守護星アイコン
        for(let i = 0; i < 12; i++){
            let image = new RadialImageBuilder(
                CalcAstroBase.svg_gardian_symbol[i], 
                -360 / 12 * i + base - 10, 
                (OUTER_CIRCLE_RADIUS + INNER_CIRCLE_RADIUS)/2, 
                (OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS) * 0.45,
                (OUTER_CIRCLE_RADIUS - INNER_CIRCLE_RADIUS) * 0.45)
            .set('gardian', CalcAstroBase.gardian[i])
            .set('onmouseover', 'dispGardian()')
            .set('onmouseout', 'hideGardian()')
            .build();
            sign.append(image);
        }
    
        // カスプ
        if(setting['house-system']  === "campanus") {
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
        for(let i = 0; i < setting.targets.length; i++) {
            const target = setting.targets[i];
            const elm = bodies[target];
            if(elm) {
                var angle = (180 + elm.longitude - base) * Math.PI/180;
    
                // 天体サイン配置計算
                let dup = 0;
                for(var j = 0; j < layouted.length; j++) {
                    if(!layouted[j]){
                        layouted[j] = [];
                    }
    
                    var hit = false;
                    for(var k = 0; k < layouted[j].length; k++) {
                        let target = layouted[j][k];
                        if(CalcAstroBase.getAngleBetween(elm.longitude, target) < hitArea * Math.pow(1.1,j)) {
                            hit = true;
                            break;
                        }
                    }
                    if(!hit) {
                        dup = j;
                        break;
                    } else {
                        if(!layouted[j+1]) {
                            layouted[j+1] = [];
                        }
                    }
                }

                if(!layouted[dup]){
                    layouted[dup] = [];
                }
                layouted[dup].push(elm.longitude);
                
                let src = SettingUtil.body_list[target].svg;
                let image = new RadialImageBuilder(
                    src, 
                    base - elm.longitude , 
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
                let x = r * Math.cos((base - elm.longitude) * Math.PI / 180) + wPlanets/2;
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
                .set('font-size',  wPlanets / 2)
                .build();
                angles.push(angle_text);
            }
        }

        $.each(angles, function(key, elm) {
            svg.append(elm);
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
            let r = INNER_CIRCLE_RADIUS - (layouted.length + 1) * gapPlanets + 10 * magnify;
            r = Math.max(r, 100);
            let fontSize = r / magnify * Math.PI/9;
            fontSize = Math.max(fontSize, 16);
            let text = new RadialTextBuilder(deg, r, i+1)
            .set('class','symbol')
            .setStroke("#aaa")
            .setFill("#aaa")
            .set('font-size', 16 * magnify)
            .build();
            sign.append(text);
        }

        // アスペクト
        aspects.forEach(function(elm){
            elm.value.forEach(function(data){
                if(data.aspect.display){
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
    draw();
}

/** ハウス情報を取得 */
function getHouse(setting) {
    let house_list = [];
    let calcurator = new HouseCalcurator(setting.getBirthDate(), setting.getLongitude(), setting.getLatitude());
    if(setting['house-system']  === "placidus"){
        return calcurator.getPlacidus();
    } else if(setting['house-system'] === "solar"){
        let sun = bodies.sun;
        let caspdata = {};
        let casps = [];
        for(let i = 1; i <= 12; i++){
            casps.push({angle:sun.longitude + 30 * (i - 1) % 360});
        }
        caspdata.casps = casps;
        return caspdata;
    } else if(setting['house-system']  === "solar-sign"){
        let sun = bodies.sun;
        let base = sun.longitude - sun.longitude % 30;
        let caspdata = {};
        let casps = [];
        for(let i = 1; i <= 12; i++){
            casps.push({angle: base + 30 * (i - 1) % 360});
        }
        caspdata.casps = casps;
        return caspdata;
    } else if(setting['house-system']  === "campanus") {
        return calcurator.getCampanus();
    } else if(setting['house-system']  === "regiomontanus") {
        return calcurator.getRegiomontanus();
    } else if(setting['house-system']  === "koch") {
        return calcurator.getKoch();
    }
    return house_list;

}

/** アスペクトテーブルを作る */
function getAspectTable (aspects){
    // 情報をもとにテーブルを作成
    let aspect_table = document.createElement("table");
    for(let i = 0; i < setting.targets.length; i++) {
        let colgroup = document.createElement('col');
        colgroup.span = 1;
        aspect_table.append(colgroup);
    }
    aspects.forEach(function(elm){
        let row = document.createElement("tr");
        elm.value.forEach(function(pair){
            let cell = document.createElement("td");
            cell.innerHTML = pair.aspect.angle !== null & pair.aspect.angle !== undefined? pair.aspect.angle.toFixed(0) : "";
            cell.setAttribute("style","color:" + (pair.aspect.stroke !== undefined? pair.aspect.stroke: '#fff'));
            cell.setAttribute("data-aspect", JSON.stringify(pair));
            cell.setAttribute("class", "aspect__cell");
            if(pair.aspect.tight) {
                $(cell).addClass('bold');
            }
            if(pair.aspect.diff !== undefined) {
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
    for(let i = 0; i < setting.targets.length; i++) {
        const key = setting.targets[i];
        if(key === 'ASC' || key === 'MC') continue;
        const tr = $('<tr>').appendTo(table);
        const name = SettingUtil.body_list[key].name;
        const data = bodies[key];
        if(data === null || data === undefined){
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
        if(data.longitudeSpeed < 0) {
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
    if(casps.ASC !== undefined){
        ASC = casps.ASC.angle;
    } else {
        ASC = casps.casps[0].angle;
    }
    if(casps.MC !== undefined) {
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

    for(let i = 0; i < casps.casps.length; i++) {
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
    const div4 = [[],[],[],[]];
    for(let i = 0; i < Object.keys(bodies).length; i++) {
        const body = bodies[Object.keys(bodies)[i]];
        const num = (Math.floor(body.longitude / 30)) % 4;
        div4[num].push(SettingUtil.body_list[Object.keys(bodies)[i]]);
    }
    let table = $('<table>');
    let tr1 = $('<tr>').appendTo(table);
    $('<th>').text("火").appendTo(tr1);
    $('<th>').text("地").appendTo(tr1);
    $('<th>').text("風").appendTo(tr1);
    $('<th>').text("水").appendTo(tr1);
    let tr2 = $('<tr>').appendTo(table);
    for(let i = 0; i < div4.length; i++) {
        let td = $('<td>').appendTo(tr2);
        for(let j = 0; j < div4[i].length; j++){
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
    const div3 = [[],[],[]];
    for(let i = 0; i < Object.keys(bodies).length; i++) {
        const body = bodies[Object.keys(bodies)[i]];
        const num = (Math.floor(body.longitude / 30)) % 3;
        div3[num].push(SettingUtil.body_list[Object.keys(bodies)[i]]);
    }
    let table = $('<table>');
    let tr1 = $('<tr>').appendTo(table);
    $('<th>').text("活動宮").appendTo(tr1);
    $('<th>').text("不動宮").appendTo(tr1);
    $('<th>').text("柔軟宮").appendTo(tr1);
    let tr2 = $('<tr>').appendTo(table);
    for(let i = 0; i < div3.length; i++) {
        let td = $('<td>').appendTo(tr2);
        for(let j = 0; j < div3[i].length; j++){
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
    const div2 = [[],[]];
    for(let i = 0; i < Object.keys(bodies).length; i++) {
        const body = bodies[Object.keys(bodies)[i]];
        const num = (Math.floor(body.longitude / 30)) % 2;
        div2[num].push(SettingUtil.body_list[Object.keys(bodies)[i]]);
    }
    let table = $('<table>');
    let tr1 = $('<tr>').appendTo(table);
    $('<th>').text("男性宮").appendTo(tr1);
    $('<th>').text("女性宮").appendTo(tr1);
    let tr2 = $('<tr>').appendTo(table);
    for(let i = 0; i < div2.length; i++) {
        let td = $('<td>').appendTo(tr2);
        for(let j = 0; j < div2[i].length; j++){
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
    const name = event.target.getAttribute('name') ;
    // アスペクトの強調表示
    if($('#display-aspect').prop('checked')) {
        $('.body').css('opacity', 0.1);
        $(event.target).css('opacity', 1);
        $(event.target).css('outline', '1px solid red');
        $('.aspect-line').css('opacity', 0);
        let aspect_bodies = [];
        $('line[node1="' + name + '"]').each(function(key, elm) {
            $(elm).css('opacity', 1);
            $(elm).attr('stroke-width', 2);
            aspect_bodies.push({name:$(elm).attr('node2'), angle: $(elm).attr('angle')});
        })
        $('line[node2="' + name + '"]').each(function(key, elm) {
            $(elm).css('opacity', 1);
            $(elm).attr('stroke-width', 2);
            aspect_bodies.push({name:$(elm).attr('node1'), angle: $(elm).attr('angle')});
        });

        $.each(aspect_bodies, function(key, elm) {
            if(elm.name !== name) {
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

/**
 * 天体にマウスオン or Tap時の挙動
 */
 function onBody() {
    const name = event.target.getAttribute('name') ;
  
    // 天体の詳細表示
    const checked = $('#display-bodydata').prop('checkec');
    const onBodySetting = $('#display-bodydata').val();
  
    if(checked || onBodySetting === 'detail'){
        let div = $('#description');
        $(div).empty();
        let x = event.pageX;
        let y = event.pageY;
        let elm = SettingUtil.body_list[name];
        let body = bodies[name];
        let title = event.target.getAttribute('title') + (body.longitudeSpeed < 0? ' 逆行': '' );
        let house = getHouseNum(body.longitude) + '室';
  
        $('<img class="description__icon">').prop('src',elm.svg).appendTo(div);
        $('<span>').text(title).appendTo(div);
  
        let sign = CalcAstroBase.getSign(body.longitude);
        let time = CalcAstroBase.deg2time(body.longitude % 30);
        let sign_str = sign + ' ' + time;
        $('<div>').text(`${sign_str} ${house}`).appendTo(div);
  
        let sabian = SabianUtil.getSabianString(body.longitude);
        $('<div>').text(sabian).appendTo(div);
  
        div.css('display', 'block');
        if(event.clientX > window.innerWidth - div.width()) {
            div.css('left', x - div.width() - 10)
        } else {
            div.css('left', x + 16);
        }
        if(event.clientY > window.innerHeight - div.height()) {
            div.css('top', y - div.height() - 5);
        } else {
            div.css('top', y + 5);
        }
    } else {
        if(onBodySetting === 'name') {
            let div = $('#description');
            $(div).empty();
            let x = event.pageX;
            let y = event.pageY;
            let elm = SettingUtil.body_list[name];
            let title = event.target.getAttribute('title');
    
            $('<img class="description__icon">').prop('src',elm.svg).appendTo(div);
            $('<span>').text(title).appendTo(div);
    
            div.css('display', 'block');
            if(event.clientX > window.innerWidth - div.width()) {
                div.css('left', x - div.width() - 10)
            } else {
                div.css('left', x + 16);
            }
            if(event.clientY > window.innerHeight - div.height()) {
                div.css('top', y - div.height() - 5);
            } else {
                div.css('top', y + 5);
            }
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
    for(let i = 0; i < 11; i++) {
        let deg1 = (casps.casps[i].angle - base + 360) % 360;
        let deg2 = (casps.casps[i+1].angle - base + 360) % 360;
        if(deg >= deg1 && deg <= deg2) {
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
    if(aspect.aspect.angle !== null) {
        let node1 = SettingUtil.body_list[aspect.node1.name].name;
        let node2 = SettingUtil.body_list[aspect.node2.name].name;
        let body1 = bodies[aspect.node1.name];
        let body2 = bodies[aspect.node2.name];
        let sign1 = CalcAstroBase.getSign(body1.longitude);
        let sign2 = CalcAstroBase.getSign(body2.longitude);
        let house1 = getHouseNum(body1.longitude);
        let house2 = getHouseNum(body2.longitude);
        let data1 = node1 + ':' + sign1 + ' ' + house1 + '室';
        let data2 = node2 + ':' + sign2 + ' ' + house2 + '室';
        
        let div =  $('#aspect-data');
        div.empty();
        $('<div>').text(data1).appendTo(div);
        $('<div>').text(data2).appendTo(div);
        $('<div>').text(aspect.aspect.angle.toFixed(0) + '°:' + aspect.aspect.name).appendTo(div);

        div.css('display', 'block');
        if(event.clientX > window.innerWidth - div.width()) {
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
$('#plus').click(function() {
    if(magnify < 2) {
        magnify += 0.2;
    }
    if(magnify > 1.8) {
        $('#plus').prop('disabled', true);
    }
    $('#minus').prop('disabled', false);

    localStorage.setItem('magnify', magnify);

    draw();
});
$('#minus').click(function() {
    if(magnify > 1) {
        magnify -= 0.2;
    }
    if(magnify < 1.2) {
        $('#minus').prop('disabled', true);
    }
    $('#plus').prop('disabled', false);

    localStorage.setItem('magnify', magnify);

    draw();
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

/**
 * 内側の円の設定を現在日時に変更する
 */
 function setNow() {
    var now = new Date();
    var date = now.getFullYear() + "/" + ("0" + (now.getMonth() + 1)).slice(-2) + "/" + ("0" + now.getDate()).slice(-2);
    $('#birth-date').datepicker('setDate', date);
    $('#birth-hour').val(now.getHours());
    $('#birth-min').val(now.getMinutes());
    changeSetting();
}

function switchSettingOpen() {
    if(setting_open) {
        $('#setting').addClass('setting__hide')
        $('#btn_hide').text('表示');
    } else {
        if(confirm('設定内容を表示しますか？')) {
            $('#setting').removeClass('setting__hide')
            $('#btn_hide').text('隠す');
        } else {
            return;
        }
    }
    setting_open = !setting_open;
}