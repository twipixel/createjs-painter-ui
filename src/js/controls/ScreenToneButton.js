(function () {
    'use strict';

    var c = createjs;

    var ScreenToneButton = function (iconImage, width, height, cornerRadius) {
        this.Container_constructor();
        this._init(iconImage, width, height, cornerRadius);
    };

    var p = c.extend(ScreenToneButton, c.Container);

    p._init = function (iconImage, width, height, cornerRadius) {
        this.type = null;
        this.width = width || 0;
        this.height = height || 0;
        this._selected = false;
        this._bgColor = '#FFFFFF';
        this._selectedBorderThickness = 2;
        this._unselectedBorderThickness = 1;
        this._selectedBorderColor = '#0fca48';
        this._unselectedBorderColor = '#e2e2e2';
        this.cornerRadius = cornerRadius || 0;

        this._buttonShape = new c.Shape();
        this.addChild(this._buttonShape);

        if (iconImage) {
            this.setIconImage(iconImage);
        } else {
            this._updateDisplay();
        }

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
        if (this._selected) {
            this._buttonShape.graphics.clear().
                beginFill(this._bgColor).
                setStrokeStyle(this._selectedBorderThickness).
                beginStroke(this._selectedBorderColor).
                drawRoundRect(0, 0, this.width, this.height, this.cornerRadius).
                endFill();
        } else {
            this._buttonShape.graphics.clear().
                beginFill(this._bgColor).
                setStrokeStyle(this._unselectedBorderThickness).
                beginStroke(this._unselectedBorderColor).
                drawRoundRect(0, 0, this.width, this.height, this.cornerRadius).
                endFill();
        }

        if (this._iconBitmap) {
            this._iconBitmap.x = parseInt(this.width / 2 - this._iconBitmap.width / 2) || 0;
            this._iconBitmap.y = parseInt(this.height / 2 - this._iconBitmap.height / 2) || 0;
        }

        this.update();
    };

    p.getIconImage = function () {
        return this._iconImage;
    };
    p.setIconImage = function (value) {
        this._iconImage = value;

        if (value) {
            this._iconBitmap = new this._iconImage();
            var rect = nts.Painter.SpriteSheetUtil.getRect(this._iconBitmap);
            this._iconBitmap.width = rect.width;
            this._iconBitmap.height = rect.height;
            this.addChild(this._iconBitmap);
            this._updateDisplay();
        }
    };

    p.setWidth = function (value) {
        this.width = value;
        this._updateDisplay();
    };

    p.setHeight = function (value) {
        this.height = value;
        this._updateDisplay();
    };

    p.setCornerRadius = function (value) {
        this.cornerRadius = value;
        this._updateDisplay();
    };

    p.getSelected = function () {
        return this._selected;
    };
    p.setSelected = function (value) {
        this._selected = value;
        this._updateDisplay();
    };

    nts.Painter.ScreenToneButton = createjs.promote(ScreenToneButton, 'Container');
})();