(function () {
    'use strict';

    var c = createjs;

    var HSVPalette = function (overlayGradientImage, selectorImage) {
        this.Container_constructor();
        this._init(overlayGradientImage, selectorImage);
    };

    var p = c.extend(HSVPalette, c.Container);

    p._init = function (overlayGradientImage, selectorImage) {
        this._hueRect = new c.Shape();
        this.addChild(this._hueRect);

        this._selector = new selectorImage();
        this.addChild(this._selector);

        var selectorRect = nts.Painter.SpriteSheetUtil.getRect(this._selector);
        this._selectorHalfWidth = selectorRect.width / 2;
        this._selectorHalfHeight = selectorRect.height / 2;

        this._overlayImage = new overlayGradientImage();
        this.addChild(this._overlayImage);

        var overlayImageRect = nts.Painter.SpriteSheetUtil.getRect(this._overlayImage);
        this.width = overlayImageRect.width;
        this.height = overlayImageRect.height;

        this._maxSelectorX = this.width - selectorRect.width;
        this._maxSelectorY = this.height - selectorRect.height;

        this._vo = new nts.Painter.HSVPaletteVO();
        this._addMouseDownEvent();

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

    p.setHueColor = function (color) {
        this._hueRect.graphics.clear();
        this._hueRect.graphics
            .beginFill(color)
            .drawRect(0, 0, this.width, this.height)
            .endFill();

        var rgb = nts.Painter.ColorUtil.hexToRgb(color);
        this._vo.red = rgb.r;
        this._vo.green = rgb.g;
        this._vo.blue = rgb.b;
        this._vo.color = color;

        this.update();
    };

    p._colorCalculationsByPosition = function (localPoint) {
        var hue = this._hueBarVO.selectorY / this._hueBarVO.barHeight * 360;
        hue = (hue < 0) ? 0 : hue;
        hue = (hue > 360) ? 360 : hue;

        var saturation = localPoint.x / this.width * 100;
        saturation = (saturation < 0) ? 0 : saturation;
        saturation = (saturation > 100) ? 100 : saturation;

        var value = -(localPoint.y / this.height * 100) + 100;
        value = (value < 0) ? 0 : value;
        value = (value > 100) ? 100 : value;

        var rgb = nts.Painter.ColorUtil.hsvToRgb(hue, saturation, value);
        var hexColor = '#' + nts.Painter.ColorUtil.rgbToHex(rgb[0], rgb[1], rgb[2]);

        this._vo.red = rgb[0];
        this._vo.green = rgb[1];
        this._vo.blue = rgb[2];
        this._vo.color = hexColor;
        this._vo.hue = hue;
        this._vo.value = value;
        this._vo.saturation = saturation;

        this._dispatchChangeEvent();
    };

    p._colorCalculationsByHsv = function(hsv) {
        var rgb = nts.Painter.ColorUtil.hsvToRgb(hsv[0] * 360, hsv[1] * 100, hsv[2] * 100);
        var hexColor = '#' + nts.Painter.ColorUtil.rgbToHex(rgb[0], rgb[1], rgb[2]);

        this._vo.red = rgb[0];
        this._vo.green = rgb[1];
        this._vo.blue = rgb[2];
        this._vo.color = hexColor;
        this._vo.hue = hsv[0];
        this._vo.value = hsv[2];
        this._vo.saturation = hsv[1];
    };

    p._updateCursor = function (localPoint) {
        this._selector.x = localPoint.x - this._selectorHalfWidth;
        this._selector.y = localPoint.y - this._selectorHalfHeight;
        this._selector.x = (this._selector.x < 0) ? 0 : this._selector.x;
        this._selector.x = (this._selector.x > this._maxSelectorX) ? this._maxSelectorX : this._selector.x;
        this._selector.y = (this._selector.y < 0) ? 0 : this._selector.y;
        this._selector.y = (this._selector.y > this._maxSelectorY) ? this._maxSelectorY : this._selector.y;
    };

    p._updateByStageMouseEvent = function (event) {
        var localPoint = this.globalToLocal(event.stageX, event.stageY);
        this._vo.selectorPoint = localPoint;
        this._updateCursor(localPoint);
        this._colorCalculationsByPosition(localPoint);
        this.update();
    };

    p._addMouseDownEvent = function () {
        this._mouseOverListener =
            this._hueRect.on('mousedown', this._mouseDownHandler, this);
    };

    p._removeMouseDownEvent = function () {
        this._hueRect.off('mousedown', this._mouseOverListener);
    };

    p._addMouseMoveEvent = function () {
        this._mouseOutListener =
            stage.on('stagemouseup', this._mouseUpHandler, this);
        this._mouseMoveListener =
            stage.on('stagemousemove', this._mouseMoveHandler, this);
    };

    p._removeMouseMoveEvent = function () {
        stage.off('stagemouseup', this._mouseOutListener);
        stage.off('stagemousemove', this._mouseMoveListener);
    };

    p._dispatchChangeEvent = function () {
        this.dispatchEvent('colorChange');
    };

    p._mouseDownHandler = function (event) {
        this._addMouseMoveEvent();
        this._removeMouseDownEvent();
        this._updateByStageMouseEvent(event);
    };

    p._mouseUpHandler = function () {
        this._addMouseDownEvent();
        this._removeMouseMoveEvent();
    };

    p._mouseMoveHandler = function (event) {
        this._updateByStageMouseEvent(event);
    };

    p.getHueBarVO = function () {
        return this._hueBarVO;
    };
    p.setHueBarVO = function (value) {
        this._hueBarVO = value;
        this.setHueColor(this._hueBarVO.color);
    };

    p.getVO = function () {
        return this._vo;
    };
    p.setVO = function (value) {
        this._vo = value;
        this._selector.x = this._vo.selectorPoint.x;
        this._selector.y = this._vo.selectorPoint.y;
    };

    p.setSaturationAndValue = function (hsv) {
        this._updateCursor({x: hsv[1] * this.width || 0, y: this.height - hsv[2] * this.height || 0});
        this._colorCalculationsByHsv(hsv);
    };

    nts.Painter.HSVPalette = createjs.promote(HSVPalette, 'Container');
})();