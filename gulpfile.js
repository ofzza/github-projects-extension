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
      gulpsync    = require('gulp-sync')(gulp);
      clean       = require('gulp-clean'),
      babel       = require('gulp-babel'),
      sourcemaps  = require('gulp-sourcemaps'),
      uglify      = require('gulp-uglify'),
      zip         = require('gulp-zip'),
      watch       = require('gulp-watch');

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
});
// ... and attached watcher
gulp.task('watch.mainfest@build', () => {
  watch(['./src/**/*.json'], () => { gulp.start('mainfest@build'); });
});

// Define copy task
// --------------------------------------------------------------------------------------------------------------------
let otherFiletypes = [
  './src/**/*.png', 
  './src/**/*.ico', 
  './src/**/*.css'
];
gulp.task('copy@build', () => {
  return gulp.src(otherFiletypes)
    .pipe(gulp.dest('./dist/github.com'))
    .pipe(gulp.dest('./dist/enterprise'));
});
// ... and attached watcher
gulp.task('watch.copy@build', () => {
  watch(otherFiletypes, () => { gulp.start('copy@build'); });
});

// ... and library copy task
let libraries = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/lodash/lodash.min.js'
  ];
gulp.task('copy@libs', () => {
  return gulp.src(libraries)
    .pipe(gulp.dest('./dist/github.com/content/libs'))
    .pipe(gulp.dest('./dist/enterprise/content/libs'));
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
    .pipe(gulp.dest('./dist/github.com'))
    .pipe(gulp.dest('./dist/enterprise'));
});
// ... and attached watcher
gulp.task('watch.transpile@build', () => {
  watch('./src/**/*.js', () => { gulp.start('transpile@build'); });
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
gulp.task('zip.build', ['zip.githubcom@build', 'zip.enterprise@build' ]);
// ... and attached watcher
gulp.task('watch.zip@build', () => {
  watch(['./dist/**/*'], () => {
    gulp.start('zip.githubcom@build'); 
    gulp.start('zip.enterprise@build'); 
  });
});


// Define root tasks
// --------------------------------------------------------------------------------------------------------------------
gulp.task('build', gulpsync.sync(['clear@build', 'copy@build', 'copy@libs', 'mainfest@build', 'transpile@build', 'zip.build']));
gulp.task('watch', ['watch.copy@build', 'watch.mainfest@build', 'watch.transpile@build', 'watch.zip@build']);