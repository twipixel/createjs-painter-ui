(function () {
    'use strict';

    var c = createjs;

    var PenSizeDisplayer = function (size, alpha, color, bgImage) {
        this.Container_constructor();
        this._init(size, alpha, color, bgImage);
    };

    var p = c.extend(PenSizeDisplayer, c.Container);

    p._init = function (size, alpha, color, bgImage) {
        if (bgImage) {
            this._bg = new bgImage();
            var bgRect = nts.Painter.SpriteSheetUtil.getRect(this._bg);
            this.width = bgRect.width;
            this.height = bgRect.height;
            this._bgRadius = bgRect.width / 2;
        } else {
            this._bgRadius = 32;
            this._bg = new c.Shape();
            this._bg.graphics.beginFill('#EEEEEE').
                drawCircle(0, 0, this._bgRadius).
                endFill();
            this._bg.x = this._bg.y = this._bgRadius;
            this.width = this.height = this._bgRadius * 2;
        }

        this.addChild(this._bg);

        this._circle = new c.Shape();
        this.addChild(this._circle);

        this._penSize = size || 1;
        this._penAlpha = alpha || 1;
        this._penColor = color || '#000000';
        this._penRadius = this._penSize / 2;

        this._updateDisplay();
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

    p._updateDisplay = function () {
        var centerX = this.width / 2;
        var centerY = this.height / 2;

        this._circle.graphics.clear();
        this._circle.graphics.beginFill(this._penColor).
            drawCircle(centerX, centerY, this._penRadius).
            endFill();

        this._circle.alpha = this._penAlpha;
        this.update();
    };

    p.getPenSize = function () {
        return this._penSize;
    };
    p.setPenSize = function (value) {
        this._penSize = value;
        this._penSize = (this._penSize < 1) ? 1 : this._penSize;
        this._penSize = (this._penSize > 50) ? 50 : this._penSize;
        this._penRadius = this._penSize / 2;
        this._updateDisplay();
    };

    p.getPenAlpha = function () {
        return this._penAlpha;
    };
    p.setPenAlpha = function (value) {
        this._penAlpha = value;
        this._penAlpha = (this._penAlpha < 0) ? 0 : this._penAlpha;
        this._penAlpha = (this._penAlpha > 1) ? 1 : this._penAlpha;
        this._updateDisplay();
    };

    p.getPenColor = function () {
        return this._penColor;
    };
    p.setPenColor = function (value) {
        this._penColor = value;
        this._updateDisplay();
    };

    nts.Painter.PenSizeDisplayer = createjs.promote(PenSizeDisplayer, 'Container');
})();