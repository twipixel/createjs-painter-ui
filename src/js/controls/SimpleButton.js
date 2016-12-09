(function () {
    'use strict';

    var c = createjs;

    var SimpleButton = function (normalStateImage, pressStateImage,
                                 isToggleButton, clickHandler) {
        this.Container_constructor();
        this._init(normalStateImage, pressStateImage,
            isToggleButton, clickHandler);
    };

    var p = c.extend(SimpleButton, c.Container);

    p._init = function (normalStateImage, pressStateImage,
                        isToggleButton, clickHandler) {

        this._AVAILABLE_CLICK_DISTANCE = 10;

        this._pressStateBitmap = new pressStateImage();
        this._normalStateBitmap = new normalStateImage();
        this.addChild(this._normalStateBitmap);

        this._selected = false;
        var rect = nts.Painter.SpriteSheetUtil.getRect(this._normalStateBitmap);
        this.width = rect.width;
        this.height = rect.height;

        this._clickCallback = clickHandler;
        this._isToggleButton = (!isToggleButton) ? false : isToggleButton;
        this._mouseDownListener = this.on('mousedown', this._mouseDownHandler, this);
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

    p._mouseDownHandler = function (event) {
        if (this._isToggleButton === false)
            this._setStateSelected();

        this._mouseDownPoint = {x: event.stageX, y: event.stageY};
        this.off('mousedown', this._mouseDownListener);
        this._mouseUpListener = this.stage.on('stagemouseup', this._mouseUpHandler, this);
    };

    p._mouseUpHandler = function (event) {
        if (this._isToggleButton === false)
            this._setStateNormal();

        this.stage.off('stagemouseup', this._mouseUpListener);
        this._mouseDownListener = this.on('mousedown', this._mouseDownHandler, this);

        var movementX = Math.abs(this._mouseDownPoint.x - event.stageX);
        var movementY = Math.abs(this._mouseDownPoint.y - event.stageY);

        if (movementX < this._AVAILABLE_CLICK_DISTANCE && movementY < this._AVAILABLE_CLICK_DISTANCE) {
            this._clickHandler();
            this.dispatchEvent('click', event.bubbles, event.cancelable, event);
        }
    };

    p._setStateNormal = function () {
        if (this.contains(this._normalStateBitmap) === false) {
            this.addChild(this._normalStateBitmap);
            this.removeChild(this._pressStateBitmap);
        }
        this.update();
    };

    p._setStateSelected = function () {
        if (this.contains(this._pressStateBitmap) === false) {
            this.addChild(this._pressStateBitmap);
            this.removeChild(this._normalStateBitmap);
        }
        this.update();
    };

    p._updateState = function () {
        if (this._isToggleButton) {
            if (this._selected === false)
                this._setStateNormal();
            else this._setStateSelected();
        }
        this.update();
    };

    p._clickHandler = function () {
        if (this._isToggleButton)
            this.setSelected(!this._selected);

        if (this._clickCallback)
            this._clickCallback.call();
    };

    p.setClickCallback = function (value) {
        this._clickCallback = value;
    };

    p.getSelected = function () {
        return this._selected;
    };
    p.setSelected = function (value) {
        this._selected = value;
        this._updateState();
    };

    nts.Painter.SimpleButton = createjs.promote(SimpleButton, 'Container');
})();