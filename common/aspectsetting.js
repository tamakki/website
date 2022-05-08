function init_obe_setting(target) {
    // 選択肢
    const header = $('<div class="obe_setting__header" id="obe_setting__header">').appendTo('#aspect_setting__inputs');
    const select_setting = $('<select id="aspect_settings_target">').appendTo(header).on('change', () => {
        const target = $(event.target).val();
        $('#aspect_setting__inputs').empty();
        init_obe_setting(target);
    });
    $('<option>').val('other').text('その他').appendTo(select_setting);

    if(setting.indivisuals) {
        for(key in setting.indivisuals) {
            $('<option>').val(key).prop('selected', key === target).text(SettingUtil.body_list[key].name).appendTo(select_setting);
        }
    }
    const add_button = $('<button class="add_indivisual__button">').text('個別の設定を追加').appendTo(header);
    $(add_button).on('click', add_indivisual);
    if(target && target !== 'othre') {
        $('<button>').text('この設定を削除').on('click', () => {
            delete setting.indivisuals[target];
            $('#aspect_setting__inputs').empty();
            init_obe_setting();
        }).appendTo(header);
    }
    // 汎用設定
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
        const aspect = (setting.indivisuals && setting.indivisuals[target])? setting.indivisuals[target].aspectsetting[key] : setting.aspectsetting[key];
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
        const aspect = (setting.indivisuals && setting.indivisuals[target])? setting.indivisuals[target].aspectsetting[key] : setting.aspectsetting[key];
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
    const target = $('#aspect_settings_target').val();
    if(target === 'other') {
        if($(elm).attr('type') === 'checkbox') {
            setting.aspectsetting[$(elm).prop('id')].display = $(elm).prop('checked');
        } else {
            const props = $(elm).prop('id').split('_');
            setting.aspectsetting[props[0]][props[1]][props[2]][props[3]] = parseFloat($(elm).val());
        }
    } else {    
        if($(elm).attr('type') === 'checkbox') {
            setting.indivisuals[target].aspectsetting[$(elm).prop('id')].display = $(elm).prop('checked');
        } else {
            const props = $(elm).prop('id').split('_');
            setting.indivisuals[target].aspectsetting[props[0]][props[1]][props[2]][props[3]] = parseFloat($(elm).val());
        }
    }
}

function click_obe_setting() {
    $('tr').removeClass('active');
    $(event.target).closest('tr').addClass('active');
}

function add_indivisual() {
    const select = $('<select id="indivisual_setting_target">');
    for(key in SettingUtil.body_list) {
        if(setting.indivisuals && setting.indivisuals[key]) continue;
        const body = SettingUtil.body_list[key];
        $('<option>').val(key).text(body.name).appendTo(select);
    }
    select.appendTo($('#obe_setting__header'));
    $('<button class="add_indivisual__button">').text('追加').on('click', add_indivisual_setting).appendTo($('#obe_setting__header'));
}

function add_indivisual_setting() {
    const target = $('#indivisual_setting_target').val();
    if(!setting.indivisuals) {
        setting.indivisuals = {};
    }
    setting.indivisuals[target] = {
        aspectsetting: JSON.parse(JSON.stringify(aspectSettingDefault))
    }
    $('#aspect_setting__inputs').empty();
    init_obe_setting(target);
}

const aspectSettingDefault = {
    Conjunction: {
        display: true,
        isMajor: true,
        angle: 0,
        color: 'hard',
        orb: {
            major: { tight: 3, loose: 5 },
            minor: { tight: 1, loose: 3 }
        }
    },
    "Semi-Square": {
        display: true,
        isMajor: true,
        angle: 45,
        color: 'hard',
        orb: {
            major: { tight: 3, loose: 5 },
            minor: { tight: 1, loose: 3 }
        }
    },
    "Semi-Sextile": {
        display: true,
        isMajor: false,
        angle: 30,
        color: 'soft',
        orb: {
            major: { tight: 2, loose: 4 },
            minor: { tight: 1, loose: 2 }
        }
    },
    Decile: {
        display: true,
        isMajor: false,
        angle: 36,
        color: 'soft',
        orb: {
            major: { tight: 2, loose: 4 },
            minor: { tight: 1, loose: 2 }
        }
    },
    Novaile: {
        display: true,
        isMajor: false,
        angle: 40,
        color: 'soft',
        orb: {
            major: { tight: 2, loose: 4 },
            minor: { tight: 1, loose: 2 }
        }
    },
    Septile: {
        display: true,
        isMajor: false,
        angle: 360 / 7,
        color: 'hard',
        orb: {
            major: { tight: 2, loose: 4 },
            minor: { tight: 1, loose: 2 }
        }
    },
    Sextile: {
        display: true,
        isMajor: true,
        angle: 60,
        color: 'soft',
        orb: {
            major: { tight: 3, loose: 5 },
            minor: { tight: 1, loose: 3 }
        }
    },
    Quintile: {
        display: true,
        isMajor: true,
        angle: 72,
        color: 'soft',
        orb: {
            major: { tight: 3, loose: 5 },
            minor: { tight: 1, loose: 3 }
        }
    },
    Square: {
        display: true,
        isMajor: true,
        angle: 90,
        color: 'hard',
        orb: {
            major: { tight: 3, loose: 5 },
            minor: { tight: 1, loose: 3 }
        }
    },
    Trine: {
        display: true,
        isMajor: true,
        angle: 120,
        color: 'soft',
        orb: {
            major: { tight: 3, loose: 5 },
            minor: { tight: 1, loose: 3 }
        }
    },
    "Sesqui-square": {
        display: true,
        isMajor: false,
        angle: 135,
        color: 'hard',
        orb: {
            major: { tight: 2, loose: 4 },
            minor: { tight: 1, loose: 2 }
        }
    },
    Biquintile: {
        display: true,
        isMajor: false,
        angle: 144,
        color: 'soft',
        orb: {
            major: { tight: 2, loose: 4 },
            minor: { tight: 1, loose: 2 }
        }
    },
    Inconjunct: {
        display: true,
        isMajor: false,
        angle: 150,
        color: 'hard',
        orb: {
            major: { tight: 2, loose: 4 },
            minor: { tight: 1, loose: 2 }
        }
    },
    Opposition: {
        display: true,
        isMajor: true,
        angle: 180,
        color: 'hard',
        orb: {
            major: { tight: 3, loose: 5 },
            minor: { tight: 1, loose: 3 }
        }
    },
}