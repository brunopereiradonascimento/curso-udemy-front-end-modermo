var gulp = require('gulp'),
    sass = require('gulp-sass');
//wait = require('gulp-wait');

gulp.task('sass', function() {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        //.pipe(wait(1500))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('monitorarsass', function() {
    gulp.watch('./src/sass/**/*.scss', ['sass'])
})