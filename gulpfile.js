var gulp = require('gulp')
    , sass = require('gulp-sass')
    , include = require('gulp-file-include')
    , clean = require('gulp-clean')
    , autoprefixer = require('gulp-autoprefixer')
    , uncss = require('gulp-uncss')
    , imagemin = require('gulp-imagemin')
    , cssnano = require('gulp-cssnano')
    , uglify = require('gulp-uglify')
    , concat = require('gulp-concat')
    , rename = require('gulp-rename')
    , browserSync = require('browser-sync');
    //wait = require('gulp-wait');

gulp.task('clean', function(){
    return gulp.src('./dist')
        .pipe(clean());
})

gulp.task('copy', ['clean'], function(){
    return gulp.src('./src/components/**/*', {'base': 'src'})
        .pipe(gulp.dest('./dist'))
})

gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())        
        .pipe(autoprefixer())
        .pipe(cssnano())
        //.pipe(wait(1500))
        .pipe(gulp.dest('./dist/css/'));
})

/*
gulp.task('monitorarsass', function() {
   gulp.watch('./src/sass/**\/*.scss', ['sass'])
})
*/

gulp.task('html', function(){
    return gulp.src(['./src/**/*.html', '!src/inc/**'])
        .pipe(include())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('uncss', ['html'], function(){
    return gulp.src('./dist/components/**/*.css')
        .pipe(uncss({
            html: ['./dist/*.html']
        }))
        .pipe(gulp.dest('./dist/components/'))
})

gulp.task('imagemin', function(){
    return gulp.src('./src/imagens/**/*')
                .pipe(imagemin())
                .pipe(gulp.dest('./dist/imagens'))
})

gulp.task('js', function(){
    return gulp.src('./src/javascript/**/*')
            .pipe(concat('app.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./dist/javascript/'))
})

gulp.task('svg', function(){
    return gulp.src(['src/inc/icons/*.svg', '!src/inc/icons/*.min.svg'])
        .pipe(imagemin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./src/inc/icons/'))
})

gulp.task('default', ['copy'], function(){
    gulp.start('uncss' , 'imagemin', 'sass', 'js')
})

gulp.task('servidor', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
    
    //convertendo scss para css
    gulp.watch('./src/sass/**/*.scss', ['sass'])
    
    //monitorar os arquivos html
    gulp.watch('./src/**/*.html', ['html'])
    
    //monitorar os arquivos js
    gulp.watch('./src/javascript/**/*', ['js'])
    
    gulp.watch([
        './src/inc/icons/*.svg',
        '!./src/inc/icons/*.min.svg'],
        ['svg'])
    
    //monitorando alterações em qualquer tipo de aruqivo
    gulp.watch('./dist/**/*').on('change', browserSync.reload)
})