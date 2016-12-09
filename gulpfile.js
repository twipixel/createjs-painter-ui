// gulpfile.js
var gulp = require('gulp'),
    clean = require('gulp-clean'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    ftp = require("vinyl-ftp");

var paths = {
    js: [
        // Asset
        //'src/assets/Assets.js',

        // Namespace
        'src/js/namespace.js',

        // CONSTANT
        'src/js/constant/CONSTANT.js',

        // VO
        'src/js/vo/ColorVO.js',
        'src/js/vo/EraserVO.js',
        'src/js/vo/HSVPaletteVO.js',
        'src/js/vo/HueBarVO.js',
        'src/js/vo/PaintVO.js',
        'src/js/vo/PenVO.js',
        'src/js/vo/ScreenToneVO.js',
        'src/js/vo/ToolSettingVO.js',
        'src/js/vo/ToolVO.js',

        // Controls
        'src/js/controls/ColorMagnifier.js',
        'src/js/controls/ColorPicker.js',
        'src/js/controls/ColorPickerPalette.js',
        'src/js/controls/HSVPalette.js',
        'src/js/controls/HueBar.js',
        'src/js/controls/LayerButton.js',
        'src/js/controls/PenSizeDisplayer.js',
        'src/js/controls/Popup.js',
        'src/js/controls/ScreenToneButton.js',
        'src/js/controls/SimpleButton.js',
        'src/js/controls/Slider.js',
        'src/js/controls/ToolPanel.js',
        'src/js/controls/ToolSettingPanel.js',

        // Util
        'src/js/utils/ColorUtil.js',
        'src/js/utils/SpriteSheetUtil.js',

        // Core
        'src/js/core/Layers.js',
        'src/js/core/Eraser.js',
        'src/js/core/Paint.js',
        'src/js/core/Screentone.js',
        'src/js/core/Pen.js',
        'src/js/core/Transformation.js',
        'src/js/core/History.js',
        'src/js/core/IO.js',

        // UILoadingScript
        'src/js/utils/UILoadingScript.js',

        // DrawingBoard
        'src/js/DrawingBoard.js'
    ]
};


gulp.task('clean', function () {
return gulp
    .src('build', {read: false, force: true})
    .pipe(clean());
});

gulp.task('copy-assets', function () {
    return gulp
        .src(['src/assets/*'])
        .pipe(gulp.dest('build/assets'));
});

gulp.task('copy-image', function () {
    return gulp
        .src(['src/img/*'])
        .pipe(gulp.dest('build/img'));
});

gulp.task('copy-html', function () {
    return gulp
        .src(['src/index_build.html'])
        .pipe(rename('index.html'))
        .pipe(gulp.dest('build'));
});

gulp.task('copy-js', function () {
   return gulp
        .src(paths.js)
        .pipe(uglify())
        .pipe(concat('nts.painter.min.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('build', ['copy-assets',  'copy-image', 'copy-html', 'copy-js']);
gulp.task('build-and-upload', ['build', 'build-and-deploy']);
gulp.task('default', ['build']);
gulp.task('watch', function() {
    gulp.watch(paths.js, ['build']);
});