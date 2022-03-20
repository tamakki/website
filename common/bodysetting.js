

/** 県リスト */
const prefecture_list = [
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

// 拡大縮小ボタン
$('#plus').click(function() {
    if(magnify < 2) {
        magnify += 0.2;
    }
    if(magnify > 1.8) {
        $('#plus').prop('disabled', true);
    }
    $('#minus').prop('disabled', false);

    localStorage.setItem('magnify_double', magnify);

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

    localStorage.setItem('magnify_double', magnify);

    draw();
});

$(function() {
    // チェックボックスの作成
    $(document).on('change', '#body_setting', changeValue);
    $(document).on('change', '.all', changeAll);
});


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

        if($("#setting_name").val()) {
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
    if(settings && settings.saved != null && Object.keys(settings.saved).length > 0) {
        let keys = Object.keys(settings.saved);
        $("#load_setting_list").empty();
        for(let i = 0; i < keys.length; i++) {
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
    if(settings.saved[target]) {
        setting = new Setting(JSON.stringify(settings.saved[target]));
        $("#name").val(target);
        initSetting();
        $.modal.close();
        calc();
    }
});
$(document).on("click", ".delete_setting", () => {
    let elm = $(event.target);
    let target = elm.data("name");

    if(confirm(target + " を削除してよろしいですか？")) {
        let settings = JSON.parse(localStorage.getItem(SettingUtil.setting_key));
        delete settings.saved[target];
        localStorage.setItem(SettingUtil.setting_key, JSON.stringify(settings));
        let keys = Object.keys(settings.saved);
        $("#load_setting_list").empty();
        for(let i = 0; i < keys.length; i++) {
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

$(document).on('focus', 'input[type="number"]', () => {
    event.target.select();
});