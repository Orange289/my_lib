'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sassGlob = require('gulp-sass-glob'),
	cssimport = require("gulp-cssimport"),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-csso'),
	imagemin = require('gulp-imagemin'),
	svgSprite = require('gulp-svg-sprites'),
	svgmin = require('gulp-svgmin'),
	svgstore = require('gulp-svgstore'),
	pngquant = require('imagemin-pngquant'),
	browserSync = require('browser-sync'),
	rimraf = require('rimraf'),
	reload = browserSync.reload;

var path = {
	build: { //готовые после сборки файлы
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: { //Пути откуда брать исходники
		html: 'src/*.html',
		js: 'src/js/*.js',
		sass: 'src/css/**/*.scss',
		sassEntry: 'src/css/base.scss',
		img: 'src/img/**/*.*',
		svg: 'src/img/icons/*.svg',
		fonts: 'src/fonts/**/*.*'
	},
	watch: { //за изменением каких файлов наблюдать
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		sass: 'src/css/**/*.scss',
		sassEntry: 'src/css/base.scss',
		libs: 'src/css/libs/*.css',
		img: 'src/img/**/*.*',
		svg: 'src/img/icons/*.svg',
		fonts: 'src/fonts/**/*.*'
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

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем main файл
				.pipe(plumber())
        .pipe(rigger()) //Прогоним через rigger
        .pipe(uglify()) //Сожмем наш js
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
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
        .pipe(reload({stream: true}));
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

})

//svg sprite

gulp.task('svgsprite', function() {
	return gulp.src(path.src.svg)
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(svgmin())
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest(path.build.img));
});

//

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
		'svgsprite'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
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
