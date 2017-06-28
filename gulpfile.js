'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const del = require('del');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload();


// Clean operation
gulp.task('clean', () =>{
  // Globbing patterns account for .min and .map
  del(['public/**']);
  // del(['src/css']);
})


// Compile Sass task
gulp.task('compileSass', () => {
  return gulp.src('src/scss/application.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(concat('app.css'))
  .pipe(maps.write('.')) // Relative to output directory below
  .pipe(gulp.dest('public/css'));
});

// Concatinate CSS Libs
gulp.task('concatCss', () => {
  return gulp.src([
    'node_modules/bulma/css/bulma.css'
  ])
  .pipe(maps.init())
  .pipe(concat('libs.css'))
  .pipe(maps.write('.'))
  .pipe(gulp.dest('public/css'))
});

gulp.task('minifyCss', () => {
  return gulp.src('public/css/*.css')
  // .pipe(concat('libs.css'))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('public/css'));
});


// Concatinate JS
gulp.task('concatJs', () => {
  return gulp.src([
    // libs
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery-easing/dist/jquery.easing.1.3.umd.js',
    // My js
    'src/js/myjs.js',
  ])
  .pipe(maps.init())
  .pipe(concat('scripts.js'))
  .pipe(maps.write('.'))
  .pipe(gulp.dest('public/js'))
});


// // Minify scripts
// gulp.task('minifyScripts', ['concatScripts'], () => {
//   return gulp.src('js/app.js')
//   .pipe(uglify())
//   .pipe(rename('app.min.js'))
//   .pipe(gulp.dest('js'));
// });

// just reload
gulp.task('reload', () => {
  browserSync.reload();
});

// Concat scss and reload
gulp.task('sassReload', ['compileSass'], (done) => {
  browserSync.reload();
  done();
});


// Concat js and reload
gulp.task('jsReload', ['concatJs'], (done) => {
  browserSync.reload();
  done();
});

// Concat css and reload
gulp.task('cssReload', ['concatCss'], (done) => {
  browserSync.reload();
  done();
});


// Watch task
gulp.task('watchFiles', () => {
  gulp.watch(['src/scss/**/*.scss'], ['sassReload']);
  gulp.watch(['src/js/**/*.js'], ['jsReload']);
  gulp.watch(['node_modules/bulma/css/bulma.css'], ['cssReload']);
  // gulp.watch(['./**/**.*'], ['reload']);
});


gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: "localhost:8000",
    port: 5000,
    online: true,
    notify: false
 });
});


// Default task
gulp.task('default', () => {
  gulp.start('concatJs');
  gulp.start('compileSass');
  gulp.start('concatCss');
  gulp.start('watchFiles', ['compileSass']);
  nodemon({
		// the script to run the app
		script: 'app.js',
		ext: 'js'
	});
});
