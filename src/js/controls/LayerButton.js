(function () {
    'use strict';

    var c = createjs;

    var LayerButton = function (type, label) {
        this.Container_constructor();
        this._init(type, label);
    };

    LayerButton.TYPE_REST = 'typeRest';
    LayerButton.TYPE_FIRST = 'typeFirst';

    var p = c.extend(LayerButton, c.Container);

    p._init = function (type, label) {
        this._visible = true;
        this._selected = false;
        this._labelFieldColorNormal = '#666666';
        this._labelFieldColorSelected = '#ffffff';

        this._visibleOn = new lib.IconLayerVisibleOn();
        this._visibleOff = new lib.IconLayerVisibleOff();
        this._visibleSelected = new lib.IconLayerVisibleSelected();
        this._visibleOff.visible = false;
        this._visibleSelected.visible = false;

        this._labelField = new c.Text(label, '12px', this._labelFieldColorNormal);

        if (type === nts.Painter.LayerButton.TYPE_FIRST) {
            this._tabButton = new nts.Painter.SimpleButton(lib.ButtonTab1Normal, lib.ButtonTab1Selected, true);
            this.addChild(this._tabButton);

            this._labelField.x = 45;
            this._visibleOn.x = this._visibleOff.x = this._visibleSelected.x = 12;
        } else {
            this._tabButton = new nts.Painter.SimpleButton(lib.ButtonTab2Normal, lib.ButtonTab2Selected, true);
            this.addChild(this._tabButton);

            this._labelField.x = 55;
            this._visibleOn.x = this._visibleOff.x = this._visibleSelected.x = 22;
        }

        this.width = this._tabButton.width;
        this.height = this._tabButton.height;

        this._visibleOn.y = this._visibleOff.y = this._visibleSelected.y = 4;
        this.addChild(this._visibleOn);
        this.addChild(this._visibleOff);
        this.addChild(this._visibleSelected);

        this._labelField.y = 12;
        this.addChild(this._labelField);

        this._tabButton.on('click', this._clickHandler, this);
        this._visibleOn.on('click', this._visibleHandler, this);
        this._visibleOff.on('click', this._visibleHandler, this);

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

    p._clickHandler = function () {
        this.setSelected(!this._selected);
        this.dispatchEvent('changeSelected');
    };

    p._visibleHandler = function () {
        this.setVisible(!this._visible);
        this.dispatchEvent('changeVisible');
    };

    p.setSelected = function (selected) {
        this._visible = true;
        this._selected = selected;
        this._updateSelected(this._selected);
    };

    p.getSelected = function () {
        return this._selected;
    };

    p._updateSelected = function (selected) {
        if (selected) {
            this._visibleOn.visible = false;
            this._visibleOff.visible = false;
            this._tabButton.setSelected(true);
            this._visibleSelected.visible = true;
            this._labelField.color = this._labelFieldColorSelected;
        } else {
            this._visibleOn.visible = true;
            this._visibleOff.visible = false;
            this._tabButton.setSelected(false);
            this._visibleSelected.visible = false;
            this._labelField.color = this._labelFieldColorNormal;
        }
        this.update();
    };

    p.setVisible = function (visible) {
        this._visible = visible;
        this._udpateVisible(this._visible);
    };

    p.getVisible = function () {
        return this._visible;
    };

    p._udpateVisible = function (visible) {
        this._visibleOn.visible = visible;
        this._visibleOff.visible = !visible;
        this.update();
    };

    nts.Painter.LayerButton = createjs.promote(LayerButton, 'Container');
})();