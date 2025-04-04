# animerecord-v2

# 业务背景

animerecord-v1：https://github.com/kurodasense/animerecord

想给网站添加新功能，但是原来的项目前端是用 vuecli+vue3+vuex 来开发的，其中使用的 options api ，再加上项目代码结构比较混乱，没有做很好的组件封装，使得添加新功能比较好麻烦。因此，决定花费一些时间来重构一下整个项目。（但是目前还是没能搞好移动端）

前端技术栈为：

- vite+vue3+element-plus+pinia+axios+typescript+less

后端技术栈在原来的基础上，添加了 multer+picgo 来实现图片上传：

- node+express+mysql+multer+picgo

# 新的变化

1. 更友善的用户操作提示。现在只要有什么错误信息，都会通过 message 来弹出来提示。相比旧版，数据加载时的 loading 展示更加精确了。

2. 项目代码结构变得更加简洁和合理。一些像`CardItem`、`DirectoryItem`、左边导航栏等组件都做了重写，并且将一些重复代码逻辑都抽出来变成公共组件。组件间、网络请求回来的数据的数据结构也用 interface 来规定好了。

   ![image-20241025201451787](https://raw.githubusercontent.com/kurodasense/cloudimg/master/img/image-20241025201451787.png)

3. 首页的追番列表现在以瀑布流的形式来展示了（基于 [vue3-waterfall-plugin](https://github.com/heikaimu/vue3-waterfall-plugin) ），页面上看起来更加地美观。

   ![waterfall](https://raw.githubusercontent.com/kurodasense/cloudimg/master/img/waterfall.gif)

4. 在首页的追番记录中，添加了“导出图片”的功能（基于 html2canvas 实现）。当追番记录超过10条就会显示这个按钮出来，用以解决用截屏方式截取追番记录为图片时，截取不完整的问题。（由于服务器没有做https服务，所以 ClipboardItem 用不了，现在改为“下载图片”）。

5. 添加了“ hover 动漫名字的时候，会显示出该动漫的预览图”的功能。在归档页面中可以找到上传相应的动漫的预览图（基于 multer+picgo 实现图片的接受处理和上传到 github 仓库）。

   ![upload](https://raw.githubusercontent.com/kurodasense/cloudimg/master/img/upload.gif)

6. 图片懒加载：图片是 hover 的时候才进行展示的，所以不应该在加载页面时就全部将它们加载出来，而是当 hover 时，出现在可视窗口内才将图片展示出来。这样可以减少不必要的图片网络请求。

   ![lazyload](https://raw.githubusercontent.com/kurodasense/cloudimg/master/img/lazyload.gif)

7. 现在点击动漫名称可以跳转到萌娘百科的相关条目，但是这个功能是简单通过拼接 url 来实现的，所以有可能名称错误的话会跳转到404页面。

8. 在首页和归档页面中获取列表时的支持无限的网络重试请求。

9. 以前的权限验证之后，后端返回的 JWT 是存到 pinia 中，所以一当网页刷新时， JWT 就会被清除，进而需要重新做权限验证。而现在 JWT 就存到了 sessionStorage 中，避免了刷新被清除的问题。

10. 现在添加新的追番记录后，后端会自动调用 google custom search api 实现图片搜索，将搜索到的第一张图片 url 存到数据库中（减少自己手动添加图片的可能性，但是可能会存在图片防盗链的情况）。

# 难点

1. 基于 multer+picgo 来实现图片的上传和保存：[自己写到了csdn上](https://blog.csdn.net/kurodasense/article/details/143231374?spm=1001.2014.3001.5502)。
1. 基于原生 IntersectionObserver 的图片懒加载组件封装。
1. 结合 google custom search api 实现图片搜索。
