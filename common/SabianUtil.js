const sabians = [
    "ある女が水から上がり、アザラシも上がって彼女を抱きしめる",
    "一座の人々を楽しませているあるコメディアン",
    "輪郭が彼の祖国の形をしているある男のカメオの横顔",
    "隔絶された散歩道を歩いていく恋人同士",
    "翼のある三角形",
    "一辺が明るく照らされた正方形",
    "いちどにふたつの領域で自分をうまく表現しているひとりの男",
    "風になびくリボンのついた大きな鍔広帽子、東を向いている",
    "水晶占い師",
    "古い象徴に対応する新しい形を教える男",
    "国の支配者",
    "野生の雁の群れ",
    "失敗した爆弾の爆破",
    "男と女の近くでとぐろを巻いているヘビ",
    "毛布を織るインディアン",
    "沈む夕日の中で踊っているブラウニーたち",
    "ふたりのきちんとした老嬢たち",
    "からっぽのハンモック",
    "魔法の絨毯",
    "冬に鳥たちに餌を与える若いむすめ",
    "リングに上がる拳闘士",
    "欲望の庭への門",
    "重たく価値があるが中身の見えない荷物を運ぶパステルカラーの服を着た女",
    "開いた窓とコルヌコピアの形にふくらむレースのカーテン",
    "二重の約束",
    "抱えきれないほど多くの贈り物を所持する男",
    "想像の中で取り戻される失われた機会",
    "大勢の落胆した聴衆",
    "歌っている天上の聖歌隊",
    "アヒル池とそこのアヒルたち",
    "山の清流",
    "電気的な嵐",
    "クローバーの咲いている草地へ向かう足取り",
    "虹の黄金の壺",
    "開いた墓の前にいる未亡人",
    "ある峡谷に建設中の橋",
    "サマリアの女",
    "雪のない橇",
    "飾りつけられたクリスマスツリー",
    "赤十字の看護師",
    "花に水をやっている女",
    "ウィンドウショッピングをする人たち",
    "荷物を取り扱う男",
    "這いまわる貝類と遊んでいるこどもたち",
    "マフラーをしっかりと巻き、しゃれたシルクハットをかぶった男",
    "大いなる神秘を解き明かそうとむなしく試みるある老いた男",
    "剣の集団と松明の集団の戦い",
    "窓の外へバッグを差し出している女",
    "ある新たに形作られる大陸",
    "雲をあつめ吹き散らす風",
    "ある開いた本を指し示す一本の指",
    "荒波を超える白いハト",
    "ある宝飾品店",
    "剥ぎとった毛髪付きの頭皮を持ち馬にまたがったインディアン",
    "ある大きな手入れの行き届いた公園",
    "自分の恋人にセレナーデを歌うスペイン男",
    "ビーズを売るインディアンの女",
    "おとなのロマンスに求められるある女",
    "同じテーブルで作業しているふたりの靴直し職人",
    "古代の芝生を練り歩く一羽のクジャク",
    "静水に浮かぶ一艘のガラス底ボート",
    "こっそりと靴下を満たすサンタクロース",
    "テュイルリー庭園",
    "ヒイラギとヤドリギ",
    "ある過激な雑誌",
    "石油の掘削",
    "ある古風な井戸",
    "ある産業ストライキ",
    "矢でいっぱいの矢筒",
    "下降する飛行機",
    "体験における現実主義のある新しい道",
    "生意気に自分の意見を口に出すトプシーのような少女",
    "自分のピアノの前にいるある偉大な音楽家",
    "テレパシーの会話",
    "会話をしているふたりのオランダ人のこども",
    "熱弁を振るうある女性参政権運動家",
    "知的な頭へと溶け込む健康的な頭",
    "中国語を話すふたりの中国人の男",
    "一冊の大きな古代の本",
    "あるカフェテリア",
    "労働者のデモ",
    "バーン・ダンス（大きな納屋で行われるダンスパーティ）",
    "ある木の高いところにあるひとつの巣の中の三羽の雛鳥",
    "氷の上でスケートをするこどもたち",
    "ヤシの木々を剪定する男",
    "森の冬霜",
    "森から出てくるひとりのジプシー",
    "破産宣告を受けたひとりの男",
    "春の最初のマネシツグミ",
    "水着の美女たち",
    "ある船に掲げられた、ひとつは巻かれもうひとつは広げられた旗",
    "広く水平な場所の上に吊り下げられた男",
    "全身を毛皮にすっかりくるみ、毛深いシカをつれている男",
    "ネズミと議論しているネコ",
    "列車に破壊された自動車",
    "巣作りをしている猟鳥たち",
    "月明りの夜のふたりの妖精",
    "服を着て練り歩くウサギたち",
    "魚をつかまえようと水中へ手をのばす小さな裸のむすめ",
    "完全には研磨されきっていない大きなダイアモンド",
    "しかめっ面をする道化師",
    "あるメッセージを持つ赤ん坊を世話している中国人の女性",
    "わずかに丸められ、とても目立つ親指のついた片手",
    "北東の広く暗い空間と向き合っているとても老いた男",
    "食べすぎを楽しんだ人々の一団",
    "手書きの巻物を携えて広場の前にいるひとりの男",
    "知識と生命に育つ胚珠",
    "自分の雛たちのために地面をほじくっている一羽の雌鶏",
    "結婚式を執り行う司祭",
    "同じセレナーデを口々に歌うゴンドラ乗りたち",
    "歌っているプリマドンナ",
    "ヨットを待っている女",
    "ある文学会の会合",
    "南に面した陽の当たる土地にいるひとりの女とふたりの男",
    "右肩に突然投げかけられた暗い影あるいはマント",
    "贅沢に満足と幸せを感じながら、長椅子で読書をする人々",
    "ある渓谷での嵐",
    "現代版ポカホンタス",
    "双子の重さを量っているミューズ",
    "アメリカ革命の娘たち（アメリカ建国婦人会）の一会員",
    "脳溢血の一症例",
    "おたふく風邪の流行",
    "髪をボブカットにしたある女",
    "正装した男と角を折られたシカ",
    "絶壁の縁にある岩石層",
    "ある古風なおとなの女と流行最先端の若い娘",
    "空の星座たち",
    "ボリシェヴィキの宣伝者",
    "ガラス吹きたち",
    "早朝の朝露",
    "あるオークの大木のひとつのブランコに乗ったこどもたち",
    "ある宵の芝生パーティ",
    "前後に揺れている老いた船長",
    "表現の機会を待ち望む人間の魂",
    "ページェント",
    "ある嵐の直後の陽光",
    "ある非正規の教会聖歌隊",
    "ある化学教師",
    "ハウスボートのパーティ",
    "ズニ族の太陽崇拝者たち",
    "酩酊したニワトリたち",
    "一羽の伝書鳩",
    "ある裸馬乗り",
    "だらしない、身なりを整えていない男",
    "砂漠をわたる一頭の大きなラクダ",
    "（ある）虹",
    "夜明け",
    "ある大きな木の一本の枝にとまっている沢山の小鳥たち",
    "一匹の人魚",
    "封をされていない一通の手紙",
    "ある男の頭",
    "うちたてられた一本の大きな十字架",
    "保護をもたらす二天使",
    "白人のこどもたちと遊んでいるある黒人のこども",
    "妖精たちの夢を見ている男",
    "ある回転木馬",
    "あるハーレム",
    "はじめてのダンス指導",
    "未来派の絵を描くひとりの男",
    "暗がりの先を見ようとのりだしたふたつの頭",
    "母親の息子への切望に沿って象られたひとりの少年",
    "ヴェールをはぎとられた花嫁",
    "政治的ヒステリーをおさえ込むある力強い手",
    "ある家系図",
    "装飾用のハンカチーフ",
    "一頭のオランウータン",
    "噴火する火山",
    "ウィジャ盤",
    "競泳",
    "自動車のキャラバン",
    "女の子のバスケットボールチーム",
    "ある王家の紋章",
    "ある動物調教師",
    "メリーさんと彼女の白い子ヒツジ",
    "半旗",
    "振り香炉を持つ男の子",
    "お茶会の貴婦人たち",
    "ある禿頭の男",
    "読んでいる書類から秘密の知識を得るひとりの男",
    "緊急の業務に注意を向けていて聞こえなかった一本の間違い電話",
    "一筋の針を刺されることにより完全にされた一匹の蝶",
    "第七の光へ変化する第六種族の光",
    "新しい一日の夜明け、すべてが変わった",
    "キャンプファイアを囲むあるグループ",
    "真の内的知識を教えているひとりの男",
    "ある男の豊かに結晶した理想たち",
    "ヒヨコたちに餌をやり、タカから守っている女",
    "あるうちすてられた家の中で燃えさかる暖炉",
    "あるアートギャラリーにかかっている三枚の巨匠の名画（オールド・マスターズ）",
    "危険な水域を通り安全な場所へ至りつつある一艘のカヌー",
    "眼鏡の縁越しに見つめる教授",
    "ある鉱山から出てくる鉱山労働者たち",
    "しゃぼん玉をふくらませているこどもたち",
    "真昼のシエスタ",
    "円環状の道",
    "流されてしまった船着場",
    "（ある）引退した船長",
    "逮捕されたふたりの男",
    "かくれている強盗の一味",
    "（ある）ユダヤ教のラビ",
    "海辺の群衆",
    "噴水で鳥たちに飲み水を与えているこども",
    "シャンティクリア（雄鶏）",
    "ある蝶の左側に生えている三枚目の翅",
    "ひとひらの枯葉という象徴による情報",
    "互いにもう片方の姿に変わる一羽のワシと一羽の大きな白いハト",
    "頭上に浮かんでいる飛行機",
    "明るくなる影響のさなかにいるひとりの男",
    "知識の広がりに橋をかけようとしている人類",
    "ある哲学者の頭にある三つの知識の山",
    "観光バス",
    "割れた壜とこぼれた香水",
    "棟上げ",
    "火のついたロウソクを捧げ持つ若者",
    "ある巨大な、岩だらけの岸辺",
    "ゴールドラッシュ",
    "深海潜水士たち",
    "湖上に輝きわたる月",
    "歯科の仕事",
    "親睦団体の夕食会",
    "救助される溺れかけた男",
    "ある大使館の舞踏会",
    "実験をしている発明家",
    "作業中の電話工事士たち",
    "五つの砂山のまわりで遊ぶこどもたち",
    "突然笑顔になるある少女の顔",
    "我が子の父である女",
    "秋色で豊かに彩られた森",
    "聴き入り、それから喋る一羽のオウム",
    "二枚の暗い色のカーテンをかき分けているある女",
    "職務放棄する一兵士",
    "カモたちに近寄る猟師たち",
    "妖精に姿を変える一羽の子ウサギ",
    "ひとりの男の話に耳を傾けるために山をおりてくる人々",
    "エックス線",
    "キャンプを設営するインディアンたち",
    "行進中のある軍楽隊",
    "自分の領土へ近づく妖精王",
    "酋長に自分のこどもたちの命乞いをするあるインディアンの女",
    "ハロウィーンの浮かれ騒ぎ",
    "共和国の偉大なる軍隊（※南北戦争北軍側の退役軍人会）のキャンプファイア",
    "白い三角波で覆われた大洋",
    "チェスをするふたりの男",
    "歩くことを学んでいるある幼児",
    "ある木の高いところにいる一羽の老いたフクロウ",
    "クリケットの試合",
    "ドアをノックするキューピッド",
    "岩々とその中で形をとりつつあるものたち",
    "自分のこどもたちを連れて階段にいる母親",
    "金髪の好機の女神",
    "左側の寺院にある身体的悟りのランプ",
    "ときの声をあげるワシに変わる旗",
    "明るみに出されるある未亡人の過去",
    "ピラミッド群とスフィンクス",
    "自分の影を探しているグラウンドホッグ",
    "一艘の船を見張っているカモメたち",
    "復活祭の日の出の礼拝",
    "サンボンネットをかぶったちいさなこどもたち",
    "すみかを移動するペリカンたち",
    "氷を切り出す男たち",
    "借りた眼鏡をかけたひとりのこどもと一匹の犬",
    "ある中国人の洗濯屋",
    "入国する移民たち",
    "家のドアのところに立っている一羽のブルーバード（ルリツグミ）",
    "おもちゃの馬にまたがったぽっちゃりした男の子",
    "ある旗手",
    "ある彫刻家",
    "ある美しい流れの上にかかっている古い橋",
    "芝生を刈る太った男の子",
    "教皇",
    "承認を強く求めるあるインディアンの酋長",
    "三枚のステンドグラス窓、一枚が爆撃で損なわれている",
    "成長と理解に対して受容的な人間の魂",
    "一艘の大きなカヌーへ乗り込む一行",
    "カヌーを漕ぎ戦いのダンスを踊るインディアンたち",
    "ひとすじの暗いアーチに覆われた道とそのそこにある十本の丸太",
    "ヴェールに包まれた力ある預言者",
    "家の中で幸せそうに歌っている鳥たち",
    "ハープをたずさえる天使",
    "手から餌をもらう一羽のアホウドリ",
    "キジの大群",
    "自然学講義の一学徒",
    "（ある）火の崇拝者",
    "花崗岩に刻まれた古代の浅浮彫り",
    "ある病院の小児病棟にある沢山のおもちゃ",
    "体操着を着た少年少女たち",
    "ひそかに裸で水浴びをするひとりの少女",
    "ユニオンジャック",
    "大きな買い物袋を持っている五歳くらいのこども",
    "歌っている隠れた聖歌隊",
    "リレー競走",
    "敗北をいさぎよく受け入れる将軍",
    "戦争での勇敢さに対するふたつの賞",
    "女子修道院へ入るひとりの女",
    "東洋の敷物商",
    "（ある）水の精",
    "山の巡礼行",
    "大きな養鳥場",
    "お茶の葉占いをしている女",
    "ある秘密のビジネス会議",
    "ある古い日干し煉瓦の伝道所",
    "予期せぬ雷雨",
    "海軍からの（ある）脱艦兵",
    "（ある）ヒンドゥ教の治療師",
    "先祖たちの評議会",
    "ある神秘劇の出演者",
    "卵からうまれた（ひとりの）こども",
    "美しく着飾らせられた蝋人形たち",
    "一羽のワシに変じる旗",
    "一時的なものであると判明した人気",
    "自分の霊感と向き合っているひとりの男",
    "だんだんに上へゆく階段の上にいる人々",
    "気圧計",
    "トンネルへ入ろうとしている列車",
    "同じ垣根にとまっている二羽のボタンインコ",
    "自分の席にいるある大実業家",
    "見張りをしている一頭の番犬",
    "仮面を剥がされたある男",
    "鎮火される山火事",
    "一羽の大きな白いハト、メッセージの担い手",
    "ある失望し幻滅した女",
    "こどもたちが遊ぶために床に敷かれた一枚の敷物",
    "腰をおろして手足をすべて振っている一頭の大きなクマ",
    "自分の情熱に背を向け、自分の体験から教える男",
    "右翅がより完全なかたちをしている一匹の蝶",
    "液体比重計",
    "スミレで満たされた古代の焼き物のボウル",
    "切り倒されのこぎりで挽かれる一本の木",
    "さなぎから出てくる蝶",
    "花の咲いているアーダスの野原",
    "ある公設市場",
    "猟師たちから隠れている一匹のリス",
    "石化した森",
    "ある細い地峡での交通渋滞",
    "ある教会のバザー",
    "ドレスパレードをする将校たち",
    "岩々の上に横たわる一本の十字架",
    "らっぱを吹く少女",
    "ある騎手",
    "雲の中の飛行士",
    "光明を探し求める人々",
    "入門者たちの試験",
    "ある博物館にある一振の剣",
    "キツネの毛皮をまとったある貴婦人",
    "部下たちの教練を準備している将校",
    "霊感の流れ",
    "復活祭の遊歩道",
    "ある巨大なテント",
    "自分の教え子を指導する師匠",
    "夕食の支度がされたテーブル",
    "一頭の小さな白い子羊、ひとりのこども、そしてひとりの中国人の召使",
    "シナイ山から新しい立法をたずさえ降りてくるひとりの男",
    "スピリティストの現象",
    "人の住んでいる島",
    "聖職者の追放",
    "自らの影響を分かつ新月",
    "収穫の満月",
    "満月のもとの豊かな庭",
    "プリズム",
    "巨大な岩の顔",
];

/** サビアンユーティリティクラス */
const SabianUtil = function () {

}

/**
 * サビアン文字列の取得
 * @param {number} deg 黄経[deg] 
 */
SabianUtil.getSabianString = function (deg) {
    while (deg < 0) {
        deg += 360;
    }
    deg %= 360;
    const sign = CalcAstroBase.signs[Math.floor(deg / 30)];
    const deg_display = Math.floor(deg % 30) + 1;
    const sabian = sabians[Math.floor(deg)];
    return `${sign}[${deg_display}] ${sabian}`;
}

/**
 * サビアンシンボルのみ取得
 * @param {*} deg 
 */
SabianUtil.getSabianSymbol = function (deg) {
    while (deg < 0) {
        deg += 360;
    }
    deg %= 360;
    return sabians[Math.floor(deg)];
}

SabianUtil.getSabianDeg = function (deg) {
    const sign = CalcAstroBase.signs[Math.floor(deg / 30)];
    const deg_display = Math.floor(deg % 30) + 1;
    return `${sign}[${deg_display}]`;
}