var gulp   = require('gulp-param')(require('gulp'), process.argv);  // Gulp JS
var concat = require('gulp-concat');                                // Files concat
var uglify = require('gulp-uglify');                                // JS minifier
var csso   = require('gulp-csso');                                  // CSS minifier

var js_app_path = [
    './lib/share-it.js',
];

function js_app(asset_version)
{
    asset_version || (asset_version = '');
    gulp.src(js_app_path)
        .pipe(uglify({ mangle: false }))
        .pipe(concat('share-it.min' + asset_version + '.js'))
        .pipe(gulp.dest('./lib/'));
}

gulp.task('js_app',  function(asset_version) { js_app(asset_version); });
gulp.task('watch', function () {
    gulp.watch(js_app_path, ['js_app']);
});
gulp.task('default', ['js_app'])
