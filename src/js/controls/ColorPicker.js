(function () {
    'use strict';

    var c = createjs;

    var ColorPicker = function () {
        this.Container_constructor();
        this._init();
    };

    var p = c.extend(ColorPicker, c.Container);

    p._init = function () {
        this.width = 298;
        this.height = 222;
        this._bg = new c.Shape();
        this.addChild(this._bg);

        this._labelField = new c.Text('색상', '12px bold', '#444444');
        this._labelField.x = 18;
        this._labelField.y = 16;
        this.addChild(this._labelField);

        this._hueBar = new nts.Painter.HueBar(lib.HueBar, lib.HueBarSelector);
        this._hueBar.x = 18;
        this._hueBar.y = 41;
        this._hueBar.on('colorChange', this._hueBarColorChangeHandler, this);
        this.addChild(this._hueBar);

        this._colorRect = new c.Shape();
        this._colorRect.x = 175;
        this._colorRect.y = 41;
        this.addChild(this._colorRect);

        this._colorRectBorder = new c.Shape();
        this._colorRectBorder.x = 175;
        this._colorRectBorder.y = 41;
        this._colorRectBorder.alpha = 0.1;
        this.addChild(this._colorRectBorder);

        this._colorField = new c.Text('', '12px Arial', '#000000');
        this._colorField.x = 210;
        this._colorField.y = 101;
        this._colorField.lineWidth = 71;
        this._colorField.textAlign = 'center';
        this.addChild(this._colorField);

        this._colorFieldBorder = new c.Shape();
        this._colorFieldBorder.x = 175;
        this._colorFieldBorder.y = 92;
        this.addChild(this._colorFieldBorder);

        this._colorPickerButton = new nts.Painter.SimpleButton(lib.ButtonSpoidNormal, lib.ButtonSpoidSelected, true);
        this._colorPickerButton.x = 250;
        this._colorPickerButton.y = 92;
        this.addChild(this._colorPickerButton);
        this._colorPickerButton.on('click', this._colorPickerClickHandler, this);

        this._whiteColorRect = new c.Shape();
        this._whiteColorRect.x = 175;
        this._whiteColorRect.y = 130;
        this._whiteColorRect.colorVO = new nts.Painter.ColorVO('#ffffff');
        this.addChild(this._whiteColorRect);
        this._whiteColorRect.on('click', this._defaultPaletteClickHandler, this);

        this._grayColorRect = new c.Shape();
        this._grayColorRect.x = 210;
        this._grayColorRect.y = 130;
        this._grayColorRect.colorVO = new nts.Painter.ColorVO('#8f8f8f');
        this.addChild(this._grayColorRect);
        this._grayColorRect.on('click', this._defaultPaletteClickHandler, this);

        this._blackColorRect = new c.Shape();
        this._blackColorRect.x = 245;
        this._blackColorRect.y = 130;
        this._blackColorRect.colorVO = new nts.Painter.ColorVO('#000000');
        this.addChild(this._blackColorRect);
        this._blackColorRect.on('click', this._defaultPaletteClickHandler, this);

        this._defaultPaletteBorder = new c.Shape();
        this._defaultPaletteBorder.x = 175;
        this._defaultPaletteBorder.y = 130;
        this._defaultPaletteBorder.alpha = 0.1;
        this.addChild(this._defaultPaletteBorder);

        this._hsvPalette = new nts.Painter.HSVPalette(
            lib.HSVPaletteOverlayGradient, lib.HSVPaletteSelector);
        this._hsvPalette.x = 53;
        this._hsvPalette.y = 41;
        this._hsvPalette.setHueBarVO(this._hueBar.getVO());
        this._hsvPalette.on('colorChange', this._hsvPaletteColorChangeHandler, this);
        this.addChild(this._hsvPalette);

        this._colorPickerPalette = new nts.Painter.ColorPickerPalette();
        this._colorPickerPalette.x = 18;
        this._colorPickerPalette.y = 165;
        this._colorPickerPalette.on('selectColor', this._selectedColorHandler, this);
        this.addChild(this._colorPickerPalette);

        this._createDefaultPalette();
        this._setBg(this.width, this.height);
        this.displayColor('#000000');
        this.updateVOByHexColor('#000000');

        this.selectedColorVO = new nts.Painter.ColorVO();
        this._addedToStageListener = this.on('added', this._addedToStageHandler, this);
    };

    p.update = function () {
        if (this.stage)
            this.stage.update();
    };

    p._addedToStageHandler = function () {
        this.update();
        this.off('added', this._addedToStageListener);
    };

    p._setBg = function (width, height) {
        this._bg.graphics
            .setStrokeStyle(1)
            .beginStroke('#cfd1d4')
            .beginLinearGradientFill(['#f8f8f8', '#eff1f3'], [0, 1], 0, 0, 0, height)
            .drawRoundRect(0.5, 0.5, width - 1, height - 1, 4)
            .endFill();

        this._colorFieldBorder.graphics
            .setStrokeStyle(1, 2)
            .beginStroke('#c3c3c3')
            .drawRect(0.5, 0.5, 71 - 1, 30 - 1)
            .endStroke();
    };

    p._createDefaultPalette = function () {
        this._defaultPaletteBorder.graphics
            .setStrokeStyle(1, 2)
            .beginStroke('#000000')
            .drawRect(0.5, 0.5, 105 - 1, 27 - 1)
            .endStroke();

        this._drawRect(
            this._whiteColorRect.graphics,
            35, 27, '#ffffff');

        this._drawRect(
            this._grayColorRect.graphics,
            35, 27, '#8f8f8f');

        this._drawRect(
            this._blackColorRect.graphics,
            35, 27, '#000000');
    };

    p._drawRect = function (graphics, width, height, color) {
        graphics
            .beginFill(color)
            .drawRect(0, 0, width, height)
            .endFill();
    };

    p.displayColor = function (color) {
        this._colorRect.graphics.clear();
        this._colorRect.graphics
            .beginFill(color)
            .drawRect(0.5, 0.5, 106 - 1, 48 - 1)
            .endFill();

        this._colorRectBorder.graphics.clear();
        this._colorRectBorder.graphics
            .setStrokeStyle(1, 2)
            .beginStroke('#000000')
            .drawRect(0.5, 0.5, 106 - 1, 48 - 1)
            .endStroke();

        this._colorField.text = color.toString().toUpperCase();
        this.update();
    };

    p._hueBarColorChangeHandler = function () {
        this._hsvPalette.setHueBarVO(this._hueBar.getVO());
        this.displayColor(this._hueBar.getVO().color);
        this.dispatchEvent('colorChange');
    };

    p._hsvPaletteColorChangeHandler = function () {
        this.displayColor(this._hsvPalette.getVO().color);
        this.dispatchEvent('colorChange');
    };

    p._selectedColorHandler = function () {
        this.selectedColorVO = this._colorPickerPalette.selectedColorVO;
        var rgb = nts.Painter.ColorUtil.hexToRgb(this.selectedColorVO.color);
        this.setColor([rgb.r, rgb.g, rgb.b]);
        this.dispatchEvent('selectColor');
    };

    p._colorPickerClickHandler = function () {
        this.dispatchEvent('colorPickerClicked');
    };

    p._defaultPaletteClickHandler = function (event) {
        this.selectedColorVO = event.currentTarget.colorVO;
        var rgb = nts.Painter.ColorUtil.hexToRgb(this.selectedColorVO.color);
        this.setColor([rgb.r, rgb.g, rgb.b]);
        this.dispatchEvent('selectColor');
    };

    p.getVO = function () {
        return this._hsvPalette.getVO();
    };

    p.pushColor = function (rgb, alpha) {
        this._colorPickerPalette.push('#' + nts.Painter.ColorUtil.rgbToHex(rgb[0], rgb[1], rgb[2]), alpha);
    };

    p.updateVOByHexColor = function (color) {
        var vo = this._hsvPalette.getVO();
        vo.color = color;
        var rgb = nts.Painter.ColorUtil.hexToRgb(color);
        vo.red = rgb.r;
        vo.green = rgb.g;
        vo.blue = rgb.b;
        this._hsvPalette.setVO(vo);
    };

    p.getColorPickerSelected = function () {
        return this._colorPickerButton.getSelected();
    };

    p.setColor = function (rgb) {
        var hsv = nts.Painter.ColorUtil.rgbToHsv(rgb[0], rgb[1], rgb[2]);
        var color = '#' + nts.Painter.ColorUtil.rgbToHex(rgb[0], rgb[1], rgb[2]);

        this.displayColor(color);
        this._hueBar.setHue(hsv[0]);
        this._hsvPalette.setHueColor(color);
        this._hsvPalette.setSaturationAndValue(hsv);
        this.update();
    };

    nts.Painter.ColorPicker = createjs.promote(ColorPicker, 'Container');
})();