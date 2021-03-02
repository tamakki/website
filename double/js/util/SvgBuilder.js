const DEFAULT_FILL = '#fff';
const DEFAULT_STROKE = '#000';
const DEFAULT_STROKE_WIDTH = '1px';

/**
 * SVGビルダ
 * @constructor
 * @param {string} type 要素タイプ
 */
let SvgBuilder = function(type){
    this.type = type;
    this.attribute_list = [
        {'name':'fill', 'value': DEFAULT_FILL},
        {'name':'stroke', 'value': DEFAULT_STROKE},
        {'name':'stroke-width', 'value': DEFAULT_STROKE_WIDTH},
    ];
    this.xlink_attribute_list = [];
}

/**
 * 属性設定
 * @param {string} attr_name 属性名
 * @param {string} value 値
 * @returns {SvgBuilder} ビルダ
 */
SvgBuilder.prototype.set = function(attr_name, value){
    this.attribute_list.push({'name':attr_name, 'value': value});
    return this;
}

SvgBuilder.prototype.setXlink = function(attr_name, value){
    this.xlink_attribute_list.push({'name': attr_name, 'value': value});
}

/**
 * 塗りつぶしの色を設定
 * @param {string} value 塗りつぶしの色
 * @returns {SvgBuilder} ビルダ
 */
SvgBuilder.prototype.setFill = function(value){
    return this.set('fill', value);
}

/**
 * 描画線の色設定
 * @param {string} value 描画線の色設定値
 * @returns {SvgBuilder} ビルダ
 */
SvgBuilder.prototype.setStroke = function(value){
    return this.set('stroke', value);
}
/**
 * 描画線の太さ設定
 * @param {string} value 描画線の設定値
 * @returns {SvgBuilder} ビルダ
 */
SvgBuilder.prototype.setStrokeWidth = function(value){
    return this.set('stroke-width', value);
}

/**
 * 回転の設定
 * @param {number} deg 回転角[deg]
 * @param {number} x 中心座標のＸ値[px]
 * @param {number} y 中心座標のＹ値[px]
 * @returns {SvgBuilder} ビルダ
 */
SvgBuilder.prototype.rotate = function(deg, x, y){
    if(x === undefined && y === undefined){
        this.set('transform', 'rotate(' + deg + ')');
    }
    else {
        this.set('transform', 'rotate(' + deg + ' ' + x + ' ' + y + ')');
    }
    return this;
}

SvgBuilder.prototype.setId = function(id){
    return this.set(id);
}

/**
 * 要素の生成
 * @returns {Element} 生成したＳＶＧ要素
 */
SvgBuilder.prototype.build = function() {
    // 要素の作成
    let element = document.createElementNS('http://www.w3.org/2000/svg', this.type);
    // 属性の設定
    this.attribute_list.forEach(function(attr){
        element.setAttributeNS(null, attr.name, attr.value);
    });
    this.xlink_attribute_list.forEach(function(attr){
        element.setAttributeNS('http://www.w3.org/1999/xlink', attr.name, attr.value);
    })
    return element;
}

/**
 * 円ビルダ
 * @constructor
 */
let CircleBuilder = function(){
    SvgBuilder.call(this,'circle');
    this.set('cx',0);
    this.set('cy',0);
}

/**
 * 円の半径を設定
 * @param {number} 半径[px]
 * @returns {CircleBuilder} ビルダ
 */
CircleBuilder.prototype.setRadius = function(radius){
    return this.set('r', radius);
}

Object.setPrototypeOf(CircleBuilder.prototype, SvgBuilder.prototype);

/**
 * 弧ビルダ
 * @param {number} x 中心座標x 
 * @param {number} y 中心座標y 
 * @param {number} r 半径 
 * @param {number} start 開始角度[deg] 
 * @param {number} end 終了角度[deg]
 * 反時計回りに描画する
 */
let ArcBuilder = function(x,y,r,start,end) {
    while(start > 360){
        start -= 360;
    }
    while(start < 0) {
        start += 360;
    }
    while(end > 360){
        end -= 360;
    }
    while(end < 0){
        end += 360;
    }
    SvgBuilder.call(this, 'path');
    let radStart = start * Math.PI / 180;
    let radEnd = end * Math.PI / 180;
    let x1 = x + r * Math.cos(radStart);
    let y1 = y + r * Math.sin(radStart);
    let x2 = x + r * Math.cos(radEnd);
    let y2 = y + r * Math.sin(radEnd);
    let dx = x2 - x1;
    let dy = y2 - y1;
    let f1 = (start > end ? end + 360: end) - start > 180? 1 : 0;
    let f2 = 1;
    let d = "M " + x1 + " " + y1 + " a " + r + " " + r + " " + start + " " + f1 + " " + f2 + " " + dx + " " + dy;
    this.set("d", d);
}

Object.setPrototypeOf(ArcBuilder.prototype, SvgBuilder.prototype);

/**
 * 放射状の線
 * @constructor
 * @param {number} angle 角度[deg]
 * @param {number} start 開始位置（中心からの距離）
 * @param {number} end 終了位置（中心からの距離） 
 * @param {number} angle_end 終了位置の角度オフセット
 */
let RadialLineBuilder = function(angle, start, end, angle_end){
    if(isNaN(angle_end)){
        angle_end = angle;
    }
    SvgBuilder.call(this, 'line');
    let rad = angle * Math.PI / 180;
    let rad_end = angle_end * Math.PI / 180;
    if(end === undefined){
        end = 0;
    }
    this.set('x1', Math.cos(rad) * start);
    this.set('y1', Math.sin(rad) * start);
    this.set('x2', Math.cos(rad_end) * end);
    this.set('y2', Math.sin(rad_end) * end);
}

Object.setPrototypeOf(RadialLineBuilder.prototype, SvgBuilder.prototype);

/**
 * 放射状に配置するテキスト
 * @constructor
 * @param {number} angle 角度[deg]
 * @param {number} position 中心からの距離
 * @param {string} text 表示する文字列
 */
let RadialTextBuilder = function(angle, position, text){
    SvgBuilder.call(this, 'text');
    let rad = angle * Math.PI / 180;
    this.set('fill' ,'#000');
    this.set('stroke', 'none');
    this.set('stroke-width', 0);
    this.set('text-anchor', 'middle');
    this.set('dominant-baseline','central');
    this.set('x', Math.cos(rad) * position);
    this.set('y', Math.sin(rad) * position);
    this.set('text-length', 3);
    this.set('transform', 'rotate(' + (angle + 90) + ' ' + (Math.cos(rad) * position) + ' ' +(Math.sin(rad) * position) + ')');
    if(text.length > 1){
        this.set('font-size','9');
    }
    this.text = text;
}

/**
 * テキストのビルド
 * @returns {element} テキスト要素
 */
RadialTextBuilder.prototype.build = function(){
    let elm = SvgBuilder.prototype.build.call(this);
    elm.innerHTML = this.text;
    return elm;
}

Object.setPrototypeOf(RadialTextBuilder.prototype, SvgBuilder.prototype);

/**
 * グループの作成
 * @constructor
 */
let GroupBuilder = function(){
    SvgBuilder.call(this,'g');
    this.attribute_list = [];
}

Object.setPrototypeOf(GroupBuilder.prototype, SvgBuilder.prototype);

/**
 * 画像オブジェクトビルダ
 * @param {string} src 
 */
let ImageBuilder = function(src){
    SvgBuilder.call(this, 'image');
    this.setXlink('href', src);
}
Object.setPrototypeOf(ImageBuilder.prototype, SvgBuilder.prototype);

/**
 * 放射状に配置する画像
 * @param {string} src 画像パス
 * @param {number} angle 角度[deg] 
 * @param {number} position 中心からの距離 
 * @param {number} width 画像幅
 * @param {number} height 画像高さ
 */
let RadialImageBuilder = function(src, angle, position, width, height){
    SvgBuilder.call(this, 'image');
    this.attribute_list = [];
    let rad = angle * Math.PI / 180;
    this.setXlink('href', src);
    this.set('x', -width * 0.5);
    this.set('y', -height * 0.5);
    this.set('width',width);
    this.set('height',height);
    this.set('transform', 'translate(' + (Math.cos(rad) * position) + ' ' + (Math.sin(rad) * position) + ')' );
}
Object.setPrototypeOf(RadialImageBuilder.prototype, SvgBuilder.prototype);

/**
 * アスペクトの線
 * @param {*} radius 
 * @param {*} angle1 
 * @param {*} angle2 
 */
let AspectLineBuilder = function(radius, angle1, angle2){
    SvgBuilder.call(this, 'line');
    let rad1 = angle1 * Math.PI / 180;
    let rad2 = angle2 * Math.PI / 180;
    let x1 = Math.cos(rad1) * radius;
    let y1 = Math.sin(rad1) * radius;
    let x2 = Math.cos(rad2) * radius;
    let y2 = Math.sin(rad2) * radius;
    this.set('x1', x1);
    this.set('y1', y1);
    this.set('x2', x2);
    this.set('y2', y2);
    this.setStrokeWidth(0.5);
}
Object.setPrototypeOf(AspectLineBuilder.prototype, SvgBuilder.prototype);

/**
 * ポリゴン
 * @param {Array({x,y})} points 座標列
 */
let PolygonBuilder = function(points) {
    SvgBuilder.call(this, 'polygon');
    let points_str = points[0].x + ',' + points[0].y;
    for(let i = 1; i < points.length; i++) {
        points_str += ' ' + points[i].x + ',' + points[i].y;
    }
    this.set('points', points_str);
}
Object.setPrototypeOf(PolygonBuilder.prototype, SvgBuilder.prototype);
