(function () {
    'use strict';

    var HueBarVO = function (selectorY, barHeight, color, imageData) {
        this.color = color || '';
        this.barHeight = barHeight || 0;
        this.selectorY = selectorY || 0;
        this.imageData = imageData || {data: [0, 0, 0]};
    };

    var p = HueBarVO.prototype;

    p.toString = function () {
        return '[HueBarVO]' +
            ', color: ' + this.color +
            ', selectorY: ' + this.selectorY +
            ', barHeight: ' + this.barHeight +
            ', red: ' + this.imageData.data[0] +
            ', green: ' + this.imageData.data[1] +
            ', blue: ' + this.imageData.data[2];
    };

    nts.Painter.HueBarVO = HueBarVO;
})();