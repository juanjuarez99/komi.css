const gulp = require('gulp');
const { parallel } = gulp;
const sass = require('gulp-sass');
const pug = require('gulp-pug');

sass.compiler = require('sass');

const build = () =>
  gulp
    .src('./src/*.scss')
    .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist'));

const docs = () =>
  gulp
    .src('docs/src/**/!(_)*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('./docs/'));

const docs_css = () =>
  gulp
    .src(['./src/*.scss', './docs/src/scss/*.scss'])
    .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
    .pipe(gulp.dest('./docs/dist'));

const watch = () => {
  gulp.watch('./**/*.scss', build);
  gulp.watch('./**/*.pug', docs);
};

exports.build = build;
exports.watch = watch;
exports.docs = parallel(docs, docs_css);
exports.default = build;
