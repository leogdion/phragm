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
var staticServer = require('node-static');

gulp.task('clean', function () {
  return del([
    'build/**/*',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    '.tmp/**/*'
  ]);
});

gulp.task('dev:client:html:copy', ['clean'], function () {
  return gulp.src('client/**/*.html').pipe(gulp.dest('build/dev/client'));
});

gulp.task('dev:server:js:ts', ['clean'], function () {
var tsProject = ts.createProject('tsconfig.json');
  var tsResult = gulp.src('server/**/*.ts')
        .pipe(sourcemaps.init()) 
        .pipe(ts(tsProject));
    
    return tsResult.js
                //.pipe(concat('index.js')) // You can use other plugins that also support gulp-sourcemaps 
                .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
                .pipe(gulp.dest('build/dev/server'));
});

gulp.task('dev:client:js:ts', ['clean'], function () {
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

gulp.task('dev:client:js:browserify', ['dev:client:js:ts', 'clean'], function () {
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

gulp.task('dev:client:html', ['dev:client:html:copy']);

gulp.task('dev:client:js', ['dev:client:js:browserify', 'dev:client:js:ts']);

gulp.task('dev:client', ['dev:client:js', 'dev:client:html']);

gulp.task('dev:server:js', ['dev:server:js:ts']);

gulp.task('dev:server', ['dev:server:js']);

gulp.task('dev', ['dev:client', 'dev:server']);

gulp.task('dev:serve', ['dev'], function () {
var gls = require('gulp-live-server');
  var server = gls.new('build/dev/server');
  server.start(); 
var fileServer = new staticServer.Server('build/dev/client');

  console.log("[node-static] listening on 8080 ...")
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(8080);
});

gulp.task('default', ['dev']);