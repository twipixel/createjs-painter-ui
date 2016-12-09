(function () {
    'use strict';

    var c = createjs;

    var ColorPickerPalette = function () {
        this.Container_constructor();
        this._init();
    };

    var p = c.extend(ColorPickerPalette, c.Container);

    p._init = function () {
        this.width = 260;
        this.height = 40;
        this._cells = [];
        this._colors = [];
        this._pushIndex = 0;
        this.CELL_WIDTH = 20;
        this.CELL_HEIGHT = 20;
        this.TOTAL_COLUMN = 2;
        this.CELLS_PER_ROW = 13;
        this._bg = new c.Shape();
        this.addChild(this._bg);
        this._paletteLine = new c.Shape();
        this._paletteLine.alpha = 0.3;
        this.addChild(this._paletteLine);

        this._fillBgRect();
        this._createCells();
        this._drawPaletteLine();

        this.selectedColorVO = new nts.Painter.ColorVO();
        this.on('click', this._clickHandler, this);
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

    p._fillBgRect = function () {
        this._bg.graphics.beginFill('#FFFFFF')
            .drawRect(0, 0, this.width, this.height)
            .endFill();
    };

    p._drawPaletteLine = function () {
        var sx = 0.5;
        var sy = 0.5;
        var w = this.width - 0.5;
        var h = this.height - 0.5;
        var halfHeight = this.height / 2 - 0.5;

        this._paletteLine.graphics.clear()
            .setStrokeStyle(0.5, 2, 0, 1)
            .beginStroke('#000000')
            .moveTo(sx, sy)
            .lineTo(w, sy)
            .lineTo(w, h)
            .lineTo(sx, h)
            .lineTo(sx, sy)
            .moveTo(sx, halfHeight)
            .lineTo(w, halfHeight);

        for (var i = 0; i < this.CELLS_PER_ROW - 1; i++) {
            var lineX = (i + 1) * this.CELL_WIDTH - 0.5;
            this._paletteLine.graphics.moveTo(lineX, sy)
                .lineTo(lineX, h);
        }

        this.update();
    };

    p._createCells = function () {
        for (var i = 0; i < this.getTotal(); i++) {
            var cell = this._cells[i] = new c.Shape();
            cell.x = (i % this.CELLS_PER_ROW) * this.CELL_WIDTH;
            cell.y = parseInt(i / this.CELLS_PER_ROW) * this.CELL_HEIGHT;
            this.addChild(cell);
        }
    };

    p._drawCells = function () {
        for (var i = 0; i < this.getTotal(); i++) {
            var cell = this._cells[i];
            cell.x = (i % this.CELLS_PER_ROW) * this.CELL_WIDTH;
            cell.y = parseInt(i / this.CELLS_PER_ROW) * this.CELL_HEIGHT;
            this._drawCell(i, cell, this._colors[i], (i == this.getTotal() - 1));
        }
    };

    p._drawCell = function (index, cell, colorVO, useUpdate) {
        if (colorVO === false) return;
        useUpdate = (!useUpdate) ? true : useUpdate;
        this._colors[index] = colorVO;

        cell.graphics.clear()
            .beginFill(colorVO.color)
            .drawRect(0, 0, this.CELL_WIDTH, this.CELL_HEIGHT)
            .endFill();

        cell.alpha = colorVO.alpha;

        if (useUpdate)
            this.update();
    };

    p.push = function (color, alpha) {
        alpha = parseInt(alpha * 100) / 100;

        if (this.hasColor(color, alpha))
            return;

        var colorVO = new nts.Painter.ColorVO(color, alpha);

        if (this._pushIndex < this.getTotal()) {
            this._drawCell(this._pushIndex, this._cells[this._pushIndex], colorVO);
            this._pushIndex = this._pushIndex + 1;
        } else {
            this._colors.shift();
            this._colors.push(colorVO);
            this._drawCells();
        }
    };

    p._clickHandler = function (event) {
        var localPoint = this.globalToLocal(event.stageX, event.stageY);
        var row = parseInt(localPoint.x / this.CELL_WIDTH);
        var column = parseInt(localPoint.y / this.CELL_HEIGHT);
        var colorIndex = column * this.CELLS_PER_ROW + row;

        if (this._colors[colorIndex]) {
            this.selectedColorVO = this._colors[colorIndex];
            this.dispatchEvent('selectColor');
        }
    };

    p.getTotal = function () {
        return this.TOTAL_COLUMN * this.CELLS_PER_ROW;
    };

    p.hasColor = function (color, alpha) {
        for (var i = 0; i < this._colors.length; i++) {
            var colorVO = this._colors[i];
            if (colorVO.color === color && this.isErrorRange(0.1, colorVO.alpha, alpha))
                return true;
        }
        return false;
    };

    /**
     * 오차 범위 안에 드는지 체크
     * 알파 값이 0.1 정도 차이 나는건 넣지 않도록 합니다.
     */
    p.isErrorRange = function(errorRange, num1, num2) {
        var dif = Math.abs(num1 - num2);
        if(dif <= errorRange)
            return true;

        return false;
    };

    nts.Painter.ColorPickerPalette = createjs.promote(ColorPickerPalette, 'Container');
})();