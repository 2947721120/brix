# 组件书写规范

## 继承自Brick


        //KISSY的模块书写规范
        KISSY.add("brix/gallery/dropdown/1.0/dropdown", function(S, Brick) {
            function Dropdown() {
                Dropdown.superclass.constructor.apply(this, arguments);
            }
            S.extend(Dropdown, Brick, {
                //这里写私有方法
                });//继承
            return Dropdown;
        }, {
            requires: ["brix/brick","./dropdown.css"]
        });


## 配置


        Dropdown.ATTRS = {
            //同KISSY的Base写法
        }



## 组件行为赋予

 - 代理在document上的事件行为


        Dropdown.DOCATTACH = {
            "body":{
                click:function(e){
                    var self = this;
                    if (!self.__show) {
                        var el = self.get('el');
                        el.all('.dropdown-list').css('display', 'none');
                        el.all('.dropdown-a').removeClass('dropdown-aactive');
                    }
                    self.__show = false;
                }
            }
        }


 - 代理在组件节点上的事件行为


        Dropdown.ATTACH = {
            ".dropdown-a": {
                click: function(e) {
                    var el = this.get('el').one('.dropdown-list');
                    this.__show = true;
                    if (el.css('display') == 'block') {
                        this.blur();
                    } else {
                        this.focus();
                    }
                },
                mouseenter: function(e) {
                    var currentTarget = S.one(e.currentTarget);
                    currentTarget.addClass('dropdown-ahover');
                },
                mouseleave: function(e) {
                    var currentTarget = S.one(e.currentTarget);
                    currentTarget.removeClass('dropdown-ahover');
                }
            }
        };


## 扩展对外方法


        Dropdown.MOTHED = {
            focus: function() {
                var el = this.get('el');
                el.one('.dropdown-list').css('display', 'block');
                el.one('.dropdown-a').addClass('dropdown-aactive');
            },
            blur: function() {
                var el = this.get('el');
                el.one('.dropdown-list').css('display', 'none');
                el.one('.dropdown-a').removeClass('dropdown-aactive');
            }
        }
        S.augment(Dropdown,Dropdown.MOTHED);


## 对外自定义事件


        //这个不做限制，但是写组件的同学一定要在组件文档中描述清晰
        this.fire('selected', data);




