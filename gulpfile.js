const { src, dest, watch, parallel, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const connect = require('gulp-connect')
const clean = require('gulp-clean')
const pxtoviewport = require('postcss-px-to-viewport');
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
// const imageminPngquant = require('imagemin-pngquant'); // 不好使
const cache = require('gulp-cache')
const del = require('del')

const distDir = 'dist'

const pxtoviewportPlugin = pxtoviewport({
  // https://juejin.cn/post/6844904146865225742
  unitToConvert: "px",	//需要转换的单位，默认为"px"
  viewportWidth: 1920,   // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
  unitPrecision: 6,		//单位转换后保留的精度
  propList: [		//能转化为vw的属性列表
    "*"
  ],
  viewportUnit: "vw",		// 希望使用的视口单位
  fontViewportUnit: "vw",		//字体使用的视口单位
  selectorBlackList: [],	//需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
  minPixelValue: 1,		//设置最小的转换数值，如果为1的话，只有大于1的值会被转换
  mediaQuery: true,		//媒体查询里的单位是否需要转换单位
  replace: true,		//是否直接更换属性值，而不添加备用属性
  //exclude: /(\/|\\)(node_modules)(\/|\\)/,		//忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
})


const cleanTask = () => {
  return src(distDir, { read: false, allowEmpty: true })
    .pipe(clean())
}

const cssTypes = ['src/**/*.css', '!(./src/+(static|image)/**/*)']

const cssTask = () => {
  return src(cssTypes)
    .pipe(postcss([
      pxtoviewportPlugin, //若不需要px转vw，注释掉此行
      autoprefixer()])
    )
    .pipe(dest(distDir))
    .pipe(connect.reload())
}

const cssWatch = async () => {
  await watch(cssTypes, parallel([cssTask]))
}

const sassTypes = ['src/**/*.scss', '!(./src/+(static|image)/**/*)']

const sassTask = () => {
  return src(sassTypes)
    .pipe(sass())
    .pipe(postcss([
      pxtoviewportPlugin, //若不需要px转vw，注释掉此行
      autoprefixer()])
    )
    .pipe(dest(distDir))
    .pipe(connect.reload())
}

const sassWatch = async () => {
  await watch(sassTypes, parallel([sassTask]));
};


const connectTask = async () => {
  await connect.server({
    livereload: true,
    port: 8688,
    root: distDir
  })
}

const htmlTypes = ['./src/**/*.html', '!(./src/+(static|image)/**/*)']

const htmlTask = () => {
  return src(htmlTypes)
    .pipe(replace(/(href=".*).scss"/g, '$1.css"'))
    .pipe(dest(distDir))
    .pipe(connect.reload())
}

const htmlWatch = async () => {
  await watch(htmlTypes, parallel([htmlTask]))
}

const copyFileTypes = ['./src/**/*.!(html|css|scss)', '!(./src/+(static|image)/**/*)']

const copyTask = () => {
  return src(copyFileTypes)
    .pipe(dest(distDir))
    .pipe(connect.reload())
}

const copyWatch = async () => {
  await watch(copyFileTypes, parallel([copyTask]))
}

const copyStaticFileTypes = './src/static/**/*'

const copyStaticTask = () => {
  return src(copyStaticFileTypes)
    .pipe(dest(distDir + '/static'))
    .pipe(connect.reload())
}

const copyStaticWatch = async () => {
  await watch(copyStaticFileTypes, parallel([copyStaticTask]))
}

const imageminTypes = './src/images/**/*'

const imageminTask = () => {
  return src(imageminTypes)
    .pipe(cache(imagemin()))
    .pipe(dest('dist/images'))
}

const imageminWatch = async () => {
  await watch(imageminTypes, parallel([imageminTask]))
}

exports.default = series([
  cleanTask,
  parallel([
    sassTask,
    cssTask,
    copyTask,
    copyStaticTask,
    htmlTask,
    imageminTask,
  ]),
  parallel([
    sassWatch,
    cssWatch,
    connectTask,
    copyWatch,
    copyStaticWatch,
    htmlWatch,
    imageminWatch
  ])
])
