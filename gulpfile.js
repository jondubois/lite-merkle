var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var babel = require('gulp-babel');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('uglify-es');
var uglifyComposer = require('gulp-uglify/composer');
var minify = uglifyComposer(uglify, console);
var convertNewline = require('gulp-convert-newline');

var BUILD = 'browser';
var DIST = './';
var VERSION = require('./package.json').version;

// Add comment. Also, prepend the var keyword to the require variable
// declaration added by browserify.
var FULL_HEADER = (
  '/**\n' +
  ' * Proper Merkle v' + VERSION + '\n' +
  ' */\n '
);

gulp.task('browserify', function (done) {
  var stream = browserify({
    builtins: ['_process', 'buffer'],
    entries: 'index.js',
    standalone: 'LiteMerkle'
  })
    .require('./index.js', {
      expose: 'lite-merkle'
    })
    .bundle();
  return stream.pipe(source('lite-merkle.js'))
    // .pipe(insert.prepend(FULL_HEADER))
    .pipe(convertNewline({
      newline: 'lf',
      encoding: 'utf8'
    }))
    .pipe(gulp.dest(DIST));
});

gulp.task('minify', function () {
  return gulp.src(DIST + 'lite-merkle.js')
    .pipe(babel({
      comments: false
    }))
    .pipe(babel({
      plugins: ['minify-dead-code-elimination']
    }))
    .pipe(minify())
    .pipe(insert.prepend(FULL_HEADER))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(DIST));
});
