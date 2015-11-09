var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('html', function () {
  return gulp.src('client/**/*.html').pipe(gulp.dest('build/dev'));
});

gulp.task('ts', function () {
  var tsResult = gulp.src('client/app/**/*.ts')
        .pipe(sourcemaps.init()) 
        .pipe(ts(tsProject));
    
    return tsResult.js
                .pipe(concat('main.js')) // You can use other plugins that also support gulp-sourcemaps 
                .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
                .pipe(gulp.dest('.tmp/build/js'));
});

gulp.task('javascript', ['ts'], function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './.tmp/build/js/main.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/dev/js/'));
});

gulp.task('default', ['html','javascript']);