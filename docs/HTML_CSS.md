# 一淘组件HTML/CSS书写规范
 

## 一:  追求目标:
* 清晰:  代码结构和命名都要尽量清晰明了, 做到“观其貌, 知其意”

* 健壮: 能处理常规意外情况. 不能处理的, 也要尽量在内部将意外catch住, 避免单点故障, 影响页面其他部分

* 灵活: 
    1. 能适应同种业务场景的不同表现类型, 但也不要为了灵活而增加太多的嵌套或配置参数
    2. 组件/模块尽量独立, 高自我保持性, 可以任意移动, 灵活组合
 

## 二: 命名

1. 统一使用“组件/模块名 + 实例名 + 实例状态名”的命名方式
   如: `<span class="icon icon-ok icon-ok-disable"></span>`, 其中icon为模块名, icon-ok为具体实例名, icon-ok-disable为实例状态名

2. 命名单词与单词之间用连字符'-'分割, 通常2到3级为宜, 超过4级的, 请以清晰的方式进行简化(样式表选择器层级数量与此相同)

3. 命名的每个单词统一英文全拼, 尽量不要缩写. 必要情况下,缩写 也要清晰明了并遵从预定俗成的缩写方式, 如可以将.button缩写成.btn而不要将.icon缩写成.i
   实在无法英文表达的命名, 使用拼音全拼

4. id和class名称中只能出现小写的26个英文字母、数字和连字符（-），任何其它字符都严禁出现。

5. id和class尽量用英文单词命名。确实找不到合适的单词时，可以考虑使用产品的中文拼音，比如wangwang, dating. 对于中国以及淘宝特色词汇，也可以使用拼音，比如xiaobao, daigou. 除了产品名称和特色词汇，其它任何情况下都严禁使用拼音。

6. 仅在JavaScript中当作hook用的id和class, 命名规则为J_UpperCamelCase（请注意，J_ 后的首字母也大写！）, 其中字母J代表JavaScript, 也是钩子（hook）的象形。注意：如果在JavaScript和CSS中都需要用到，则不用遵守本约定。

7. 在自动化测试脚本中当作hook用的class, 命名规则为T_UpperCamelCase, 其中字母T代表Test.
 
 
## 三: 其他

1. 代码文件统一使用无bom utf-8编码保存

2. 不能百分百保证一个页面上只出现一次的组件/模块, 请使用class而不是id命名或做选择器

3. html文件按照dom结构层级进行换行和缩进, js文件避免出现过长单行语句, 换行, 缩进, 空格等和css文件一样, 遵守“C风格”

4. 样式表中尽量避免出现标签选择器, 使html更灵活

5. 除了公用的js, css类库文件, 各个组件/模块独立维护自己js, css和模板文件, 根据项目需要, 选择性打包

6. 同一实例的不同状态,要能自我保持, 如:
       `<span class="icon icon-ok icon-ok-disable"></span>`需要同时支持`<span class="icon icon-ok-disable"></span>`的写法

7. 虽然要尽量模块独立, 但考虑通常习惯, 在可以简化程序开销的情况下, 适当做兼容性妥协,
   如”一个包含icon的button” , 写成结构:

        <span class="button button-ok">
            <i class="icon icon-ok"><i>
        </span>

    这时候,如果button需要切换到disable禁用状态, 除了在span上添加button-ok-disable还要在内部的i上添加icon-ok-disable, 多了一步操作
    不喜欢的话, 可以按照通常的做法, 写成

        <span class="button button-ok button-ok-disable">
            <i class="icon"></i>
        </span>

    在button内部第一个空icon, 通过父级的className控制内部展示状态
    但同时, 也要能支持第一种写法

8. 像兼容的圆角, 阴影,css动画或公用的颜色, 距离值等可以用less简化代码, 提高效率的地方
   可以根据自己爱好, 使用less编写css文件,
   组件库默认支持less, 打包时统一处理
