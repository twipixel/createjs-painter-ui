(function () {
    'use strict';

    var ToolSettingVO = function (penVO, paintVO, screenToneVO, eraserVO) {
        this.penVO = penVO;
        this.paintVO = paintVO;
        this.eraserVO = eraserVO;
        this.screenToneVO = screenToneVO;
    };

    var p = ToolSettingVO.prototype;

    p.toString = function () {
        var ret = '[ToolSettingVO]' + '\n';
        if (this.penVO)
            ret += this.penVO.toString() + '\n';

        if (this.paintVO)
            ret += this.paintVO.toString() + '\n';

        if (this.screenToneVO)
            ret += this.screenToneVO.toString() + '\n';

        if (this.eraserVO)
            ret += this.eraserVO.toString();
        return ret;
    };

    nts.Painter.ToolSettingVO = ToolSettingVO;
})();