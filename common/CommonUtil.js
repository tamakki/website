import {Canvg} from "https://cdn.skypack.dev/canvg";

function CommonUtil(){}

/**
 * svgを画像に変換する
 * @params svg {node} 変換元のDOM要素
 * @returns {blob} 変換後の画像
 */
CommonUtil.Share = async (svg) => {
    let svgData = new XMLSerializer().serializeToString(svg);
    let canvas = document.createElement("canvas");
    canvas.width = svg.width.baseVal.value;
    canvas.height = svg.height.baseVal.value;

    let ctx = canvas.getContext("2d");
    let v = await Canvg.fromString(ctx, svgData);
    await v.render();
    canvas.toBlob(function(blob) {
        const imageFile = new File([blob], "image.png", {type: "image/png"});
        navigator.share({
            text: "ホロスコープ",
            url: "https://tamakki.github.io/website/horo_index.html",
            files: [imageFile]
        }).then(() => {
            console.log("せいこう");
        });
    }, "image/png");
}

window.CommonUtil = CommonUtil;