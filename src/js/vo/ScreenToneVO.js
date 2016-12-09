(function () {
    'use strict';

    var ScreenToneVO = function (selectedType, size, alpha) {
        this.setSize(size || 1);
        this.setAlpha(alpha || 1);
        this.setSelectedType(selectedType || ScreenToneVO.SCREEN_TONE_TYPE_0);
    };

    ScreenToneVO.MIN_ALPHA = 0;
    ScreenToneVO.MAX_ALPHA = 1;
    ScreenToneVO.MIN_PEN_SIZE = 1;
    ScreenToneVO.MAX_PEN_SIZE = 50;
    ScreenToneVO.SCREEN_TONE_TYPE_0 = 'ScreenToneType0';
    ScreenToneVO.SCREEN_TONE_TYPE_1 = 'ScreenToneType1';
    ScreenToneVO.SCREEN_TONE_TYPE_2 = 'ScreenToneType2';
    ScreenToneVO.SCREEN_TONE_TYPE_3 = 'ScreenToneType3';
    ScreenToneVO.SCREEN_TONE_TYPE_4 = 'ScreenToneType4';
    ScreenToneVO.SCREEN_TONE_TYPE_5 = 'ScreenToneType5';

    var p = ScreenToneVO.prototype;

    p.getSelectedType = function () {
        return this._selectedType;
    };
    p.setSelectedType = function (value) {
        this._selectedType = value;
    };

    p.getSize = function () {
        return this._penSize;
    };
    p.setSize = function (value) {
        this._penSize = value;
        this._penSize = (this._penSize < ScreenToneVO.MIN_PEN_SIZE) ?
            ScreenToneVO.MIN_PEN_SIZE : this._penSize;
        this._penSize = (this._penSize > ScreenToneVO.MAX_PEN_SIZE) ?
            ScreenToneVO.MAX_PEN_SIZE : this._penSize;
    };

    p.getAlpha = function () {
        return this._penAlpha;
    };
    p.setAlpha = function (value) {
        this._penAlpha = value;
        this._penAlpha = (this._penAlpha < ScreenToneVO.MIN_ALPHA) ?
            ScreenToneVO.MIN_ALPHA : this._penAlpha;
        this._penAlpha = (this._penAlpha > ScreenToneVO.MAX_ALPHA) ?
            ScreenToneVO.MAX_ALPHA : this._penAlpha;
    };

    p.toString = function () {
        return '[ScreenToneVO]' +
            ' selectedType: ' + this._selectedType +
            ' size: ' + this._penSize +
            ' alpha: ' + this._penAlpha;
    };

    nts.Painter.ScreenToneVO = ScreenToneVO;
})();