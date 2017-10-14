var gulp = require('gulp'),
    sass = require('gulp-sass')
browserSync = require('browser-sync');
//wait = require('gulp-wait');

gulp.task('sass', function() {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        //.pipe(wait(1500))
        .pipe(gulp.dest('./src/css'));
});

/*
gulp.task('monitorarsass', function() {
   gulp.watch('./src/sass/**\/*.scss', ['sass'])
})
*/

gulp.task('servidor', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })

    //convertendo scss para css
    gulp.watch('./src/sass/**/*.scss', ['sass'])
    
    //monitorando alterações em qualquer tipo de aruqivo
    gulp.watch('./src/**/*').on('change', browserSync.reload)    
})