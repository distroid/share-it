var gulp   = require('gulp-param')(require('gulp'), process.argv);  // Gulp JS
var concat = require('gulp-concat');                                // Files concat
var uglify = require('gulp-uglify');                                // JS minifier
var csso   = require('gulp-csso');                                  // CSS minifier

var js_all_path = [
    './demo/vendors/libs/angular.js',
    './demo/vendors/libs/underscore.js',
    './demo/vendors/libs/codemirror/codemirror.js',
    './demo/vendors/libs/codemirror/xml.js',
    './demo/vendors/app.js',
    './demo/vendors/dashboard/directive.js',
    './demo/vendors/dashboard/controller-main.js',
];

var js_app_path = [
    './lib/share-it.js',
];

var css_vendors_path = [
    './demo/vendors/style.css',
    './demo/vendors/libs/bootstrap/css/bootstrap.min.css',
    './demo/vendors/libs/codemirror/codemirror.css',
];

function js_vendor(asset_version)
{
    asset_version = asset_version || '';
    gulp.src(js_all_path).pipe(uglify({mangle: false})).pipe(concat('min-app'+asset_version+'.js')).pipe(gulp.dest('./demo/assets/'));
}

function js_app(asset_version)
{
    asset_version = asset_version || '';
    gulp.src(js_app_path).pipe(uglify({mangle: false})).pipe(concat('share-it.min'+asset_version+'.js')).pipe(gulp.dest('./demo/assets/'));
    gulp.src(js_app_path).pipe(uglify({mangle: false})).pipe(concat('share-it.min'+asset_version+'.js')).pipe(gulp.dest('./lib/'));
}

function css_vendors(asset_version)
{
    asset_version = asset_version || '';
    gulp.src(css_vendors_path).pipe(concat('min-vendor'+asset_version+'.css')).pipe(csso()).pipe(gulp.dest('./demo/assets/'));
}

gulp.task('all',     function(asset_version) { js_vendor(asset_version); js_app(asset_version); css_vendors(asset_version); });
gulp.task('js_vendor',  function(asset_version) { js_vendor(asset_version); });
gulp.task('js_app',  function(asset_version) { js_app(asset_version); });
gulp.task('css_vendors', function(asset_version) { css_vendors(asset_version); });
gulp.task('monitor', function () {
    gulp.watch(js_all_path,      ['js_vendor']);
    gulp.watch(js_app_path,      ['js_app']);
    gulp.watch(css_vendors_path, ['css_vendors']);
});
