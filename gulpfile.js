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
const _           = require('lodash'),
      fs          = require('fs'),
      gulp        = require('gulp'),
      util        = require('gulp-util');
      clean       = require('gulp-clean'),
      less        = require('gulp-less'),
      babel       = require('gulp-babel'),
      babelify    = require('babelify'),
      browserify  = require('browserify'),
      source      = require('vinyl-source-stream'),
      buffer      = require('vinyl-buffer'),
      sourcemaps  = require('gulp-sourcemaps'),
      uglify      = require('gulp-uglify'),
      zip         = require('gulp-zip');

// Load package info
// --------------------------------------------------------------------------------------------------------------------
const pck         = require('./package.json');

// Define a clear task (to be executed before a clean build)
// --------------------------------------------------------------------------------------------------------------------
gulp.task('clear@build', () => {
  return gulp.src('./dist', { read: false })
    .pipe(clean({force: true}));
});

// Define manifest merge task
// --------------------------------------------------------------------------------------------------------------------
gulp.task('mainfest@build', () => {
  // Load manifests
  let manifest = require('./src/manifest.json'),
      githubManifest = _.merge({}, manifest, require('./src/manifest.githubcom.json'), { version: pck.version }),
      enterpriseManifest = _.merge({}, manifest, require('./src/manifest.enterprise.json'), { version: pck.version });
  fs.writeFileSync('./dist/github.com/manifest.json', JSON.stringify(githubManifest));
  fs.writeFileSync('./dist/enterprise/manifest.json', JSON.stringify(enterpriseManifest));
  return Promise.resolve();
});
// ... and attached watcher
gulp.task('watch.mainfest@build', () => {
  gulp.watch(['./src/**/*.json'], gulp.series('mainfest@build'));
});

// Define copy task
// --------------------------------------------------------------------------------------------------------------------
let otherFiletypes = [
  './src/**/*.png', 
  './src/**/*.ico'
];
gulp.task('copy@build', () => {
  return gulp.src(otherFiletypes)
    .pipe(gulp.dest('./dist/github.com'))
    .pipe(gulp.dest('./dist/enterprise'));
});
// ... and attached watcher
gulp.task('watch.copy@build', () => {
  gulp.watch(otherFiletypes, gulp.series('copy@build'));
});

// ... and library copy task
let libraries = [ ];
gulp.task('copy@libs', () => {
  return gulp.src(libraries)
    .pipe(gulp.dest('./dist/github.com/content/libs'))
    .pipe(gulp.dest('./dist/enterprise/content/libs'));
});

// Define LESS transpile task
// --------------------------------------------------------------------------------------------------------------------
gulp.task('less@build', () => {
  return gulp.src('./src/content/github/style.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/github.com'))
    .pipe(gulp.dest('./dist/enterprise'));
});
// ... and attached watcher
gulp.task('watch.less@build', () => {
  gulp.watch('./src/content/github/**/*.less', gulp.series('less@build'));
});

// Define ES6 transpile task
// --------------------------------------------------------------------------------------------------------------------
gulp.task('transpile@build', () => {
  return browserify({
    entries: ['./src/content/bootstrap.js'],
    debug: !util.env.production
  })
    .transform(['babelify', {presets: ['@babel/preset-env']}])
    .bundle()
    .pipe(source('bootstrap.js'))
    .pipe(buffer())
    .pipe(!util.env.production ? sourcemaps.init() : util.noop())
    .pipe(uglify({ mangle: true }))
    .pipe(!util.env.production ? sourcemaps.write('.', { includeContent: true, sourceRoot: '../src' }) : util.noop())
    .pipe(gulp.dest('./dist/github.com/'))
    .pipe(gulp.dest('./dist/enterprise/'));
});
// ... and attached watcher
gulp.task('watch.transpile@build', () => {
  gulp.watch('./src/**/*.js', gulp.series('transpile@build'));
});

// Define zip task
// --------------------------------------------------------------------------------------------------------------------
gulp.task('zip.githubcom@build', () => {
  return gulp.src(['./dist/github.com/**/*'])
    .pipe(zip(`dist.githubcom.v${pck.version}.zip`))
    .pipe(gulp.dest(`./versions/${util.env.production ? 'prod' : 'dev'}`));
});
gulp.task('zip.enterprise@build', () => {
  return gulp.src(['./dist/enterprise/**/*'])
    .pipe(zip(`dist.enterprise.v${pck.version}.zip`))
    .pipe(gulp.dest(`./versions/${util.env.production ? 'prod' : 'dev'}`));
});
gulp.task('zip.build', gulp.series(['zip.githubcom@build', 'zip.enterprise@build' ]));
// ... and attached watcher
gulp.task('watch.zip@build', () => {
  gulp.watch(['./dist/**/*'], gulp.series(['zip.githubcom@build', 'zip.enterprise@build']));
});


// Define root tasks
// --------------------------------------------------------------------------------------------------------------------
gulp.task('build', gulp.series(['clear@build', 'copy@build', 'less@build', /*'copy@libs',*/ 'transpile@build', 'mainfest@build', 'zip.build']));
gulp.task('watch', gulp.parallel(['watch.copy@build', 'watch.less@build', 'watch.transpile@build', 'watch.mainfest@build', 'watch.zip@build']));
