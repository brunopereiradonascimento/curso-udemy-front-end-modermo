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

//Limpando o diretório /dist 
gulp.task('clean', function(){
    return gulp.src('./dist')
        .pipe(clean());
})

//Copia os arquivos do diretório /componentes
gulp.task('copy', ['clean'], function(){
    return gulp.src('./src/components/**/*', {'base': 'src'})
        .pipe(gulp.dest('./dist'))
})

//Tratando sass/scss
gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())        
        .pipe(autoprefixer())
        .pipe(cssnano())
        //.pipe(wait(1500))
        .pipe(gulp.dest('./dist/css/'));
})

//Trata os includes
gulp.task('html', function(){
    return gulp.src(['./src/**/*.html', '!src/inc/**'])
        .pipe(include())
        .pipe(gulp.dest('./dist/'))
})

//Minifica css
gulp.task('uncss', ['html'], function(){
    return gulp.src('./dist/components/**/*.css')
        .pipe(uncss({
            html: ['./dist/*.html']
        }))
        .pipe(gulp.dest('./dist/components/'))
})

//Minifica imagens
gulp.task('imagemin', function(){
    return gulp.src('./src/imagens/**/*')
                .pipe(imagemin())
                .pipe(gulp.dest('./dist/imagens'))
})

//Minifica e criar arquivo único js
gulp.task('js', function(){
    return gulp.src('./src/javascript/**/*')
            .pipe(concat('app.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./dist/javascript/'))
})

//Minifica e renomeia svg 
gulp.task('svg', function(){
    return gulp.src(['src/inc/icons/*.svg', '!src/inc/icons/*.min.svg'])
        .pipe(imagemin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./src/inc/icons/'))
})

//Task default - copiando e tratando
gulp.task('default', ['copy'], function(){
    gulp.start('uncss' , 'imagemin', 'sass', 'js')
})

//Assistindo alterações
gulp.task('servidor', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
    
    //assitindo/convertendo scss para css
    gulp.watch('./src/sass/**/*.scss', ['sass'])
    
    //monitorar os arquivos html
    gulp.watch('./src/**/*.html', ['html'])
    
    //monitorar os arquivos js
    gulp.watch('./src/javascript/**/*', ['js'])
    
    //monitorar os arquivos svg
    gulp.watch([
        './src/inc/icons/*.svg',
        '!./src/inc/icons/*.min.svg'],
        ['svg'])
    
    //reload quando há alterações
    gulp.watch('./dist/**/*').on('change', browserSync.reload)
})