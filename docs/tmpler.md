# Tmpler

模板解析器，对传入的模板通过钩子进行分析，结合Mustache和数据给出html片段


        设计思路:模板的有效拆分，实现局部数据更新，更新局部html。

## 配置

* `tmpl` {String}

    模板字符串


## 方法

* `getTmpl()`

    获取模板字符串

* `to_html(data)`

    模板和数据渲染成字符串

    * @param  {Object} data 数据
    * @return {String}      html片段

* `addTmpl(id, arr)`

    给brick添加模板

    * @param {String} id  brick的id
    * @param {Array} arr 模板数组
    * @return {Boolen} 是否添加成功


## 事件






