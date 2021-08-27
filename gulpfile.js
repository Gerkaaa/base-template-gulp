const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

function html() {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream())
}

function styles() {
  return gulp.src([
    './src/sass/main.sass',
  ])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minify({
      level: 2
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css/'))
    .pipe(browserSync.stream())
}

function scripts() {
  return gulp.src([
    './src/js/**/*.js',
  ])
    .pipe(gulp.dest('./build/js/'))
    .pipe(browserSync.stream())
}

function images() {
  return gulp.src('./src/img/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('./build/img/'))
}

function watch() {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  });

  gulp.watch('./src/*.html', html);
  gulp.watch('./src/sass/**/*.sass', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/img/**/*', images);
  gulp.watch('./src/*.html').on('change', browserSync.reload);
}

function cleanBuild() {
  return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('img', images);
gulp.task('watch', watch);

gulp.task('build', gulp.series(cleanBuild, gulp.parallel(html, styles, scripts, images)));
gulp.task('dev', gulp.series('build', watch));