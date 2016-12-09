(function () {
    'use strict';

    var HSVPaletteVO = function (hue, saturation, value, color, red, green, blue, selectorPoint) {
        this.hue = hue || 0;
        this.saturation = saturation || 0;
        this.value = value || 0;
        this.color = color || '';
        this.red = red || 0;
        this.green = green || 0;
        this.blue = blue || 0;
        this.selectorPoint = selectorPoint || 0;
    };

    var p = HSVPaletteVO.prototype;

    p.toString = function () {
        return '[HSVPaletteVO]' +
            ' hue: ' + this.hue +
            ', saturation: ' + this.saturation +
            ', value: ' + this.value +
            ', color: ' + this.color +
            ', red: ' + this.red +
            ', green: ' + this.green +
            ', blue: ' + this.blue +
            ', selectorPoint: ' + this.selectorPoint;
    };

    nts.Painter.HSVPaletteVO = HSVPaletteVO;
})();