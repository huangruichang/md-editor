var gulp = require('gulp');
var electron = require('gulp-electron');
var packageJson = require('./src/package.json');

gulp.task('electron', function () {
	gulp.src("")
	.pipe(electron({
		src: './src',
		packageJson: packageJson,
		release: './release',
		cache: './cache',
		version: 'v0.26.1',
		packaging: true,
		platforms: ['darwin','win32','linux'],
		platformResources: {
			win: {
				"version-string": packageJson.version,
				"file-version": packageJson.version,
				"product-version": packageJson.version,
				"icon": 'gulp-electron.ico'
			}
		}
	}))
	.pipe(gulp.dest(""));
});

gulp.task('default', ['electron']);