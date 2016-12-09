(function () {
    'use strict';

    var c = createjs;

    var ToolSettingPanel = function (toolType) {
        this.Container_constructor();
        this._init(toolType);
    };

    var p = c.extend(ToolSettingPanel, c.Container);

    p._init = function (toolType) {
        this._totalScreenToneButon = 6;
        this._screenToneButtonList = [];
        this._screenToneButtonListenerList = [];
        this._settingInfoList = this._getSettingInfoList();

        this._bg = new c.Shape();
        this.addChild(this._bg);

        this._lableField = new c.Text('펜 설정', '12px bold', '#444444');
        this._lableField.x = 18;
        this._lableField.y = 16;
        this._lableField.textAlign = 'left';
        this._lableField.textBaseline = 'top';
        this.addChild(this._lableField);

        this._sizeField = new c.Text('1px', '12px', '#000000');
        this._sizeField.textAlign = 'right';
        this._sizeField.textBaseline = 'middle';
        this.addChild(this._sizeField);

        this._sizeLabelField = new c.Text('사이즈', '12px', '#000000');
        this._sizeLabelField.textAlign = 'left';
        this._sizeLabelField.textBaseline = 'middle';
        this.addChild(this._sizeLabelField);

        this._sizeSlider = new nts.Painter.Slider(lib.SliderKnob, lib.SliderTrack, lib.SliderTrackGradient);
        this._sizeSlider.setMinValue(1);
        this._sizeSlider.setMaxValue(50);
        this._sizeSlider.setValue(nts.Painter.PenVO.MIN_PEN_SIZE);
        this._sizeListener =
            this._sizeSlider.on('sliderChange', this._sizeSliderChangeHandler, this);
        this.addChild(this._sizeSlider);

        this._alphaField = new c.Text('100%', '12px', '#000000');
        this._alphaField.textAlign = 'right';
        this._alphaField.textBaseline = 'middle';
        this.addChild(this._alphaField);

        this._alphaLabelField = new c.Text('투명도', '12px', '#000000');
        this._alphaLabelField.textAlign = 'left';
        this._alphaLabelField.textBaseline = 'middle';
        this.addChild(this._alphaLabelField);

        this._alphaSlider = new nts.Painter.Slider(lib.SliderKnob, lib.SliderTrack, lib.SliderTrackGradient);
        this._alphaSlider.setMinValue(0);
        this._alphaSlider.setMaxValue(1);
        this._alphaSlider.setValue(nts.Painter.PenVO.MAX_ALPHA);
        this._alphaListener = this._alphaSlider.on('sliderChange', this._alphaSliderChangeHandler, this);
        this.addChild(this._alphaSlider);

        this._penSizeDisplayer = new nts.Painter.PenSizeDisplayer(1, 1, '#000000', lib.PenSizeDisplayerBg);
        this.addChild(this._penSizeDisplayer);

        this._dividingLine = new c.Shape();
        this._dividingLine.visible = false;
        this._dividingLine.graphics.
            beginFill('#e0e1e2').
            drawRect(0, 0, 261, 1).
            endFill();
        this._dividingLine.x = 19;
        this._dividingLine.y = 87;
        this.addChild(this._dividingLine);

        for (var i = 0; i < this._totalScreenToneButon; i++) {
            var button = new nts.Painter.ScreenToneButton(
                lib['ScreenToneIcon' + (i + 1)], 32, 32, 2);
            button.x = 18 + (46 * i);
            button.y = 44;
            button.type = nts.Painter.ScreenToneVO['SCREEN_TONE_TYPE_' + i];
            this._screenToneButtonList[i] = button;
            this._screenToneButtonListenerList[i] =
                button.on('click', this._screenToneClickHandler, this);
            this.addChild(button);
        }

        this._vo = new nts.Painter.ToolSettingVO(
            new nts.Painter.PenVO(nts.Painter.PenVO.MIN_PEN_SIZE, nts.Painter.PenVO.MAX_ALPHA),
            new nts.Painter.PaintVO(nts.Painter.PaintVO.MAX_ALPHA),
            new nts.Painter.ScreenToneVO(nts.Painter.ScreenToneVO.SCREEN_TONE_TYPE_0,
                nts.Painter.ScreenToneVO.MIN_PEN_SIZE, nts.Painter.ScreenToneVO.MAX_ALPHA),
            new nts.Painter.EraserVO(nts.Painter.EraserVO.MIN_PEN_SIZE));

        this.setPanelByToolType(toolType || nts.Painter.CONSTANT.TOOL_TYPE_PEN);
        this._addedToStageListener = this.on('added', this._addedToStageHandler, this);
    };

    p.update = function () {
        if (this.stage)
            this.stage.update();
    };

    p._addedToStageHandler = function () {
        this.update();
        this.off('added', this._addedToStageListener);
    };

    p.setPanelByToolType = function (toolType) {
        this.toolType = toolType;
        var settingInfo = this._getSettingInfoByToolType(toolType);

        this._setPanel(settingInfo);
        this._setBg(settingInfo.width, settingInfo.height);

        this._dispatchChangeEvent();
        this.update();
    };

    p._setPanel = function (settingInfo) {
        this._lableField.text = settingInfo.label;
        this._setPosition(this._penSizeDisplayer, settingInfo.penSizeDisplayerPoint);

        var sizeVisible = settingInfo.sizeVisible;

        if (sizeVisible) {
            this._setPosition(this._sizeField, settingInfo.sizeFieldPoint);
            this._setPosition(this._sizeSlider, settingInfo.sizeSliderPoint);
            this._setPosition(this._sizeLabelField, settingInfo.sizeLabelFieldPoint);
        }

        this._sizeField.visible = sizeVisible;
        this._sizeSlider.visible = sizeVisible;
        this._sizeLabelField.visible = sizeVisible;

        var alphaVisible = settingInfo.alphaVisible;

        if (alphaVisible) {
            this._setPosition(this._alphaField, settingInfo.alphaFieldPoint);
            this._setPosition(this._alphaSlider, settingInfo.alphaSliderPoint);
            this._setPosition(this._alphaLabelField, settingInfo.alphaLabelFieldPoint);
        }

        this._alphaField.visible = alphaVisible;
        this._alphaSlider.visible = alphaVisible;
        this._alphaLabelField.visible = alphaVisible;

        var screenToneButtonVisible =
            (settingInfo.type == nts.Painter.CONSTANT.TOOL_TYPE_SCREEN_TONE) ? true : false;

        var selectedType = this._vo.screenToneVO.getSelectedType();
        var index = selectedType.substr(selectedType.length - 1);
        this._setButtonSelected(index);
        this._setButtonVisible(screenToneButtonVisible);
        this._dividingLine.visible = screenToneButtonVisible;
    };

    p._setPosition = function (target, point) {
        target.x = point.x;
        target.y = point.y;
    };

    p.setVisible = function (target, visible) {
        target.visible = visible;
    };

    p._setBg = function (width, height) {
        this._bg.graphics.clear();
        this._bg.graphics
            .setStrokeStyle(1)
            .beginStroke('#cfd1d4')
            .beginLinearGradientFill(['#f8f8f8', '#eff1f3'], [0, 1], 0, 0, 0, height)
            .drawRoundRect(0.5, 0.5, width - 1, height - 1, 4)
            .endFill();

        this.width = width;
        this.height = height;
    };

    p._getSettingInfoByToolType = function (type) {
        for (var i = 0; i < this._settingInfoList.length; i++) {
            var info = this._settingInfoList[i];
            if (info.type == type)
                return info;
        }
        return null;
    };

    p._setButtonSelected = function (index) {
        for (var i = 0; i < this._screenToneButtonList.length; i++) {
            if (i == index) {
                this._screenToneButtonList[i].setSelected(true);
            } else {
                this._screenToneButtonList[i].setSelected(false);
            }
        }
    };

    p._setButtonVisible = function (visible) {
        for (var i = 0; i < this._screenToneButtonList.length; i++)
            this._screenToneButtonList[i].visible = visible;
    };

    p._dispatchChangeEvent = function () {
        this.dispatchEvent('toolSettingChange');
    };

    p._sizeSliderChangeHandler = function (event) {
        var value = this._sizeSlider.getValue();
        this._vo.penVO.setSize(value);
        this._vo.eraserVO.setSize(value);
        this._vo.screenToneVO.setSize(value);
        this._penSizeDisplayer.setPenSize(value);
        this._sizeField.text = parseInt(value) + 'px';
        this._dispatchChangeEvent();
    };

    p._alphaSliderChangeHandler = function (event) {
        var value = this._alphaSlider.getValue();
        this._vo.penVO.setAlpha(value);
        this._vo.paintVO.setAlpha(value);
        this._vo.screenToneVO.setAlpha(value);
        this._penSizeDisplayer.setPenAlpha(value);
        this._alphaField.text = parseInt(value * 100) + '%';
        this._dispatchChangeEvent();
    };

    p._screenToneClickHandler = function (event) {
        var selectedButton = event.currentTarget;
        var selectedType = selectedButton.type;
        var index = selectedType.substr(selectedType.length - 1);
        this._setButtonSelected(index);
        this._vo.screenToneVO.setSelectedType(selectedType);
        this._dispatchChangeEvent();
    };

    p.getVO = function () {
        return this._vo;
    };
    p.setVO = function (value) {
        this._vo = value;
    };

    p.getPenSize = function () {
        return this._sizeSlider.getValue();
    };
    p.setPenSize = function (value) {
        value = value || 0;
        this._sizeSlider.setValue(value);
    };

    p.getPenAlpha = function () {
        return this._alphaSlider.getValue();
    };
    p.setPenAlpha = function (value) {
        value = value || 0;
        this._alphaSlider.setValue(value);
        this._vo.penVO.setAlpha(value);
        this._vo.paintVO.setAlpha(value);
        this._vo.screenToneVO.setAlpha(value);
        this._penSizeDisplayer.setPenAlpha(value);
        this._alphaField.text = parseInt(value * 100) + '%';
        this.update();
    };

    p.getSelectedScreenToneType = function () {
        return this._vo.screenToneVO.getSelectedType();
    };

    p.getPenColor = function () {
        return this._penSizeDisplayer.getPenColor();
    };
    p.setPenColor = function (value) {
        this._penSizeDisplayer.setPenColor(value);
        this.update();
    };

    p._getSettingInfoList = function () {
        return [
            {
                label: '펜 설정',
                type: nts.Painter.CONSTANT.TOOL_TYPE_PEN,
                width: 298, height: 130,
                penSizeDisplayerPoint: {x: 18, y: 46},
                sizeVisible: true,
                alphaVisible: true,
                sizeFieldPoint: {x: 280, y: 65},
                sizeLabelFieldPoint: {x: 94, y: 65},
                sizeSliderPoint: {x: 136, y: 63},
                alphaFieldPoint: {x: 280, y: 91},
                alphaLabelFieldPoint: {x: 94, y: 91},
                alphaSliderPoint: {x: 136, y: 89}
            },
            {
                label: '페인트 설정',
                type: nts.Painter.CONSTANT.TOOL_TYPE_PAINT,
                width: 298, height: 130,
                penSizeDisplayerPoint: {x: 18, y: 46},
                sizeVisible: false,
                alphaVisible: true,
                alphaFieldPoint: {x: 280, y: 77},
                alphaLabelFieldPoint: {x: 94, y: 77},
                alphaSliderPoint: {x: 136, y: 75}
            },
            {
                label: '스크린톤 설정',
                type: nts.Painter.CONSTANT.TOOL_TYPE_SCREEN_TONE,
                width: 298, height: 178,
                penSizeDisplayerPoint: {x: 18, y: 98},
                sizeVisible: true,
                alphaVisible: true,
                sizeFieldPoint: {x: 280, y: 117},
                sizeLabelFieldPoint: {x: 94, y: 117},
                sizeSliderPoint: {x: 136, y: 115},
                alphaFieldPoint: {x: 280, y: 143},
                alphaLabelFieldPoint: {x: 94, y: 143},
                alphaSliderPoint: {x: 136, y: 141}
            },
            {
                label: '지우게 설정',
                type: nts.Painter.CONSTANT.TOOL_TYPE_ERASER,
                width: 298, height: 130,
                penSizeDisplayerPoint: {x: 18, y: 46},
                sizeVisible: true,
                alphaVisible: false,
                sizeFieldPoint: {x: 280, y: 77},
                sizeLabelFieldPoint: {x: 94, y: 77},
                sizeSliderPoint: {x: 136, y: 75}
            }
        ];
    };

    nts.Painter.ToolSettingPanel = createjs.promote(ToolSettingPanel, 'Container');
})();