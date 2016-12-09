(function () {
    'use strict';

    var PaintVO = function (alpha) {
        this.setAlpha(alpha || 1);
    };

    PaintVO.MIN_ALPHA = 0;
    PaintVO.MAX_ALPHA = 1;

    var p = PaintVO.prototype;

    p.getAlpha = function () {
        return this._penAlpha;
    };

    p.setAlpha = function (value) {
        this._penAlpha = value;
        this._penAlpha = (this._penAlpha < PaintVO.MIN_ALPHA) ?
            PaintVO.MIN_ALPHA : this._penAlpha;
        this._penAlpha = (this._penAlpha > PaintVO.MAX_ALPHA) ?
            PaintVO.MAX_ALPHA : this._penAlpha;
    };

    p.toString = function () {
        return '[PaintVO] alpha: ' + this._penAlpha;
    };

    nts.Painter.PaintVO = PaintVO;
})();