(function () {
    'use strict';

    var c = createjs;

    var Popup = function (popupDiv, dimedDiv) {
        this.Container_constructor();
        this._init(popupDiv, dimedDiv);
    };

    Popup.TYPE_CONFIRM = 'confirm';
    Popup.TYPE_CONFIRM_CANCEL = 'confirm_cancel';

    var p = c.extend(Popup, c.Container);

    p._init = function (popupDiv, dimedDiv) {

        this._popupDiv = popupDiv;
        this._dimedDiv = dimedDiv;

        this._fontSize = 16;
        this._centerX = popupStage.canvas.width / 2;
        this._messageField = new c.Text('', this._fontSize + 'px Arial', '#000000');
        this._messageField.x = this._centerX;
        this._messageField.y = 50;
        this._messageField.baseline = 'top';
        this._messageField.textAlign = 'center';
        this.addChild(this._messageField);

        this._confirmButton = new nts.Painter.SimpleButton(lib.ButtonPopupConfirmNormal, lib.ButtonPopupConfirmSelected, false);
        this._confirmButton.x = this._centerX - 6 - this._confirmButton.width;
        this._confirmButton.y = 129;
        this._confirmButton.on('click', this._confirmClickHandler, this);
        this.addChild(this._confirmButton);

        this._cancelButton = new nts.Painter.SimpleButton(lib.ButtonPopupCancelNormal, lib.ButtonPopupCancelSelected, false);
        this._cancelButton.x = this._centerX + 6;
        this._cancelButton.y = this._confirmButton.y;
        this._cancelButton.on('click', this._cancelClickHanlder, this);
        this.addChild(this._cancelButton);

        this.update();
        this._addedToStageListener = this.on('added', this._addedToStageHandler, this);
    };

    p.update = function () {
        if (this.stage)
            this.stage.update();
    };

    p._addedToStageHandler = function() {
        this.update();
        this.off('added', this._addedToStageListener);
    };

    p.open = function (type, message, confirmCallback, cancelCallback) {
        var line = message.split('\n');

        if(line.length > 3) {
            line.length = 3;
            console.log('Popup 메시지는 3줄을 넘을 수 없습니다.');
        }

        if(type == Popup.TYPE_CONFIRM) {
            this._confirmButton.x = this._centerX - this._confirmButton.width / 2;
            this._cancelButton.visible = false;
        } else {
            this._confirmButton.x = this._centerX - 6 - this._confirmButton.width;
            this._cancelButton.visible = true;
        }

        this._confirmCallback = confirmCallback;
        this._cancelCallback = cancelCallback;

        this._messageField.text = line.join('\n');
        this._popupDiv.style.display = 'block';
        this._dimedDiv.style.display = 'block';
        this.update();
    };

    p.close = function () {
        this._popupDiv.style.display = 'none';
        this._dimedDiv.style.display = 'none';
    };

    p._confirmClickHandler = function() {
        if(this._confirmCallback)
            this._confirmCallback();
    };

    p._cancelClickHanlder = function() {
        if(this._cancelCallback)
            this._cancelCallback();
    };

    function getWindow(){
        return window;
    }

    nts.Painter.Popup = createjs.promote(Popup, 'Container');
})();