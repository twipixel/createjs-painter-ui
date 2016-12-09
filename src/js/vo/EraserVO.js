(function () {
    'use strict';

    var EraserVO = function (size) {
        this.setSize(size || 1);
    };

    EraserVO.MIN_PEN_SIZE = 1;
    EraserVO.MAX_PEN_SIZE = 50;

    var p = EraserVO.prototype;

    p.getSize = function () {
        return this._penSize;
    };

    p.setSize = function (value) {
        this._penSize = value;
        this._penSize = (this._penSize < EraserVO.MIN_PEN_SIZE) ?
            EraserVO.MIN_PEN_SIZE : this._penSize;
        this._penSize = (this._penSize > EraserVO.MAX_PEN_SIZE) ?
            EraserVO.MAX_PEN_SIZE : this._penSize;
    };

    p.toString = function () {
        return '[EraserVO] size: ' + this._penSize;
    };

    nts.Painter.EraserVO = EraserVO;
})();