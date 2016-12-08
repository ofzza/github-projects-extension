/**
 * GULP file
 *
 * This Node script is executed when you run `gulp`. It's purpose is
 * to load the Gulp tasks in your project's `tasks` folder, and allow
 * you to add and remove tasks as you see fit.
 *
 * WARNING:
 * Unless you know what you're doing, you shouldn't change this file.
 * Check out the `tasks` directory instead.
 */

// Load dependencies
// --------------------------------------------------------------------------------------------------------------------
const gulp        = require('gulp'),
      util        = require('gulp-util');
      gulpsync    = require('gulp-sync')(gulp);
      clean       = require('gulp-clean'),
      babel       = require('gulp-babel'),
      sourcemaps  = require('gulp-sourcemaps'),
      uglify      = require('gulp-uglify'),
      watch       = require('gulp-watch');

// Define a clear task (to be executed before a clean build)
// --------------------------------------------------------------------------------------------------------------------
gulp.task('clear@build', () => {
  return gulp.src('./dist', { read: false })
    .pipe(clean({force: true}));
});

// Define copy task
// --------------------------------------------------------------------------------------------------------------------
let otherFiletypes = [
  './src/**/*.png', 
  './src/**/*.ico', 
  './src/**/*.json'
];
gulp.task('copy@build', () => {
  return gulp.src(otherFiletypes)
    .pipe(gulp.dest('./dist'));
});
// ... and attached watcher
gulp.task('watch.copy@build', () => {
  watch(otherFiletypes, () => { gulp.start('copy@build'); });
});

// ... and library copy task
let libraries = [
    './node_modules/jquery/dist/jquery.slim.min.js',
    './node_modules/lodash/lodash.min.js'
  ];
gulp.task('copy@libs', () => {
  return gulp.src(libraries)
    .pipe(gulp.dest('./dist/content/libs'));
});

// Define ES6 transpile task
// --------------------------------------------------------------------------------------------------------------------
gulp.task('transpile@build', () => {
  return gulp.src('./src/**/*.js')
    .pipe(!util.env.production ? sourcemaps.init() : util.noop())
    .pipe(babel({presets: ['es2015']}))
      .on('error', function (err){
        console.log();
        console.error('ERROR while executing "server.transpile[babel]" task:'.red, err.message.yellow);
        console.log();
        this.emit('end');
      })
    .pipe(uglify({ mangle: true }))
    .pipe(!util.env.production ? sourcemaps.write('.', { includeContent: true, sourceRoot: '../src' }) : util.noop())
    .pipe(gulp.dest('./dist'));
});
// ... and attached watcher
gulp.task('watch.transpile@build', () => {
  watch('./src/**/*.js', () => { gulp.start('transpile@build'); });
});

// Define root tasks
// --------------------------------------------------------------------------------------------------------------------
gulp.task('build', gulpsync.sync(['clear@build', 'copy@build', 'copy@libs', 'transpile@build']));
gulp.task('watch', gulpsync.sync(['watch.copy@build', 'watch.transpile@build']));