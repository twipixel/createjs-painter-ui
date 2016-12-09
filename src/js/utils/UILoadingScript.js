this.ss = this.ss || {};
this.nts = this.nts || {};
this.images = this.images || {};
this.stage = this.stage || new createjs.Stage('painter-panel');

(function () {
    'use strict';

    var c = createjs;
    var canvasW = stage.canvas.width;
    var canvasH = stage.canvas.height;

    var queue = new c.LoadQueue();
    queue.on('fileload', handleFileLoad, this);
    queue.on('complete', handleLoadComplete, this, true);
    queue.setMaxConnections(8);
    queue.loadFile({src: 'assets/Assets_atlas_.json', type: 'spritesheet', id: 'Assets_atlas_'}, true);
    queue.loadManifest(lib.properties.manifest);

    /* 로딩 속도 개선 (이미지 어셋을 전부 Spritesheets 로 옮겼습니다.)
    queue.loadManifest([

        // Slider
        {src: 'img/graph_picker.png', id: 'SliderKnob'},
        {src: 'img/graph_normal.png', id: 'SliderTrack'},
        {src: 'img/graph_gradation.png', id: 'SliderTrackGradient'},

        // ScreenToneButton
        {src: 'img/screentone_1.png', id: 'ScreenToneIcon1'},
        {src: 'img/screentone_2.png', id: 'ScreenToneIcon2'},
        {src: 'img/screentone_3.png', id: 'ScreenToneIcon3'},
        {src: 'img/screentone_4.png', id: 'ScreenToneIcon4'},
        {src: 'img/screentone_5.png', id: 'ScreenToneIcon5'},
        {src: 'img/screentone_6.png', id: 'ScreenToneIcon6'},

        // PenSizeDisplayer
        {src: 'img/preview_frame2.png', id: 'PenSizeDisplayerBg'},

        // HueBar
        {src: 'img/color_choice_1_bg.png', id: 'HueBar'},
        {src: 'img/color_choice_1.png', id: 'HueBarSelector'},

        // HSVPalette
        {src: 'img/color_choice_2.png', id: 'HSVPaletteSelector'},
        {src: 'img/colorpicker_overlay_gradient.png', id: 'HSVPaletteOverlayGradient'},

        // LayerButton
        {src: 'img/tab_layer1.png', id: 'ButtonTab1Normal'},
        {src: 'img/tab_layer1_selected.png', id: 'ButtonTab1Selected'},
        {src: 'img/tab_layer2.png', id: 'ButtonTab2Normal'},
        {src: 'img/tab_layer2_selected.png', id: 'ButtonTab2Selected'},
        {src: 'img/ic_layer_off_normal.png', id: 'IconLayerVisibleOff'},
        {src: 'img/ic_layer_on_normal.png', id: 'IconLayerVisibleOn'},
        {src: 'img/ic_layer_on_selected.png', id: 'IconLayerVisibleSelected'},

        // Spoid Button
        {src: 'img/btn_spoid_normal.png', id: 'ButtonSpoidNormal'},
        {src: 'img/btn_spoid_selected.png', id: 'ButtonSpoidSelected'},

        // New Button
        {src: 'img/gnb_btn_newdoc.png', id: 'ButtonNewNormal'},
        {src: 'img/gnb_btn_newdoc.png', id: 'ButtonNewSelected'},

        // Open Button
        {src: 'img/gnb_btn_open.png', id: 'ButtonOpenNormal'},
        {src: 'img/gnb_btn_open.png', id: 'ButtonOpenSelected'},

        // Temporary Save Button
        {src: 'img/gnb_btn_save.png', id: 'ButtonTempSaveNormal'},
        {src: 'img/gnb_btn_save.png', id: 'ButtonTempSaveSelected'},

        // Upload Button
        {src: 'img/gnb_btn_publish.png', id: 'ButtonUploadNormal'},
        {src: 'img/gnb_btn_publish.png', id: 'ButtonUploadSelected'},

        // Undo Button
        {src: 'img/btn_back_normal.png', id: 'ButtonUndoNormal'},
        {src: 'img/btn_back_pressed.png', id: 'ButtonUndoSelected'},

        // Redo Button
        {src: 'img/btn_pre_normal.png', id: 'ButtonRedoNormal'},
        {src: 'img/btn_pre_pressed.png', id: 'ButtonRedoSelected'},

        // Hand Button
        {src: 'img/btn_move_normal.png', id: 'ButtonHandNormal'},
        {src: 'img/btn_move_pressed.png', id: 'ButtonHandSelected'},

        // Plus Button
        {src: 'img/btn_plus_normal.png', id: 'ButtonPlusNormal'},
        {src: 'img/btn_plus_pressed.png', id: 'ButtonPlusSelected'},

        // Minus Button
        {src: 'img/btn_minor_normal.png', id: 'ButtonMinusNormal'},
        {src: 'img/btn_minor_pressed.png', id: 'ButtonMinusSelected'}

    ], true);
    */

    function handleFileLoad(evt) {
        var o = evt.item;

        if (evt.item.type == 'image') {
            images[evt.item.id] = evt.result;
        }
    }

    function handleLoadComplete() {
        ss['Assets_atlas_'] = queue.getResult('Assets_atlas_');
        queue = null;
        onUILoadingComplete();
    }

})();




