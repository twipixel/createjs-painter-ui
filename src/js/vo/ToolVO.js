(function () {
    'use strict';

    var ToolVO = function (toolPanel, toolSettingPanel, colorPicker) {
        this._toolPanel = toolPanel;
        this._colorPicker = colorPicker;
        this._toolSettingPanel = toolSettingPanel;
        this.updateValue();
    };

    var p = ToolVO.prototype;

    p.updateValue = function () {
        if (!this._toolPanel || !this._toolSettingPanel)
            return;

        this.mode = this.getMode(this._toolPanel.getSelectedToolType());
        this.size = parseInt(this._toolSettingPanel.getPenSize());
        this.opacity = this._toolSettingPanel.getPenAlpha();
        this.colorPickerVO = this._colorPicker.getVO();

        this.rgbColor = [
            this.colorPickerVO.red,
            this.colorPickerVO.green,
            this.colorPickerVO.blue
        ];

        this.patternType = this.getPatternType(this._toolSettingPanel.getSelectedScreenToneType());
    };

    p.updateByHexColor = function (color) {
        this._colorPicker.updateVOByHexColor(color);
        this.colorPickerVO = this._colorPicker.getVO();

        this.rgbColor = [
            this.colorPickerVO.red,
            this.colorPickerVO.green,
            this.colorPickerVO.blue
        ];
    };

    p.getMode = function (toolType) {
        var mode;
        switch (toolType) {
            case nts.Painter.CONSTANT.TOOL_TYPE_PEN:
                mode = 'pen';
                break;
            case nts.Painter.CONSTANT.TOOL_TYPE_PAINT:
                mode = 'paint';
                break;
            case nts.Painter.CONSTANT.TOOL_TYPE_SCREEN_TONE:
                mode = 'screentone';
                break;
            case nts.Painter.CONSTANT.TOOL_TYPE_ERASER:
                mode = 'eraser';
                break;
            default :
                mode = 'pen';
                break;
        }
        return mode;
    };

    p.getPatternType = function (screenToneType) {
        var patternType;
        switch (screenToneType) {
            case nts.Painter.ScreenToneVO.SCREEN_TONE_TYPE_0:
                patternType = 'p1';
                break;
            case nts.Painter.ScreenToneVO.SCREEN_TONE_TYPE_1:
                patternType = 'p2';
                break;
            case nts.Painter.ScreenToneVO.SCREEN_TONE_TYPE_2:
                patternType = 'p3';
                break;
            case nts.Painter.ScreenToneVO.SCREEN_TONE_TYPE_3:
                patternType = 'p4';
                break;
            case nts.Painter.ScreenToneVO.SCREEN_TONE_TYPE_4:
                patternType = 'p5';
                break;
            case nts.Painter.ScreenToneVO.SCREEN_TONE_TYPE_5:
                patternType = 'p6';
                break;
            default :
                patternType = 'p1';
                break;
        }
        return patternType;
    };

    p.toString = function () {
        return '[ToolVO]' + '\n' +
            'mode : ' + this.mode + '\n' +
            'size : ' + this.size + '\n' +
            'opacity : ' + this.opacity + '\n' +
            'rgbColor : ' + this.rgbColor.toString() + '\n' +
            'patternType : ' + this.patternType + '\n' +
            this.colorPickerVO.toString();
    };

    p.getToolPanel = function () {
        return this._toolPanel;
    };
    p.setToolPanel = function (value) {
        this._toolPanel = value;
        this.updateValue();
    };

    p.getToolSettingPanel = function () {
        return this._toolSettingPanel;
    };
    p.setToolSettingPanel = function (value) {
        this._toolSettingPanel = value;
        this.updateValue();
    };

    nts.Painter.ToolVO = ToolVO;
})();