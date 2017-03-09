'use strict';

// plugins for development
var gulp = require('gulp'),
		rimraf = require('rimraf'),
		pug = require('gulp-pug'),
		sass = require('gulp-sass'),
		prefixer = require('gulp-autoprefixer'),
		plumber = require('gulp-plumber'),

// plugins for build
		uglify = require('gulp-uglify'),
		cssmin = require('gulp-csso'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		sassGlob = require('gulp-sass-glob'),
		cssimport = require('gulp-cssimport'),

//plugins for svg
		svgSprite = require('gulp-svg-sprite'),
		svgmin = require('gulp-svgmin'),
		svgstore = require('gulp-svgstore'),

//watching
		watch = require('gulp-watch'),

//others
		rename = require('gulp-rename'),
		sourcemaps = require('gulp-sourcemaps'),
		rigger = require('gulp-rigger'),
		browserSync = require('browser-sync'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		reload = browserSync.reload;


//paths

var path = {
	build: { //готовые после сборки файлы
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: { //Пути откуда брать исходники
		pug: 'src/pug/',
		js: 'src/js/**/*.js',
		sass: 'src/css/**/*.scss',
		sassEntry: 'src/css/base.scss',
		img: 'src/img/**/*.*',
		svg: 'src/img/icons/*.svg',
		fonts: 'src/fonts/*.{woff,woff2}*'
	},
	watch: { //за изменением каких файлов наблюдать
		pug: 'src/pug/',
		js: 'src/js/**/*.js',
		sass: 'src/css/**/*.scss',
		sassEntry: 'src/css/base.scss',
		libs: 'src/css/libs/*.css',
		img: 'src/img/**/*.*',
		svg: 'src/img/icons/*.svg',
		fonts: 'src/fonts/*.{woff,woff2}*'
	},
	clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Orange"
};

//Compiling

gulp.task('pug:build', function () {
	gulp.src([path.src.pug + '*.pug', '!' + path.src.pug + '_*.pug'])
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем main файл
		.pipe(plumber())
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
				.pipe(browserSync.stream());
});

gulp.task('browserify', function() {
    return browserify('src/js/libs/kdx-ghostgrid.js')
	    .bundle()
		.pipe(source('libs/kdx-ghostgrid.js'))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function () {
    gulp.src(path.src.sassEntry) //Выберем наш main.scss
				.pipe(plumber())
				.pipe(sassGlob())
        .pipe(sass()) //Скомпилируем
				.pipe(cssimport({extensions: ["css"]}))
        .pipe(prefixer()) //Добавим вендорные префиксы
				.pipe(rename('style.css'))
        .pipe(gulp.dest(path.build.css)) //И в build
				.pipe(browserSync.stream());
});

//svg sprite

gulp.task('svgsprite', function() {
	return gulp.src(path.src.svg)
		.pipe(svgstore({

		}))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest(path.build.img));
});

gulp.task('image:build', function() {
	gulp.src(path.src.img)
			.pipe(plumber())
			.pipe(gulp.dest(path.build.img))
			.pipe(imagemin({
									progressive: true,
									svgoPlugins: [{removeViewBox: false}],
									use: [pngquant()],
									interlaced: true
							}))
			.pipe(gulp.dest(path.build.img))
			.pipe(browserSync.stream());
})

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(browserSync.stream());
});

gulp.task('build', [
    'pug:build',
    'js:build',
	'browserify',
    'style:build',
    'fonts:build',
    'image:build',
	'svgsprite'
]);

gulp.task('watch', function(){
    watch([path.watch.pug], function(event, cb) {
        gulp.start('pug:build');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('style:build');
    });
		watch([path.watch.sassEntry], function(event, cb) {
				gulp.start('style:build');
		});
		watch([path.watch.libs], function(event, cb) {
				gulp.start('style:build');
		});
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
		watch([path.watch.svg], function(event, cb) {
				gulp.start('svgsprite');
		});
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
