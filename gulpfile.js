// List Tasks:

// serve (serve dev and watch files)
// serve:dist (serve build files)
// lint (lint to js)
// minify-js (js minify and sourcemaps)
// minify-css (css minify and sourcemaps)
// minify-html
// minFiles (minify-js, minify-css and minify-html)
// images (creates responsive jpg and png files)
// webp (creates webp files from jpg files)

// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const browserSync = require('browser-sync');
const responsive = require('gulp-responsive');
const webp = require('gulp-webp');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const minifycss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const jshint = require('gulp-jshint');

// File where the favicon markups are stored
const reload = browserSync.reload;

const src = {
  dev: {
    html: '*.html',
    css: 'css/*.css',
    js: 'js/*.js',
    img: 'img/'
  },
  dist: {
    html: 'dist/',
    css: 'dist/css/',
    js: 'dist/js/',
    img: 'dist/img/'
  }
};


// watch files for changes and reload
gulp.task('serve', () => {
  browserSync({
    port: 8000,
    injectChanges: true,
    server: {
      baseDir: '.'
    }
  });

  gulp.watch([src.dev.html, src.dev.css, src.dev.js]).on('change', reload);
});

// watch files for changes and reload
gulp.task('serve:dist', () => {
  browserSync({
    port: 8000,
    injectChanges: false,
    server: {
      baseDir: 'dist'
    }
  });
  // copy data folder to dist folder
  gulp.src(['data/**/*']).pipe(gulp.dest('dist/data/'));
  // copy manifest to dist folder
  // gulp.src(['./manifest.json']).pipe(gulp.dest('./dist/'));
  gulp.watch([src.dev.html, src.dev.css, src.dev.js]).on('change', reload);
});


// Concatenate & Minify-js
gulp.task('minify-js', () => {
  gulp.src(src.dev.js)
    .pipe(sourcemaps.init({ identityMap: true }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('maps', { includeContent: false, sourceRoot: src.dev.js }))
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest(src.dist.js));
});


// minify-css
gulp.task('minify-css', () => {
  gulp.src(src.dev.css)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(minifycss())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(src.dist.css));
});

// minify-html
gulp.task('minify-html', () => {
  gulp.src(src.dev.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(src.dist.html));
});

// Lint Task
gulp.task('lint', function() {
  return gulp.src('/js/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// Task for minify js(with sourcemaps), css and html
gulp.task('minFiles', ['minify-js', 'minify-css', 'minify-html']);

// generate responsive jpg files
gulp.task('images', () => {
  gulp.src(`${src.dev.img}*.{jpg,png}`)
    .pipe(responsive({
      // Resize all JPG images to three different sizes: 300, 400, and 600 pixels
      '*.jpg': [{
        width: 300,
        rename: { suffix: '_s' }
      }, {
        width: 300 * 2,
        rename: { suffix: '_s_2x' }
      }, {
        width: 400,
        rename: { suffix: '_m' }
      }, {
        width: 400 * 2,
        rename: { suffix: '_m_2x' }
      }, {
        width: 600,
        rename: { suffix: '_l' }
      }, {
        // Compress, strip metadata, and rename original image
        rename: { suffix: '_original' }
      }],
      '*': {
        width: '100%'
      }

    }, {
      // Global configuration for all images
      errorOnEnlargement: false,
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 80,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
      max: true
    }))
    .pipe(gulp.dest(src.dev.img))
    .pipe(gulp.dest(src.dist.img));
});

// generate webp from responsive jpg files
gulp.task('webp', () => {
  gulp.src(`${src.dev.img}*.jpg`)
    .pipe(webp())
    .pipe(gulp.dest(src.dev.img))
    .pipe(gulp.dest(src.dist.img));
});