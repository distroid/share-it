var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  scripts: {
    src: './lib/share-it.js',
    dest: './lib/'
  }
};

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(uglify())
    .pipe(concat('share-it.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
}

exports.scripts = scripts;
exports.watch = watch;

var build = gulp.series(gulp.parallel(scripts));

gulp.task('build', build);
gulp.task('default', build);
