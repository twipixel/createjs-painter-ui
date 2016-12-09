(function () {
    'use strict';

    var c = createjs;

    var HueBar = function (barImage, selectorImage) {
        this.Container_constructor();
        this._init(barImage, selectorImage);
    };

    var p = c.extend(HueBar, c.Container);

    p._init = function (barImage, selectorImage) {
        this._colorPickOffsetX = 10;

        this._bar = new barImage();
        this.addChild(this._bar);

        this._selector = new selectorImage();
        this.addChild(this._selector);

        var barImageRect = nts.Painter.SpriteSheetUtil.getRect(this._bar);
        var selectorImageRect = nts.Painter.SpriteSheetUtil.getRect(this._selector);

        this._offscreenCanvas = getShadowCanvas(barImageRect.width, barImageRect.height);
        this._offscreenContext = this._offscreenCanvas.getContext('2d');
        var image = nts.Painter.SpriteSheetUtil.getImage(this._bar);
        this._offscreenContext.drawImage(image, barImageRect.x, barImageRect.y, barImageRect.width, barImageRect.height, 0, 0, barImageRect.width, barImageRect.height);

        this._barHeight = barImageRect.height || 0;
        this._selectorHeight = selectorImageRect.height || 0;
        this._selectorHalfHeight = selectorImageRect.height / 2 || 0;
        this._mouseDownListener = this.on('mousedown', this._mouseDownHandler, this);
        this._maxSelectorY = this._barHeight - this._selectorHeight;

        this._vo = new nts.Painter.HueBarVO();
        this._vo.selectorY = 0;
        this._vo.barHeight = this._barHeight = barImageRect.height;

        this._selectorY = 0;
        this._updateColor({x: 0, y: 0});
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

    p._updateCursor = function (point) {
        this._selector.y = point.y - this._selectorHalfHeight;
        this._selector.y = (this._selector.y < 0) ? 0 : this._selector.y;
        this._selector.y = (this._selector.y > this._maxSelectorY) ? this._maxSelectorY : this._selector.y;
    };

    p._updateColor = function (point, useEventDispatcher) {
        var imageData = this._offscreenContext.getImageData(
            this._colorPickOffsetX, point.y, 1, 1);

        if (imageData.data[0] !== 0 || imageData.data[1] !== 0 || imageData.data[2] !== 0)
            this._vo.imageData = imageData;

        this._vo.color = '#' + nts.Painter.ColorUtil.rgbToHex(
                this._vo.imageData.data[0],
                this._vo.imageData.data[1],
                this._vo.imageData.data[2]);

        this._selectorY = point.y;
        this._selectorY = (this._selectorY < 0) ? 0 : this._selectorY;
        this._selectorY = (this._selectorY > this._barHeight) ? this._barHeight : this._selectorY;
        this._vo.selectorY = this._selectorY;

        if (useEventDispatcher)
            this.dispatchEvent('colorChange');
    };

    p._mouseDownHandler = function (event) {
        this._updateByStageMouseEvent(event);
        this._mouseUpListener = stage.on('stagemouseup', this._mouseUpHandler, this);
        this._mouseMoveListener = stage.on('stagemousemove', this._mouseMoveHandler, this);
    };

    p._mouseMoveHandler = function (event) {
        this._updateByStageMouseEvent(event);
    };

    p._mouseUpHandler = function (event) {
        this._updateByStageMouseEvent(event);
        stage.off('stagemouseup', this._mouseUpListener);
        stage.off('stagemousemove', this._mouseMoveListener);
    };

    p._updateByStageMouseEvent = function (event) {
        var localPoint = this.globalToLocal(event.stageX, event.stageY);
        this._updateCursor(localPoint);
        this._updateColor(localPoint, true);
        this.update();
    };

    p.getVO = function () {
        return this._vo;
    };
    p.setVO = function (value) {
        this._vo = value;
        this._updateCursor({x: 0, y: value.selectorY});
        this.update();
    };

    p.setHue = function (value) {
        var localPoint = {x: 0, y: value * this._barHeight || 0};
        this._updateCursor(localPoint);
        this._updateColor(localPoint);
        this.update();
    };

    function getShadowCanvas(width, height) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas.setAttribute('id', 'hueBarOffscreen');
        //document.body.appendChild(canvas);
        return canvas;
    }

    nts.Painter.HueBar = createjs.promote(HueBar, 'Container');
})();