var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var inlineNg2Template = require('gulp-inline-ng2-template');
var del = require('del');
var gls = require('gulp-live-server');

gulp.task('clean', function () {
  return del([
    'build/**/*',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    '.tmp/**/*'
  ]);
});

gulp.task('html-client', ['clean'], function () {
  return gulp.src('client/**/*.html').pipe(gulp.dest('build/dev/client'));
});

gulp.task('ts-server', ['clean'], function () {
var tsProject = ts.createProject('tsconfig.json');
  var tsResult = gulp.src('server/**/*.ts')
        .pipe(sourcemaps.init()) 
        .pipe(ts(tsProject));
    
    return tsResult.js
                //.pipe(concat('index.js')) // You can use other plugins that also support gulp-sourcemaps 
                .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
                .pipe(gulp.dest('build/dev/server'));
});

gulp.task('ts-client', ['clean'], function () {
var tsProject = ts.createProject('tsconfig.json');
  var tsResult = gulp.src('client/js/**/*.ts')
        .pipe(sourcemaps.init()) 
        .pipe(inlineNg2Template({ base: '/client/js' }))
        .pipe(ts(tsProject));
    
    return tsResult.js
                //.pipe(concat('index.js')) // You can use other plugins that also support gulp-sourcemaps 
                .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
                .pipe(gulp.dest('.tmp/build/client/js'));
});

gulp.task('javascript-client', ['ts-client', 'clean'], function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './.tmp/build/client/js/index.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/dev/client/js/'));
});

gulp.task('server-start', ['ts-server'], function () {
  var server = gls.new('build/dev/server');
    server.start(); 
});

gulp.task('default', ['html-client','javascript-client','ts-server']);