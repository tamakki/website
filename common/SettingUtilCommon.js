function makeSetting() {
    makeMainPlanets();
    makeLunar();
    makeBig4Planets();
    makeCentaur();
    makeMinor7();
    makeMusa();
    makeMoira();
    makeGreek();
    makeRoman();
    makeUranianVirtual();
    makeOther();
    makeVirtualPoint();
    makePerson();
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

function makeInputArea(title, tag) {
    const main = $('<section>').addClass('category').appendTo('#body_setting__inputs');
    const h2 = $('<h2>').appendTo(main);
    const label = $('<label>').appendTo(h2);
    $('<input type="checkbox">').addClass('all').val(tag).appendTo(label);
    $('<span class="body_section__title">').html(title).appendTo(label);
    const main__div = $('<div>').appendTo(main);
    $.each(SettingUtil.body_list, function(key, value) {
        if(value.tag.includes(tag)) {
            main__div.append(makeInput(key,value,tag));
        }
    });
}

/**
 * 設定を読み込んで反映する
 */
function initValue() {
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
    if(event) {
        document.querySelectorAll(`input[value="${event.target.value}"]`).forEach(elm => elm.checked = event.target.checked);
    }

    let targets = [];
    $('.body:checked').each(function(key, elm){
        if(!targets.includes(elm.value)) targets.push($(elm).val());
    });
    let targets_all = [];
    $('.all:checked').each(function(key, elm) {
        targets_all.push($(elm).val());
    });
    setting.targets = targets;
    setting['targets-all'] = targets_all;
}


/**
 * 同じ種類の全チェックを変更
 * @param {any} elm 
 */
 function changeAll(event) {
    let checked = $(event.target).prop('checked');
    Object.entries(SettingUtil.body_list).filter(elm => {
        return elm[1].tag.includes(event.target.value)
    }).forEach(elm => {
        document.querySelectorAll(`input[value="${elm[0]}"]`).forEach(elm => elm.checked = checked);
    });
    changeValue();
}

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

/** ローマ神話のチェックボックスを作る */
function makeRoman() {
    makeInputArea('ローマ神話', 'roman');
}

/** ムーサ9柱のチェックボックスを作る */
function makeMusa() {
    makeInputArea('ムーサ9柱', 'musa');
}

/** 運命の三女神モイライのチェックボックスを作る */
function makeMoira() {
    makeInputArea('運命の三女神', 'moira');
}

/** ギリシャ神話のチェックボックスを作る */
function makeGreek() {
    makeInputArea('ギリシャ神話', 'greek');
}

function makeUranianVirtual() {
    makeInputArea('ウラニアン 架空天体', 'uranianVirtual');
}

/** その他のチェックボックスを作る */
function makeOther() {
    makeInputArea('その他', 'other');
}

/** 架空点のチェックボックスを作る */
function makeVirtualPoint() {
  makeInputArea('架空点', 'virtualPoint');
}

/** 現代の人物のチェックボックスを作る */
function makePerson() {
  makeInputArea('現代の人物', 'person');
}

SettingUtil.body_list = {
    // 主要天体
    'ASC': {
        'name': "ASC",
        'tag': ['main'],
        'svg': '../svg/ASC.svg'
    },
    'MC': {
        'name': "MC",
        'tag': ['main'],
        'svg': '../svg/MC.svg'
    },
    'sun': {
        'name': '太陽',
        'tag': ['main'],
        'svg': '../svg/sun.svg'
    },
    'moon': {
        'name': '月',
        'tag': ['main'],
        'svg': '../svg/moon.svg'
    },
    'mercury': {
        'name': '水星',
        'tag': ['main'],
        'svg': '../svg/mercury.svg'
    },
    'venus': {
        'name': '金星',
        'tag': ['main'],
        'svg': '../svg/venus.svg'
    },
    'mars': {
        'name': '火星',
        'tag': ['main'],
        'svg': '../svg/mars.svg'
    },
    'jupiter': {
        'name': '木星',
        'tag': ['main'],
        'svg': '../svg/jupiter.svg'
    },
    'saturn': {
        'name': '土星',
        'tag': ['main'],
        'svg': '../svg/saturn.svg'
    },
    'uranus': {
        'name': '天王星',
        'tag': ['main'],
        'svg': '../svg/uranus.svg'
    },
    'neptune': {
        'name': '海王星',
        'tag': ['main'],
        'svg': '../svg/neptune.svg'
    },
    'pluto': {
        'name': '冥王星',
        'tag': ['main'],
        'svg': '../svg/pluto.svg'
    },
    // 月関係
    'mean_node': {
        'name': 'ドラゴンヘッド（ミーン）',
        'tag': ['lunar'],
        'svg': '../svg/mean_node.svg'
    },
    'true_node': {
        'name': 'ドラゴンヘッド（トゥルー）',
        'tag': ['lunar'],
        'svg': '../svg/true_node.svg'
    },
    'mean_apogee': {
        'name': 'ブラックムーンリリス（ミーン）',
        'tag': ['lunar'],
        'svg': '../svg/mean_black_moon.svg'
    },
    'intp_apogee': {
        'name': 'ブラックムーンリリス（トゥルー）',
        'tag': ['lunar'],
        'svg': '../svg/true_black_moon.svg'
    },
    // 小惑星
    // 4大小惑星
    'vesta': {
        'name': 'ヴェスタ',
        'tag': ['big4'],
        'svg': '../svg/vesta.svg'
    },
    'juno': {
        'name': 'ジュノー',
        'tag': ['big4'],
        'svg': '../svg/juno.svg'
    },
    'ceres': {
        'name': 'セレス',
        'tag': ['big4'],
        'svg': '../svg/ceres.svg'
    },
    'pallas': {
        'name': 'パラス',
        'tag': ['big4'],
        'svg': '../svg/pallas.svg'
    },
    // ケンタウルス族
    'asbolus': {
        'name': 'アスボルス',
        'tag': ['centaur'],
        'svg': '../svg/asbolus.svg'
    },
    'ixion': {
        'name': 'イクシオン',
        'tag': ['centaur'],
        'svg': '../svg/ixion.svg'
    },
    'elatus': {
        'name': 'エラタス',
        'tag': ['centaur'],
        'svg': '../svg/elatus.svg'
    },
    'okyrhoe': {
        'name': 'オキロエ',
        'tag': ['centaur'],
        'svg': '../svg/okyrhoe.svg'
    },
    'chariklo': {
        'name': 'カリクロー',
        'tag': ['centaur'],
        'svg': '../svg/chariklo.svg'
    },
    'cyllarus': {
        'name': 'キルラルス',
        'tag': ['centaur'],
        'svg': '../svg/cyllarus.svg'
    },
    'chiron': {
        'name': 'キロン',
        'tag': ['centaur', 'minor7'],
        'svg': '../svg/chiron.svg'
    },
    'damocles': {
        'name': 'ダモクレス',
        'tag': ['centaur'],
        'svg': '../svg/damocles.svg'
    },
    'tantalus': {
        'name': 'タンタロス',
        'tag': ['centaur'],
        'svg': '../svg/tantalus.svg'
    },
    'bienor': {
        'name': 'ビエノール',
        'tag': ['centaur'],
        'svg': '../svg/bienor.svg'
    },
    'hylonome': {
        'name': 'ヒュロノメ',
        'tag': ['centaur'],
        'svg': '../svg/hylonome.svg'
    },
    'pholus': {
        'name': 'フォルス',
        'tag': ['centaur', 'minor7'],
        'svg': '../svg/pholus.svg'
    },
    'nessus': {
        'name': 'ネッスス',
        'tag': ['centaur'],
        'svg': '../svg/nessus.svg'
    },
    // マイナー小惑星7天体
    'isis': {
        'name': 'イシス',
        'tag': ['minor7'],
        'svg': '../svg/isis.svg'
    },
    'varuna': {
        'name': 'ヴァルナ',
        'tag': ['minor7'],
        'svg': '../svg/varuna.svg'
    },
    'osiris': {
        'name': 'オシリス',
        'tag': ['minor7'],
        'svg': '../svg/osiris.svg'
    },
    'mithra': {
        'name': 'ミスラ',
        'tag': ['minor7'],
        'svg': '../svg/mithra.svg'
    },
    'lilith': {
        'name': 'リリス（小惑星）',
        'tag': ['minor7'],
        'svg': '../svg/lilith.svg'
    },
    // ムーサ9柱
    'kalliope': {
        'name': 'カリオペ',
        'tag': ['musa'],
        'svg': '../svg/kalliope.svg'
    },
    'klio': {
        'name': 'クリオ',
        'tag': ['musa'],
        'svg': '../svg/klio.svg'
    },
    'euterpe': {
        'name': 'エウテルペ',
        'tag': ['musa'],
        'svg': '../svg/euterpe.svg'
    },
    'thalia': {
        'name': 'タリア',
        'tag': ['musa'],
        'svg': '../svg/thalia.svg'
    },
    'melpomene': {
        'name': 'メルポメネ',
        'tag': ['musa'],
        'svg': '../svg/melpomene.svg'
    },
    'terpsichore': {
        'name': 'テルプシコレ',
        'tag': ['musa'],
        'svg': '../svg/terpsichore.svg'
    },
    'erato': {
        'name': 'エラト',
        'tag': ['musa'],
        'svg': '../svg/erato.svg'
    },
    'polyhymnia': {
        'name': 'ポリヒムニア',
        'tag': ['musa'],
        'svg': '../svg/polyhymnia.svg'
    },
    'urania': {
        'name': 'ウラニア',
        'tag': ['musa'],
        'svg': '../svg/urania.svg'
    },
    // モイラ
    ['moira']: {
        'name': 'モイラ',
        'tag': ['moira'],
        'svg': '../svg/moira.svg'
    },
    'klotho': {
        'name': 'クロト',
        'tag': ['moira'],
        'svg': '../svg/klotho.svg'
    },
    'lachesis': {
        'name': 'ラケシス',
        'tag': ['moira'],
        'svg': '../svg/lachesis.svg'
    },
    'atropos': {
        'name': 'アトロポス',
        'tag': ['moira'],
        'svg': '../svg/atropos.svg'
    },
    // ギリシャ神話
    'astraea': {
        'name': 'アストラエア',
        'tag': ['greek'],
        'svg': '../svg/astraea.svg'
    },
    'admetos': {
        'name': 'アドメトス',
        'tag': ['greek', 'uranianVirtual'],
        'svg': '../svg/admetos.svg'
    },
    'apollon': {
        'name': 'アポロン',
        'tag': ['greek', 'uranianVirtual'],
        'svg': '../svg/apollon.svg'
    },
    'icarus': {
        'name': 'イカルス',
        'tag': ['greek'],
        'svg': '../svg/icarus.svg'
    },
    'eris': {
        'name': 'エリス',
        'tag': ['greek'],
        'svg': '../svg/eris.svg'
    },
    'eros': {
        'name': 'エロス',
        'tag': ['greek'],
        'svg': '../svg/eros.svg'
    },
    'kronos': {
        'name': 'クロノス',
        'tag': ['greek', 'uranianVirtual'],
        'svg': '../svg/kronos.svg'
    },
    'zeus': {
        'name': 'ゼウス',
        'tag': ['greek', 'uranianVirtual'],
        'svg': '../svg/zeus.svg'
    },
    'daphne' : {
        'name': 'ダフネ',
        'tag': ['greek'],
        'svg': '../svg/daphne.svg'
    },
    'hades': {
        'name': 'ハデス',
        'tag': ['greek', 'uranianVirtual'],
        'svg': '../svg/hades.svg'
    },
    'pandora': {
        'name': 'パンドラ',
        'tag': ['greek'],
        'svg': '../svg/pandra.svg'
    },
    'hygiea': {
        'name': 'ヒギエア',
        'tag': ['greek'],
        'svg': '../svg/hygiea.svg'
    },
    'hekate': {
        'name': 'ヘカテ',
        'tag': ['greek'],
        'svg': '../svg/hekate.svg'
    },
    'poseidon': {
        'name': 'ポセイドン',
        'tag': ['greek', 'uranianVirtual'],
        'svg': '../svg/poseidon.svg'
    },
    // ローマ神話
    'valkanus': {
        'name': 'ヴァルカヌス',
        'tag': ['roman', 'uranianVirtual'],
        'svg': '../svg/valkanus.svg'
    },
    'orcus': {
        'name': 'オルカス',
        'tag': ['roman'],
        'svg': '../svg/orcus.svg'
    },
    'cupido': {
        'name': 'クピド',
        'tag': ['roman', 'uranianVirtual'],
        'svg': '../svg/cupido.svg'
    },
    'sedna': {
        'name': 'セドナ',
        'tag': ['roman'],
        'svg': '../svg/sedna.svg'
    },
    'bacchus': {
        'name' : 'バッカス',
        'tag': ['roman'],
        'svg': '../svg/bacchus.svg'
    },
    // その他
    'alexandra': {
        'name': 'アレクサンドラ',
        'tag': ['other'],
        'svg': '../svg/alexandra.svg'
    },
    'anpanman': {
      'name': 'アンパンマン',
      'tag': ['other'],
      'svg': '../svg/anpanman.svg'
    },
    'quaoar': {
        'name': 'クアオアー',
        'tag': ['other'],
        'svg': '../svg/quaoar.svg'
    },
    'merlin': {
        'name': 'マーリン',
        'tag': ['other'],
        'svg': '../svg/merlin.svg'
    },
    'karma': {
        'name': 'カルマ',
        'tag': ['other'],
        'svg': '../svg/karma.svg'
    },
    'sappho': {
        'name': 'サッフォー',
        'tag': ['other'],
        'svg': '../svg/sappho.svg'
    },
    'takoyaki': {
        'name': 'たこやき',
        'tag': ['other'],
        'svg': '../svg/takoyaki.svg'
    },
    // 架空天体
    'part of fortune': {
      'name': 'ﾊﾟｰﾄｵﾌﾞﾌｫｰﾁｭﾝ',
      'tag': ['virtualPoint'],
      'svg': '../svg/part_of_fortune.svg'
    },
    'vertex': {
      'name': 'ﾊﾞｰﾃｯｸｽ',
      'tag': ['virtualPoint'],
      'svg': '../svg/vertex.svg'
    },
    // 現代の人物
    'hideakianno': {
      'name': '庵野秀明',
      'tag': ['person'],
      'svg': '../svg/hideakianno.svg'
    },
    'tezuka': {
      'name': '手塚治虫',
      'tag': ['person'],
      'svg': '../svg/tezuka.svg'
    },
    'kinokonasu': {
      'name': '奈須きのこ',
      'tag': ['person'],
      'svg': '../svg/kinokonasu.svg'
    },
    'miyazakihayao': {
      'name': '宮崎駿',
      'tag': ['person'],
      'svg': '../svg/miyazakihayao.svg'
    },
    'yanase': {
      'name': 'やなせたかし',
      'tag': ['person'],
      'svg': '../svg/yanase.svg'
    },
}
