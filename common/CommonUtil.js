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
 * DOMを画像にへんかんする
 * @param {*} element DOM要素
 * @returns blob 画像のバイナリ
 */
CommonUtil.Element2Blob = async (element) => {
    return await new Promise(resolve => {
        html2canvas(element).then((canvas) => {
            canvas.toBlob(resolve);
        })
    });
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