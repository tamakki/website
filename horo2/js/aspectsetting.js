function init() {
    // 入力欄を作ろう
    const setting = SettingUtil.getSetting();
    const table = $('<table>').appendTo('#setting');
    const header1 = $('<tr class="header">').appendTo(table);
    $('<th rowspan="2">').text('角度').appendTo(header1);
    $('<th rowspan="2">').text('アスペクト').appendTo(header1);
    $('<th rowspan="2">').text('表示').appendTo(header1);
    $('<th colspan="2">').text('主要天体同士').appendTo(header1);
    $('<th colspan="2">').text('小惑星等').appendTo(header1);
    const header2 = $('<tr class="header">').appendTo(table);
    $('<th>').text('タイト').appendTo(header2)
    $('<th>').text('ルーズ').appendTo(header2)
    $('<th>').text('タイト').appendTo(header2)
    $('<th>').text('ルーズ').appendTo(header2)
    const major = $('<tr class="body">').appendTo(table);
    $('<td colspan="7">').text('メジャーアスペクト').appendTo(major);
    const keys = Object.keys(setting.aspectsetting);
    for(let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const aspect = setting.aspectsetting[key];
        if(!aspect.isMajor) {
            continue
        }
        const tr = $('<tr class="body">').appendTo(table);
        $('<th>').text(aspect.angle.toFixed(0) + '°').appendTo(tr);
        $('<th>').text(key).addClass(aspect.color).appendTo(tr);
        const disp = $('<td>').appendTo(tr);
        $('<input type="checkbox">').prop('id', key).prop('checked', aspect.display).appendTo(disp);
        const orb1 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '-orb-major-tight').val(aspect.orb.major.tight).appendTo(orb1);
        const orb2 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '-orb-major-loose').val(aspect.orb.major.loose).appendTo(orb2);
        const orb3 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '-orb-minor-tight').val(aspect.orb.minor.tight).appendTo(orb3);
        const orb4 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '-orb-minor-loose').val(aspect.orb.minor.loose).appendTo(orb4);
    }
    const minor = $('<tr class="body">').appendTo(table);
    $('<td colspan="7">').text('マイナーアスペクト').appendTo(minor);
    for(let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const aspect = setting.aspectsetting[key];
        if(aspect.isMajor) {
            continue
        }
        const tr = $('<tr class="body">').appendTo(table);
        $('<th>').text(aspect.angle.toFixed(0) + '°').appendTo(tr);
        $('<th>').text(key).addClass(aspect.color).appendTo(tr);
        const disp = $('<td>').appendTo(tr);
        $('<input type="checkbox">').prop('id', key).prop('checked', aspect.display).appendTo(disp);
        const orb1 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '-orb-major-tight').val(aspect.orb.major.tight).appendTo(orb1);
        const orb2 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '-orb-major-loose').val(aspect.orb.major.loose).appendTo(orb2);
        const orb3 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '-orb-minor-tight').val(aspect.orb.minor.tight).appendTo(orb3);
        const orb4 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '-orb-minor-loose').val(aspect.orb.minor.loose).appendTo(orb4);
    }

    $(document).on('change', 'input', onchange);
    $(document).on('click', 'tr', onclick);
}

// 設定変更時イベント
function onchange() {
    const elm = event.target;
    const setting = SettingUtil.getSetting();
    if($(elm).attr('type') === 'checkbox') {
        setting.aspectsetting[$(elm).prop('id')].display = $(elm).prop('checked');
    } else {
        const props = $(elm).prop('id').split('-');
        setting.aspectsetting[props[0]][props[1]][props[2]][props[3]] = $(elm).val();
    }

    SettingUtil.saveSetting(setting);
}

function onclick() {
    $('tr').removeClass('active');
    $(event.target).closest('tr').addClass('active');
}

// 初期化処理
init();