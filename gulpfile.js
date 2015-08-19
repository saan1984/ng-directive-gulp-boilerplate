var fs = require('fs'),
    gulp = require('gulp'),
    connect = require('gulp-connect'),
    karma = require('karma').Server,
    concat = require('gulp-concat'),
    jscs = require('gulp-jscs'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    es = require('event-stream'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCSS = require('gulp-minify-css'),
    templateCache = require('gulp-angular-templatecache'),
    plumber = require('gulp-plumber'),
    open = require('gulp-open'),
    less = require('gulp-less'),
    order = require("gulp-order");

var config = {
    pkg : JSON.parse(fs.readFileSync('./package.json')),
    banner:
    '/*!\n' +
    ' * <%= pkg.name %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
    ' * License: <%= pkg.license %>\n' +
    ' */\n\n\n'
};

gulp.task('connect', function() {
    connect.server({
        root: [__dirname],
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src(['./demo/*.html', '.src/*.html'])
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./demo/**/*.html'], ['html']);
    gulp.watch(['./**/*.less'], ['styles']);
    gulp.watch(['./src/**/*.js','./demo/**/*.js', './**/*.html'], ['scripts']);
});

gulp.task('clean', function(cb) {
    return del(['dist/*.*'], cb);
});

gulp.task('scripts', function() {

    function buildTemplates() {
        return gulp.src('src/**/*.html')
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(templateCache({module: 'my.directives'}));
    };

    function buildDistJS(){
        return gulp.src('src/directive.js')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(jscs())
    };

    es.merge(buildDistJS(), buildTemplates())
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(order([
            'directive.js',
            'template.js'
        ]))
        .pipe(concat('directive.js'))
        .pipe(header(config.banner, {
            timestamp: (new Date()).toISOString(), pkg: config.pkg
        }))
        .pipe(gulp.dest('dist'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});


gulp.task('styles', function() {

    return gulp.src('src/directive.less')
        .pipe(less())
        .pipe(header(config.banner, {
            timestamp: (new Date()).toISOString(), pkg: config.pkg
        }))
        .pipe(gulp.dest('dist'))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('demoStyles', function() {

    return gulp.src('demo/demo.less')
        .pipe(less())
        .pipe(header(config.banner, {
            timestamp: (new Date()).toISOString(), pkg: config.pkg
        }))
        .pipe(gulp.dest('demo'))
        .pipe(connect.reload());
});

gulp.task('open', function(){
    gulp.src('./demo/demo.html')
        .pipe(open({app: 'chrome',uri: 'http://localhost:8080/demo/demo.html'}));
});

gulp.task('jscs-test', function(){
    return gulp.src('./test/**/*.js').pipe(jscs());
})

gulp.task('karma', function (done) {
    new karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
};

gulp.task('build', ['clean', 'scripts', 'styles','demoStyles']);
gulp.task('serve', ['build', 'connect', 'watch', 'open']);
gulp.task('default', ['build', 'test']);
gulp.task('test', ['build', 'jscs-test', 'karma']);
