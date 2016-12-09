(function () {
    'use strict';

    var c = createjs;

    var ColorMagnifier = function (size, alpha, color, magnifierImage, bubbleImage) {
        this.Container_constructor();
        this._init(size, alpha, color, magnifierImage, bubbleImage);
    };

    var p = c.extend(ColorMagnifier, c.Container);

    p._init = function (size, alpha, color, magnifierImage, bubbleImage) {

        var rect;

        if (magnifierImage) {
            this._bg = new magnifierImage();
            rect = nts.Painter.SpriteSheetUtil.getRect(this._bg);
            this.width = rect.width;
            this.height = rect.height;
            this._bgRadius = rect.width / 2;
        } else {
            this._bgRadius = 46;
            this._bg = new c.Shape();
            this._bg.graphics.beginFill('#EEEEEE').
                drawCircle(0, 0, this._bgRadius).
                endFill();
            this._bg.x = this._bg.y = this._bgRadius;
            this.width = this.height = this._bgRadius * 2;
        }

        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        if (bubbleImage) {
            this._bubble = new bubbleImage();
            rect = nts.Painter.SpriteSheetUtil.getRect(this._bubble);
            this._bubble.x = this.centerX - rect.width / 2;
            this._bubble.y = this.height;

            this._colorLabel = new c.Text('', '12px', '#FFFFFF');
            this._colorLabel.x = this.centerX;
            this._colorLabel.y = this.height + rect.height / 2 + 3;
            this._colorLabel.textAlign = 'center';
            this._colorLabel.textBaseline = 'middle';
            this.height += rect.height;
        }

        this._circle = new c.Shape();
        this.addChild(this._circle);

        this.addChild(this._bg);
        this.addChild(this._bubble);
        this.addChild(this._colorLabel);

        this._size = size || 1;
        this._alpha = alpha || 1;
        this._color = color || '#000000';
        this._radius = this._size / 2;

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
        this._circle.graphics.clear();
        this._circle.graphics.beginFill(this._color).
            drawCircle(this.centerX, this.centerY, this._radius).
            endFill();

        this._circle.alpha = this._alpha;

        if (this._colorLabel)
            this._colorLabel.text = this._color.toLocaleUpperCase();

        this.update();
    };

    p.getSize = function () {
        return this._size;
    };
    p.setSize = function (value) {
        this._size = value;
        this._size = (this._size < 1) ? 1 : this._size;
        this._size = (this._size > this.width) ? this.width : this._size;
        this._radius = this._size / 2;
        this._updateDisplay();
    };

    p.getAlpha = function () {
        return this._alpha;
    };
    p.setAlpha = function (value) {
        this._alpha = value;
        this._alpha = (this._alpha < 0) ? 0 : this._alpha;
        this._alpha = (this._alpha > 1) ? 1 : this._alpha;
        this._updateDisplay();
    };

    p.getColor = function () {
        return this._color;
    };
    p.setColor = function (value) {
        this._color = value;
        this._updateDisplay();
    };

    p.show = function () {
        this.visible = true;
        this.update();
    };
    p.hide = function () {
        this.visible = false;
        this.update();
    };

    nts.Painter.ColorMagnifier = createjs.promote(ColorMagnifier, 'Container');
})();