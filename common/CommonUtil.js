import {Canvg} from "https://cdn.skypack.dev/canvg";

function CommonUtil(){}

/**
 * svgをblobに変換する
 * @param {*} svg svgElement
 * @returns blob 画像のバイナリ
 */
CommonUtil.Svg2Blob = async (svg) => {
    let svgData = new XMLSerializer().serializeToString(svg);
    let canvas = document.createElement("canvas");
    canvas.width = svg.width.baseVal.value;
    canvas.height = svg.height.baseVal.value;
    let ctx = canvas.getContext("2d");
    let v = await Canvg.fromString(ctx, svgData);
    await v.render();

    return await new Promise(resolve => canvas.toBlob(resolve));
}

/**
 * DOMを画像に変換する
 * @param {*} element DOM要素
 * @returns blob 画像のバイナリ
 */
CommonUtil.Element2Blob = async (element) => {
    const padding = 10;
    let src = await new Promise( resolve => {
        domtoimage.toPng(element).then(url => resolve(url));
    })
    let canvas = await new Promise(resolve => {

        let image = new  Image();
        image.onload = function() {
            let canvas = document.createElement("canvas");
            canvas.width = element.clientWidth + padding * 2;
            canvas.height = element.clientHeight + padding * 2;
            let ctx = canvas.getContext("2d");

            ctx.beginPath();
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
        
            ctx.beginPath();
            ctx.drawImage(image, padding, padding);
            resolve(canvas);
        }
        image.src = src;
    });

    return await new Promise(resolve => canvas.toBlob(resolve));
}

/**
 * ホロスコープを共有する
 * @param {*} message
 * @param {*} url 
 * @param {*} files 
 */
CommonUtil.Share = (message, url, files) => {
    navigator.share({
        text: message,
        url: url,
        files: files
    });
}

window.CommonUtil = CommonUtil;