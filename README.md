# text-changer
[demo](https://nn-3.github.io/text-changer/demo/)

所謂名前変換小説用の、変換機能のJavaScriptです。


## 導入方法
```
<script src="//cdn.jsdelivr.net/gh/nn-3/text-changer/main.min.js"></script>
<script>
textChanger(data,option);
</script>
```
引数の`data`,`option`は双方連想配列を持たせてください。

optionは後述するデフォルト設定で問題ない場合は省略可能です(`textChanger(data)`で可)。

記述は`<head>`または`<body>`要素内ならどこでも構いません。


## 変換設定
引数`data`部分で設定します。
