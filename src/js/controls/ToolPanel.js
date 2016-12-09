(function () {
    'use strict';

    var c = createjs;

    var ToolPanel = function () {
        this.Container_constructor();
        this._init();
    };

    var p = c.extend(ToolPanel, c.Container);

    p._init = function () {
        this._tools = [];
        this._selectedToolType = nts.Painter.CONSTANT.TOOL_TYPE_PEN;

        this._penButton = new lib.PenButton();
        this._penButton._selectedIndex = 0;
        this._penButton.x = 0;
        this._penButton.on('click', this._handleClick, this);

        this._paintButton = new lib.PaintButton();
        this._paintButton._selectedIndex = 1;
        this._paintButton.x = this._penButton.x + this._penButton.nominalBounds.width;
        this._paintButton.on('click', this._handleClick, this);

        this._screenToneButton = new lib.ScreenToneButton();
        this._screenToneButton._selectedIndex = 2;
        this._screenToneButton.x = this._paintButton.x + this._paintButton.nominalBounds.width;
        this._screenToneButton.on('click', this._handleClick, this);

        this._eraserButton = new lib.EraseButton();
        this._eraserButton._selectedIndex = 3;
        this._eraserButton.x = this._screenToneButton.x + this._screenToneButton.nominalBounds.width;
        this._eraserButton.on('click', this._handleClick, this);

        this._tools[0] = this._penButton;
        this._tools[1] = this._paintButton;
        this._tools[2] = this._screenToneButton;
        this._tools[3] = this._eraserButton;

        this.width = 0;
        for (var i = 0; i < this._tools.length; i++)
            this.width += this._tools[i].nominalBounds.width;
        this.height = this._tools[0].nominalBounds.height;

        this.addChild(this._penButton);
        this.addChild(this._paintButton);
        this.addChild(this._screenToneButton);
        this.addChild(this._eraserButton);

        this.setSelectedIndex(0);
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

    p._updateStats = function (selectedIndex) {
        this._selectedIndex = selectedIndex;
        this._selectedToolType = this._getToolType(selectedIndex);

        for (var i = 0; i < this._tools.length; i++) {
            var tool = this._tools[i];

            if (i == selectedIndex) {
                tool.gotoAndStop('selected');
            } else {
                tool.gotoAndStop('unSelected');
            }
        }
        this.update();
        this.dispatchEvent('toolChagne', true);
    };

    p._getToolType = function (index) {
        var type;
        var selectedTool = this._tools[index];

        switch (selectedTool) {
            case this._penButton:
                type = nts.Painter.CONSTANT.TOOL_TYPE_PEN;
                break;
            case this._paintButton:
                type = nts.Painter.CONSTANT.TOOL_TYPE_PAINT;
                break;
            case this._screenToneButton:
                type = nts.Painter.CONSTANT.TOOL_TYPE_SCREEN_TONE;
                break;
            case this._eraserButton:
                type = nts.Painter.CONSTANT.TOOL_TYPE_ERASER;
                break;
            default :
                type = nts.Painter.CONSTANT.TOOL_TYPE_PEN;
                break;
        }
        return type;
    };

    p._handleClick = function (evt) {
        this.setSelectedIndex(evt.currentTarget._selectedIndex);
    };

    p.getselectedIndex = function () {
        return this._selectedIndex;
    };
    p.setSelectedIndex = function (value) {
        this._selectedIndex = value;
        this._updateStats(this._selectedIndex);
    };

    p.getSelectedToolType = function () {
        return this._selectedToolType;
    };

    nts.Painter.ToolPanel = createjs.promote(ToolPanel, 'Container');
})();