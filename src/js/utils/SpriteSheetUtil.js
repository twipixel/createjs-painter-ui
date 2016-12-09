(function () {
    'use strict';

    var c = createjs;

    var SpriteSheetUtil = function () {

    };

    SpriteSheetUtil.getRect = function (instance) {
        if (instance instanceof c.Sprite)
            return instance.spriteSheet._frames[instance._currentFrame].rect;

        return null;
    };

    SpriteSheetUtil.getImage = function(instance) {
        if (instance instanceof c.Sprite)
            return instance.spriteSheet._frames[instance._currentFrame].image;

        return null;
    };

    SpriteSheetUtil.getShadowCanvas = function(width, height) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas.setAttribute('id', 'offscreen');
        //document.body.appendChild(canvas);
        return canvas;
    };

    nts.Painter.SpriteSheetUtil = SpriteSheetUtil;
})();