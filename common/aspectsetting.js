function init_obe_setting() {
    // 入力欄を作ろう
    const table = $('<table>').appendTo('#aspect_setting__inputs');
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
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '_orb_major_tight').val(aspect.orb.major.tight).appendTo(orb1);
        const orb2 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '_orb_major_loose').val(aspect.orb.major.loose).appendTo(orb2);
        const orb3 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '_orb_minor_tight').val(aspect.orb.minor.tight).appendTo(orb3);
        const orb4 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '_orb_minor_loose').val(aspect.orb.minor.loose).appendTo(orb4);
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
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '_orb_major_tight').val(aspect.orb.major.tight).appendTo(orb1);
        const orb2 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '_orb_major_loose').val(aspect.orb.major.loose).appendTo(orb2);
        const orb3 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '_orb_minor_tight').val(aspect.orb.minor.tight).appendTo(orb3);
        const orb4 = $('<td>').appendTo(tr);
        $('<input type="number" min="0" max="10" step="0.1" inputmode="decimal">').prop('id', key + '_orb_minor_loose').val(aspect.orb.minor.loose).appendTo(orb4);
    }

    $(document).on('change', '#aspect_setting__inputs input', change_obe_setting);
    $(document).on('click', '#aspect_setting__inputs tr', click_obe_setting);
}

// 設定変更時イベント
function change_obe_setting() {
    const elm = event.target;
    if($(elm).attr('type') === 'checkbox') {
        setting.aspectsetting[$(elm).prop('id')].display = $(elm).prop('checked');
    } else {
        const props = $(elm).prop('id').split('_');
        setting.aspectsetting[props[0]][props[1]][props[2]][props[3]] = parseFloat($(elm).val());
    }
}

function click_obe_setting() {
    $('tr').removeClass('active');
    $(event.target).closest('tr').addClass('active');
}
