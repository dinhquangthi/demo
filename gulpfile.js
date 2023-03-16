const gulp = require('gulp'),
	env = require('node-env-file'),
	plumber = require("gulp-plumber"),
	sass = require('gulp-sass'),
	cleancss = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require('gulp-notify'),
	wait = require('gulp-wait'),
	webpack = require('webpack'), // Let's use webpack.DefinePlugin
	webpackStream = require('webpack-stream'), // Let's use webpack4
	fileInclude = require('gulp-file-include'),
	vueify = require('gulp-vueify2'),
	babelFill = require("@babel/polyfill");
const { VueLoaderPlugin } = require('vue-loader');

env('.env');

const paths = {
	"url": "localhost:" + process.env.PORT_NUM,
	"css": "./src/wp-content/themes/" + process.env.THEME_NAME + "/assets/css/",
	"scss": "./src/wp-content/themes/" + process.env.THEME_NAME + "/assets/scss/**/*.scss",
	"entry": "./src/wp-content/themes/" + process.env.THEME_NAME + "/assets/js/main.js",
	"js": "./src/wp-content/themes/" + process.env.THEME_NAME + "/assets/js/",
}

//Sass
gulp.task('sass', function () {
	return gulp.src(paths.scss)
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(cleancss({ debug: true }, function (details) {
			console.log(details.name + ': ' + details.stats.originalSize + ' > ' + + details.stats.minifiedSize);
		}))
		.pipe(autoprefixer({
			browsers: ["last 2 versions", "ie >= 9", "Android >= 4", "ios_saf >= 8"],
			cascade: false
		}))
		.pipe(gulp.dest(paths.css))
		// .pipe(notify("Sass Compile Success!"));
});

//Webpack JS bundle
gulp.task('bundle', function () {
	return gulp.src([paths.entry])
		.pipe(plumber())
		.pipe(webpackStream({
			// watch: true, // webpack の watch ではなく gulp の watch を使う
			output: {
				filename: 'build/bundle.js',
			},
			module: {
				rules: [
					{
						test: /\.vue$/,
						loader: 'vue-loader',
						options: {
							options: {
								presets: ['es2015', {
									"targets": {
										"browsers": ["last 2 versions", "safari 7", "edge 14"]
									}
								}],
							},
						  // other vue-loader options go here
						},
					},
					{
						test: /\.js$/,
						resourceQuery: paths.js + 'src/',
						loader: 'babel-loader',
						options: {
							presets: ['es2015', {
								"targets": {
									"browsers": ["last 2 versions", "safari 7", "edge 14"]
								}
							}],
						}
					},
					{
                        test: /\.css$/,
                        oneOf: [
                            {
                                resourceQuery: /module/,
                                use: [
                                    'vue-style-loader',
                                    {
                                        loader: 'css-loader',
                                        options: {
                                            modules: true,
                                            localIdentName: '[local]_[hash:base64:5]',
                                        },
                                    },
                                ],
                            },
                            // this matches plain `<style>` or `<style scoped>`
                            {
                                use: ['vue-style-loader', 'css-loader'],
                            },
                        ],
					},
					{
						test: /\.scss$/,
						use: [
						  'vue-style-loader',
						  'css-loader',
						  'sass-loader'
						]
					  },
				],
			},
			resolve: {
				extensions: ['.js', '.vue'],
				modules: [
					"node_modules"
				],
				alias: {
					vue: 'vue/dist/vue.common.js',
					element_ui: 'element-ui/lib/index.js'
				}
			},
			//環境によってビルドする内容を分ける
			plugins: [
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: '"production"'
					}
				}),
				//new webpack.optimize.UglifyJsPlugin(),
				//new webpack.optimize.DedupePlugin(),  // ライブラリ間で依存しているモジュールが重複している場合、二重に読み込まないようにする
				new webpack.optimize.AggressiveMergingPlugin(),  //ファイルを細かく分析し、まとめられるところはできるだけまとめてコードを圧縮する
				// JQuery / JQueryライブラリのための定義
				new webpack.ProvidePlugin({
					jQuery: "jquery",
					$: "jquery",
					jquery: "jquery"
				}),
				new VueLoaderPlugin(),
			]
		}, null, function (err, stats) {
			/* Use stats to do more things if needed */
			if (stats.compilation.errors.length) {
				notify.onError({
					title: 'Webpack error',
					message: stats.compilation.errors[0].error,
					sound: 'Frog',
				});
			}
		}))
		.pipe(gulp.dest(paths.js))
		// .pipe(notify("Bundle JS Success!"));
})

gulp.task('default', ['sass', 'bundle'], function () {
	gulp.watch(paths.scss, ['sass']);
	gulp.watch([paths.entry, paths.js + "module/**/*"], ['bundle']);
});
