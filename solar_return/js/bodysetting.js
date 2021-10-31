$(function() {
    // チェックボックスの作成
    makeSetting();
    initValue();
    $(document).on('change', '.body', changeValue);
    $(document).on('change', '.all', changeAll);
});
