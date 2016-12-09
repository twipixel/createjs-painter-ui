(function () {
    'use strict';

    var c = createjs;

    var Slider = function (knobImage, trackImage, trackGradientImage) {
        this.Container_constructor();
        this._init(knobImage, trackImage, trackGradientImage);
    };

    var p = c.extend(Slider, c.Container);

    p._init = function (knobImage, trackImage, trackGradientImage) {
        this._value = 0;
        this._minValue = 0;
        this._maxValue = 0;

        this._isSliderDown = false;
        this._enableSliderUpCallback = true;
        this._enableSlideDownCallback = true;
        this._enableSliderChangeCallback = true;
        this._enableSliderChangeCallbackAtDragging = true;

        this._track = new trackImage();
        this.addChild(this._track);

        this._trackGradientMask = new c.Shape();
        this._trackGradient = new trackGradientImage();
        this._trackGradient.mask = this._trackGradientMask;
        this.addChild(this._trackGradient);

        var trackRect = nts.Painter.SpriteSheetUtil.getRect(this._track);
        this._trackWidth = trackRect.width;
        this._trackHeight = trackRect.height;

        this._knob = new knobImage();
        var knobRect = nts.Painter.SpriteSheetUtil.getRect(this._knob);
        this.knobOffsetX = -(knobRect.width / 2);
        this._knob.x = this.knobOffsetX;
        this._knob.y = -(knobRect.height / 2) + 3;
        this.addChild(this._knob);

        this._transparentButtonArea = new c.Shape();
        this._transparentButtonArea.alpha = 0.01;
        this.addChild(this._transparentButtonArea);
        this._transparentButtonArea.graphics
            .beginFill('red')
            .drawRect(0, 0, this._trackWidth, knobRect.height)
            .endFill();
        this._transparentButtonArea.y = this._knob.y;

        this._cursorMinX = 0;
        this._cursorMaxX = this._trackWidth;
        this._mouseDownListener = this.on('mousedown', this._mouseDownHandler, this);

        this.setValue(this._minValue);
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

    p._updateValue = function (value, dispatch) {
        var v = this._validateValue(value);

        if (this._value != v) {
            this._value = v;

            var cursorX = parseInt(this._trackWidth *
                    (this._value - this._minValue) /
                    (this._maxValue - this._minValue)) || 0;

            cursorX = (cursorX < this._cursorMinX) ? this._cursorMinX : cursorX;
            cursorX = (cursorX > this._cursorMaxX) ? this._cursorMaxX : cursorX;

            this._knob.x = cursorX + this.knobOffsetX;
            this._setTrackGradientMask(cursorX);

            if (dispatch && this._enableSliderChangeCallbackAtDragging) {
                if (this._enableSliderChangeCallback)
                    this.dispatchEvent('sliderChange', true);
            }
        }
        this.update();
    };

    p._setTrackGradientMask = function (width) {
        this._trackGradientMask.graphics.clear();
        this._trackGradientMask.graphics.beginFill('#ff3300')
            .drawRect(0, 0, width, this._trackHeight)
            .endFill();
    };

    p._validateValue = function (value) {
        if (this._minValue < this._maxValue) {
            if (value < this._minValue)
                value = this._minValue;
            else if (value > this._maxValue)
                value = this._maxValue;
        }
        else {
            if (value < this._maxValue)
                value = this._maxValue;
            else if (value > this._minValue)
                value = this._minValue;
        }
        return value;
    };

    p._mouseDownHandler = function (event) {
        this._isSliderDown = true;
        this._updateValue(this._getValueFromMouseEvent(event), true);

        if (this._enableSlideDownCallback)
            this.dispatchEvent('sliderDown', true);

        this._mouseUpListener = stage.on('stagemouseup', this._mouseUpHandler, this);
        this._mouseMoveListener = stage.on('stagemousemove', this._mouseMoveHandler, this);

        this.update();
    };

    p._getValueFromMouseEvent = function (event) {
        var mousePoint = this.globalToLocal(event.stageX, event.stageY);

        return mousePoint.x / this._trackWidth *
            (this._maxValue - this._minValue) + this._minValue;
    };

    p._mouseMoveHandler = function (event) {
        this._updateValue(this._getValueFromMouseEvent(event), true);
        this.update();
    };

    p._mouseUpHandler = function () {
        this._isSliderDown = false;

        if (this._enableSliderChangeCallback)
            this.dispatchEvent('sliderChange', true);

        if (this._enableSliderUpCallback)
            this.dispatchEvent('sliderUp', true);

        stage.off('stagemouseup', this._mouseUpListener);
        stage.off('stagemousemove', this._mouseMoveListener);
        this.update();
    };

    p.getValue = function () {
        return this._value;
    };
    p.setValue = function (value) {
        this._updateValue(value);
    };

    p.getMinValue = function () {
        return this._minValue;
    };
    p.setMinValue = function (value) {
        this._minValue = value;
        this._updateValue(this._value);
    };

    p.getMaxValue = function () {
        return this._maxValue;
    };
    p.setMaxValue = function (value) {
        this._maxValue = value;
        this._updateValue(this._value);
    };

    p.getIsSliderDown = function () {
        return this._isSliderDown;
    };

    p.getEnableSliderUpCallback = function () {
        return this._enableSliderUpCallback;
    };
    p.setEnableSliderUpCallback = function (value) {
        this._enableSliderUpCallback = value;
    };

    p.getEnableSliderDownCallback = function () {
        return this._enableSlideDownCallback;
    };
    p.setEnableSliderDownCallback = function (value) {
        this._enableSlideDownCallback = value;
    };

    p.getEnableSliderChangeCallback = function () {
        return this._enableSliderChangeCallback;
    };
    p.setEnableSliderChangeCallback = function (value) {
        this._enableSliderChangeCallback = value;
    };

    p.getEnableSliderChangeCallbackAtDragging = function () {
        return this._enableSliderChangeCallbackAtDragging;
    };
    p.setEnableSliderChangeCallbackAtDragging = function (value) {
        this._enableSliderChangeCallbackAtDragging = value;
    };

    nts.Painter.Slider = createjs.promote(Slider, 'Container');
})();