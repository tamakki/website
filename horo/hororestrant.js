let caluclator;
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
    calculator.house_system = "placidus";

    let aspect_table = calculator.getAspectTable();

    let natal_chart = calculator.getNatalChart();
    document.getElementById("chart").innerHTML = "";
    document.getElementById("chart").append(natal_chart);
}

function init(){
    calcHoro();
}