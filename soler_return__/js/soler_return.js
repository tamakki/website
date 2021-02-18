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

    if(document.getElementById("flag").checked){
        setTimeout(function(){
            let now = new Date(document.getElementById("birthday").value);
            let time = document.getElementById("birthtime").value.split(":");
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            document.getElementById("birthday").value = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) ;
            calcHoro();
        }, 1);
    }
}


function init(){
    setTargetYears();
}