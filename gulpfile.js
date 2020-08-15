const gulp = require('gulp');
const { parallel } = gulp;
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const stripCssComments = require('gulp-strip-css-comments');
const inject = require('gulp-inject');

sass.compiler = require('sass');

const build = () =>
  gulp
    .src('./src/*.scss')
    .pipe(
      sass({
        includePaths: ['node_modules'],
        outputStyle: 'compressed',
      }).on('error', sass.logError)
    )
    .pipe(
      stripCssComments({
        preserve: /komi/,
      })
    )
    .pipe(gulp.dest('./dist'));

const docs = () => {
  const target = gulp.src('docs/src/**/!(_)*.pug');
  const sources = gulp.src('./docs/dist/*.css', { read: false });
  return target
    .pipe(pug({ pretty: true }))
    .pipe(
      inject(sources, {
        ignorePath: 'docs',
        removeTags: true,
        addPrefix: 'komi.css',
      })
    )
    .pipe(gulp.dest('./docs/'));
};

const dev_docs = () => {
  const target = gulp.src('docs/src/**/!(_)*.pug');
  const sources = gulp.src('./docs/dist/*.css', { read: false });
  return target
    .pipe(pug({ pretty: true }))
    .pipe(
      inject(sources, {
        relative: true,
        removeTags: true,
      })
    )
    .pipe(gulp.dest('./docs/'));
};

const docs_css = () =>
  gulp
    .src(['./src/*.scss', './docs/src/scss/*.scss'])
    .pipe(
      sass({
        includePaths: ['node_modules'],
        outputStyle: 'compressed',
      }).on('error', sass.logError)
    )
    .pipe(
      stripCssComments({
        preserve: /komi/,
      })
    )
    .pipe(gulp.dest('./docs/dist'));

const watch = () => {
  gulp.watch('./**/*.scss', parallel(build, docs_css));
  gulp.watch('./**/*.pug', dev_docs);
};

exports.build = parallel(build, docs);
exports.watch = watch;
exports.docs = parallel(docs, docs_css);
exports.default = build;
