(function () {
    'use strict';

    var ColorUtil = function () {

    };

    ColorUtil.hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    ColorUtil.rgbToHex = function (r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    ColorUtil.rgbToHsv = function (r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h, s, v];
    };

    ColorUtil.hsvToRgb = function (h, s, v) {
        var r = 0, g = 0, b = 0, rgb = [];
        var tempS = s / 100, tempV = v / 100;

        var hi = Math.floor(h / 60) % 6;
        var f = h / 60 - Math.floor(h / 60);
        var p = (tempV * (1 - tempS));
        var q = (tempV * (1 - f * tempS));
        var t = (tempV * (1 - (1 - f) * tempS));

        switch (hi) {
            case 0:
                r = tempV;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = tempV;
                b = p;
                break;
            case 2:
                r = p;
                g = tempV;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = tempV;
                break;
            case 4:
                r = t;
                g = p;
                b = tempV;
                break;
            case 5:
                r = tempV;
                g = p;
                b = q;
                break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    nts.Painter.ColorUtil = ColorUtil;
})();