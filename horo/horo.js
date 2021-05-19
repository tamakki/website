let caluclator;
let timer;
function calcHoro() {
    let input_date = document.getElementById("birthday").value;
    let input_time = document.getElementById("birthtime").value;
    let latitude = parseFloat(document.getElementById("latitude").value);
    let longitude = parseFloat(document.getElementById("longitude").value);
    let time_diff = parseFloat(document.getElementById("time_diff").value);

    let hasError = false;
    if(!input_date){
        alert("誕生日を入力してください");
        hasError = true;
    }
    if(!input_time){
        alert("日時を入力してください");
        hasError = true;
    }
    if(isNaN(latitude)){
        alert("緯度を入力してください");
        hasError = true;
    }
    if(Math.abs(latitude) > 90) {
        alert("緯度の値が不正です");
        hasError = true;
    }
    if(isNaN(longitude)){
        alert("経度を入力してください");
        hasError = true;
    }
    if(Math.abs(longitude) > 180){
        alert("経度の値が不正です");
        hasError = true;
    }

    if(hasError){
        return;
    }

    // 誕生日
    let time_string = ("0" + Math.abs(time_diff)).slice(-2);
    let time_diff_string = (time_diff >= 0 ? "+":"-") + time_string + ":00";
    let birth_date = new Date(input_date + "T" + input_time + time_diff_string);

    calculator = new HoroscopeCalculator(birth_date, time_diff, longitude, latitude);
    calculator.house_system = document.querySelector('#house_system').value;

    let element_table = calculator.getLayoutTable();
    document.getElementById("data").innerHTML = "";
    document.getElementById("data").append(element_table);

    let casp_table = calculator.getCaspTable();
    document.getElementById("casps").innerHTML = "";
    document.getElementById("casps").append(casp_table);

    let aspect_table = calculator.getAspectTable();

    document.getElementById("aspect").innerHTML = "";
    document.getElementById("aspect").append(aspect_table);

    let natal_chart = calculator.getNatalChart();
    document.getElementById("chart").innerHTML = "";
    document.getElementById("chart").append(natal_chart);

    calculator = null;
}

function getForecast() {
    let input_date = document.getElementById("birthday").value;
    let input_time = document.getElementById("birthtime").value;
    let latitude = parseFloat(document.getElementById("latitude").value);
    let longitude = parseFloat(document.getElementById("longitude").value);
    let time_diff = parseFloat(document.getElementById("time_diff").value);
    let time_string = ("0" + Math.abs(time_diff)).slice(-2);
    let time_diff_string = (time_diff >= 0 ? "+":"-") + time_string + ":00";
    let birth_date = new Date(input_date + "T" + input_time + time_diff_string);
    calculator = new HoroscopeCalculator(birth_date, time_diff, longitude, latitude);

    calculator.display_setting = [
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
    ];

    let eventList = calculator.getForecast();

    let field = document.getElementById("forcast_result");
    field.textContent = "";
    let list = document.createElement("ul");
    eventList.forEach(function(event){
        let item = document.createElement("li");
        item.textContent = event;
        list.append(item);
    });
    field.append(list);
}

function init(){
    calcHoro();
}

/**
 * 逆再生
 */
function reverse() {
    document.getElementById("btn_play").disabled = true;
    document.getElementById("btn_advance").disabled = true;
    document.getElementById("btn_back").disabled = true;
    document.getElementById("btn_reverse").disabled = true;
    var play_duration = parseInt(document.getElementById("play_duration").value);
    timer = setInterval(back, play_duration);
}

/**
 * 一コマ戻る
 */
 function back() {
    let play_diff = parseInt(document.getElementById("play_diff").value);
    let now = new Date(document.getElementById("birthday").value);
    let time = document.getElementById("birthtime").value.split(":");
    now.setHours(time[0]);
    now.setMinutes(time[1]);
    now = new Date(now.getTime() - play_diff);
    document.getElementById("birthday").value = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) ;
    document.getElementById("birthtime").value= ('0' + now.getHours()).slice(-2) + ':' + ("0" + now.getMinutes()).slice(-2);
    calcHoro();
}

/**
 * 停止
 */
function stop(){
    document.getElementById("btn_play").disabled = false;
    document.getElementById("btn_advance").disabled = false;
    document.getElementById("btn_back").disabled = false;
    document.getElementById("btn_reverse").disabled = false;
    clearInterval(timer);
}

/**
 * 一コマ進む
 */
function advance() {
    let play_diff = parseInt(document.getElementById("play_diff").value);
    let now = new Date(document.getElementById("birthday").value);
    let time = document.getElementById("birthtime").value.split(":");
    now.setHours(time[0]);
    now.setMinutes(time[1]);
    now = new Date(now.getTime() + play_diff);
    document.getElementById("birthday").value = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) ;
    document.getElementById("birthtime").value= ('0' + now.getHours()).slice(-2) + ':' + ("0" + now.getMinutes()).slice(-2);
    calcHoro();
}

/**
 * 再生
 */
function play() {
    document.getElementById("btn_play").disabled = true;
    document.getElementById("btn_advance").disabled = true;
    document.getElementById("btn_back").disabled = true;
    document.getElementById("btn_reverse").disabled = true;
    var play_duration = parseInt(document.getElementById("play_duration").value);
    timer = setInterval(advance, play_duration);
}

/**
 * 誕生日時に現在日時を入れる
 */
function setNow() {
    var now = new Date();
    var date = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    var time = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);
    document.getElementById("birthday").value = date;
    document.getElementById("birthtime").value = time;
}