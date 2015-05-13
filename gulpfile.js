var gulp = require('gulp');
var _ = require('lodash');
var karma = require('karma').server;
var ts = require('gulp-typescript');
var watch = require('gulp-watch');
var merge = require('merge2');

//one could also externalize common config into a separate file,
//ex.: var karmaCommonConf = require('./karma-common-conf.js');
var karmaCommonConf = {
  browsers: ['Chrome'],
  frameworks: ['jasmine'],
  files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/myApp.js',
      'app/controller.js',
      'test/*.spec.js'
  ]
};

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start(_.assign({}, karmaCommonConf, {singleRun: true}), done);
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  karma.start(karmaCommonConf, done);
});

var tsProject = ts.createProject({
    declarationFiles: false,
    noExternalResolve: true
});

gulp.task('scripts', function() {
    var tsResult = gulp.src('source/**/*.ts')
                    .pipe(ts(tsProject));
 
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.  
        tsResult.dts.pipe(gulp.dest('build/definitions')),
        tsResult.js.pipe(gulp.dest('build/js'))
    ]);
});

gulp.task("watch", function() {
    watch("source/**/*.ts", function() {
        gulp.start("scripts");
    });
});

gulp.task('default', ['watch']);