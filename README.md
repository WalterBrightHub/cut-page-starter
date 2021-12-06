# Cut Page Starter

切图启动器，帮助完成静态页面 ~~（然后扔给后端）~~ 。

## 安装命令

```bash
$ npm install --save-dev autoprefixer gulp gulp-clean gulp-connect gulp-postcss gulp-replace gulp-sass postcss postcss-px-to-viewport sass
```

一些依赖在国内安装不顺

```bash
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
$ cnpm install --save-dev gulp-cache gulp-imagemin@7
```

gulp-imagemin@8使用了import代替require语法，怪怪的，还是用7吧。

## 功能

+ 支持 scss
+ px自动转成vw（不需要可手动去除）
+ 图片鸭缩（src/image内的png,jpg,svg,gif），实测对png并没有很强的效果？
+ autoprefixer
+ glup-connect 开启实时预览
+ 附赠 normalize.css
+ src/static 内文件，和非图片文件、css文件、html文件全部 copy。js文件也是。

## 参考文章

[gulp常用插件汇总 - 较瘦 - 博客园](https://www.cnblogs.com/jiaoshou/p/12003709.html)

[Gulp .src() 匹配模式详解_凝弧-CSDN博客](https://blog.csdn.net/wildye/article/details/80516847)