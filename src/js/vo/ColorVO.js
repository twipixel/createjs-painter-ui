(function () {
    'use strict';

    var ColorVO = function (hexColorCode, alpha) {
        this.color = hexColorCode || '#000000';
        this.alpha = alpha || 1;
    };

    var p = ColorVO.prototype;

    p.toString = function () {
        return '[ColorVO] color: ' + this.color + ' alpha: ' + this.alpha;
    };

    nts.Painter.ColorVO = ColorVO;
})();