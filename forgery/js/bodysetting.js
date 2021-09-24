$(function() {
    // チェックボックスの作成
    makeMainPlanets();
    makeLunar();
    makeBig4Planets();
    makeCentaur();
    makeMinor7();
    makeUranian();
    makeMusa();
    makeMoira();
    makeOther();
    initValue();
    $(document).on('change', '.body', changeValue);
    $(document).on('change', '.all', changeAll);
});

/** 主要天体のチェックボックスを作る */
function makeMainPlanets() {
    makeInputArea('主要天体', 'main');
}
/** 月関係のチェックボックスを作る */
function makeLunar() {
    makeInputArea('月関係', 'lunar');
}

/** 四大小惑星のチェックボックスを作る　*/
function makeBig4Planets() {
    makeInputArea('四大小惑星', 'big4');
}

/** ケンタウルス族のチェックボックスを作る */
function makeCentaur() {
    makeInputArea('ケンタウルス族', 'centaur');
}
/** マイナー小惑星7天体のチェックボックスをt作る */
function makeMinor7() {
    makeInputArea('マイナー小惑星7天体', 'minor7');
}

/** ウラニアンのチェックボックスを作る */
function makeUranian() {
    makeInputArea('ウラニアン', 'uranian');
}

/** ムーサ9柱のチェックボックスを作る */
function makeMusa() {
    makeInputArea('ムーサ9柱', 'musa');
}

/** 運命の三女神モイライのチェックボックスを作る */
function makeMoira() {
    makeInputArea('運命の三女神', 'moira')
}

/** その他のチェックボックスを作る */
function makeOther() {
    makeInputArea('その他', 'other');
}

function makeInputArea(title, tag) {
    const main = $('<section>').addClass('category').appendTo('#inputs');
    const h2 = $('<h2>').appendTo(main);
    const label = $('<label>').appendTo(h2);
    $('<input type="checkbox">').addClass('all').val(tag).appendTo(label);
    $('<span>').text(title).appendTo(label);
    const main__div = $('<div>').appendTo(main);
    $.each(SettingUtil.body_list, function(key, value) {
        if(value.tag === tag) {
            main__div.append(makeInput(key,value,tag));
        }
    });
}

/**
 * チェックボックスを作る
 * @param {string} key 
 * @param {any} value 
 */
function makeInput(key,value,tag) {
    const div = $('<div>');
    const label = $('<label>').appendTo(div);
    const check = $('<input type="checkbox">').val(key).addClass('body').addClass(tag).appendTo(label);
    label.append(check);
    const text = $('<span>').text(value.name).appendTo(label);
    const svg = $('<img>');
    svg.prop('src', value.svg);
    svg.addClass('icon');
    text.append(svg);
    label.append(text);
    div.append(label);
    return div;
}

/**
 * 設定を読み込んで反映する
 */
function initValue() {
    const setting = SettingUtil.getSetting();
    $.each(setting.targets, function(key, value) {
        $('input[value="' + value + '"]').prop('checked', true);
    });
    $.each(setting['targets-all'], function(key, value) {
        $('input[value="' + value + '"]').prop('checked', true);
    });
}

/**
 * 設定の変更を反映する
 */
function changeValue(event) {
    if(event) {
        // チェックの整理
        const section = $(event.target).closest('section');
        $(section).find('.all').prop('checked',$(section).find('.body').length === $(section).find('.body:checked').length);
    }

    let targets = [];
    $('.body:checked').each(function(key, elm){
        targets.push($(elm).val());
    });
    let targets_all = [];
    $('.all:checked').each(function(key, elm) {
        targets_all.push($(elm).val());
    });
    const setting = SettingUtil.getSetting();
    setting.targets = targets;
    setting['targets-all'] = targets_all;
    SettingUtil.saveSetting(setting);
}

/**
 * 同じ種類の全チェックを変更
 * @param {any} elm 
 */
function changeAll(event) {
    let checked = $(event.target).prop('checked');
    $(event.target).closest('section').find('.body').each(function(key, elm){
        $(elm).prop('checked', checked);
    });
    changeValue();
}