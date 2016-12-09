(function () {
    'use strict';

    var PenVO = function (size, alpha) {
        this.setSize(size || 1);
        this.setAlpha(alpha || 1);
    };

    PenVO.MIN_ALPHA = 0;
    PenVO.MAX_ALPHA = 1;
    PenVO.MIN_PEN_SIZE = 1;
    PenVO.MAX_PEN_SIZE = 50;

    var p = PenVO.prototype;

    p.getSize = function () {
        return this._penSize;
    };

    p.setSize = function (value) {
        this._penSize = value;
        this._penSize = (this._penSize < PenVO.MIN_PEN_SIZE) ?
            PenVO.MIN_PEN_SIZE : this._penSize;
        this._penSize = (this._penSize > PenVO.MAX_PEN_SIZE) ?
            PenVO.MAX_PEN_SIZE : this._penSize;
    };

    p.getAlpha = function () {
        return this._penAlpha;
    };

    p.setAlpha = function (value) {
        this._penAlpha = value;
        this._penAlpha = (this._penAlpha < PenVO.MIN_ALPHA) ?
            PenVO.MIN_ALPHA : this._penAlpha;
        this._penAlpha = (this._penAlpha > PenVO.MAX_ALPHA) ?
            PenVO.MAX_ALPHA : this._penAlpha;
    };

    p.toString = function () {
        return '[PenVO] size: ' + this._penSize + ' alpha: ' + this._penAlpha;
    };

    nts.Painter.PenVO = PenVO;
})();