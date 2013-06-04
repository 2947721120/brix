KISSY.add("brix/gallery/sidenav/index", function(S, Brick) {
    /**
     * 页面主导航切换
     * <br><a href="../demo/gallery/sidenav/sidenav.html" target="_blank">Demo</a>
     * @class Brix.Gallery.Sidenav
     * @extends Brix.Brick
     */
    // author: chongzhi.ldq@taobao.com 崇志
    return Brick.extend({
        /**
         * 初始化函数，在构造函数内部调用
         */
        initializer: function() {
            //xx = ss;
        },
        /**
         * 组件放置到dom后触发的方法调用
         */
        bindUI: function() {
            var self = this;
            var el = this.get('el');
            this.sidebar = el;
            this.main = S.all(this.get('inmain'));
            this.allLinks = this.sidebar.all('a');
            this.nav = el.all('.nav');
            this.subNav = el.all('.sub-nav');
            this.subNavWrap = el.all('.sub-nav-wrap');
            this.subNavHandle = el.all('.subnav-handle');

            //这里配置有的页面不是导航点击进来的，
            //可以配置成相应的导航下面
            //置空则不停在任何导航上
            this.pathMap = this.get('pathMap');

            //收缩子菜单状态下，子菜单是复制附加到body根节点下的
            this.subNavView = S.all('<div class="sub-nav-view"></div>').appendTo('body');

            //利用localStorage记录子菜单是否mini模式, 1：打开模式；0：收缩模式
            //不支持localStorage的浏览器用默认的值["1"]
            this.localStorage = window.localStorage;
            this.isFullSubNav = this.localStorage && this.localStorage.isFullSubNav || '1';

            if(this.isFullSubNav === '0') {
                this.subNavHandle.replaceClass('icon-expand', 'icon-collapse');
            }

            //可配置的两个参数 duration index
            this.index = this.get('index'); //默认的首页地址
            this.duration = this.get('duration'); //导航动画持续时间，可配置
            this.isHandleClick = false; //标识是否点击了扩展收缩按钮
            self.navTop = this.get('navTop') || self.nav.offset().top; //导航的初始offset.top值
            //初始化
            // this._bindUI();
            this._pathname2sidebar();
        },

        /**
         * 析构函数，在组件destroy时候主动调用
         */
        destructor: function() {
            this.subNavView.remove();
        },

        /**
         * 模拟queryModel对hash的pathname进行解析
         * @private
         */
        _getPathname: function(h) {
            var pathname;
            var pathnameMatch = /(^#!\/[^\?]+)\??[^\/]*$/.exec(h); //返回pathname目录
            pathname = pathnameMatch && pathnameMatch[1] || this.index;
            return pathname;
        },

        //根据pathname来确定sidebar的状态
        _pathname2sidebar: function() {
            var self = this;
            var h = this._getPathname(location.hash);

            //将map中的地址映射成相应的导航
            S.each(this.pathMap, function(v, k) {
                if(h === k) {
                    h = v;
                    return false;
                }
            });

            //h为空时，触发无导航状态
            if(h === '') {
                this._setNoSelectedNav();
                return;
            }

            this.sidebar.all('a').each(function(n) {
                var origin_href = n.attr('href');
                origin_href = origin_href.replace(/^.*?#/g, '#'); //ie7以下a的href会获取完整地址，做下处理
                origin_href = self._getPathname(origin_href);
                // var _href = origin_href.match(/.*\//);
                // if (!_href) return false;
                // var href = _href[0];
                if(origin_href.slice(origin_href.indexOf('#')) === h) {
                    self.navclick(n, h);
                    return false;
                }
            });
            this.isNavClick = false;
        },

        //触发无选中导航状态
        _setNoSelectedNav: function() {
            this.sidebar.all('a').removeClass('on');
            this._collapseNav();
        },

        //主导航的点击切换
        navclick: function(t, h, isRecover) {
            var self = this;
            h = h || this._getPathname(location.hash);
            var isMainNav = false; //是否主菜单点击
            var _href;

            this.nav.all('a').each(function(item) {
                _href = item.attr('href');
                _href = _href.slice(_href.indexOf('#'));
                _href = self._getPathname(_href);
                if(_href === h) {
                    isMainNav = true;
                }
            });

            // if (isRecover) {
            //     isMainNav = false;
            // }
            if(isMainNav) {
                self._expandCollapseNav(t);
            } else {
                var p_sub = t.parent('ul[data-sub]');
                if(!p_sub) return;
                var _t = self.nav.all('a[data-sub=' + p_sub.attr('data-sub') + ']');
                self._expandCollapseNav(_t);
                self.subNav.all('a').removeClass('on');

                // if (isRecover) {
                // self.subNav.all('a[href="#!/board/list/board.archivestatus=1"]').addClass('on');
                // } else {
                self.subNav.all('a').each(function(item) {
                    if(item.attr('href') === h) {
                        item.addClass('on');
                        return false;
                    }
                });
                // }
            }

            self.isHandleClick = false;
            self.nowNav = t;
            self.isNavClick = true;
            // S.all(window).scrollTop(0);
        },

        //sidebar 的 fixed与static切换
        _fixedStatic: function(attribute) {
            var self = this;
            var st = Math.max(document.body.scrollTop, document.documentElement.scrollTop); //兼容ie
            var isFixed = st > self.navTop; //滚动超过nav的offset top值时，变为fixed
            if(isFixed) {
                self.sidebar.addClass('sidebar-fixed');

                //ie6处理fixed效果
                if(S.UA.ie === 6) {
                    self.sidebar.css({
                        position: 'absolute',
                        top: st + 10
                    });
                }
            } else {
                self.sidebar.removeClass('sidebar-fixed');
                //ie6处理fixed效果
                if(S.UA.ie === 6) {
                    self.sidebar.css({
                        position: 'static'
                    });
                }
            }
        },

        //延迟器
        _timer: function(fn, t) {
            clearTimeout(this.itv);
            this.itv = setTimeout(fn, t);
        },

        //设置子菜单选中状态
        _setSubNavOn: function(node) {
            var thirdNav = node.closest('.sub-nav-third');

            //导航的选中状态
            this.subNav.all('a, .icon-font').removeClass('on');
            this.subNavView.all('a, .icon-font').removeClass('on');
            node.addClass('on');

            //子导航收缩时icon高亮
            if(this.isFullSubNav === '0' && thirdNav) {
                thirdNav.prev().addClass('on');
            }
        },

        //传入当前的导航a节点，处理导航点击引起的子导航切换
        _expandCollapseNav: function(node) {
            var self = this;
            var dataSub = node.attr('data-sub'); //是否有子菜单
            var h = node.attr('href');
            var t;

            //ie 6, 7 在innerHTML的时候会自动 把 a的href全路径补全
            h = h.slice(h.indexOf('#'));

            //子导航的打开关闭
            if(dataSub) {
                if(self.currentNav) self.currentNav.hide(); //前一个子导航关闭
                self.currentNav = self.subNav.one('[data-sub="' + dataSub + '"]'); //找到主导航对应的子菜单
                //主导航对应的子菜单的某项选中，根据href匹配
                //var h = 'a[href="' + href + '"]';
                //h = h.replace(/([\!\/])/g, '\\$1');
                self.currentNav.all('a').each(function(n) {
                    var href = n.attr('href');
                    if(href.slice(href.indexOf('#')) === h) {
                        t = n;
                        return false;
                    }
                });
                //t = self.currentNav.one(h);
                if(!t) return;

                self.currentSubNav = t;
                self._setSubNavOn(t);

                self.currentNav.show();
                self._expandNav();
            } else {
                self._collapseNav();
            }

            //导航的选中状态
            self.nav.all('a').removeClass('on');
            node.addClass('on');
        },

        //收缩导航按钮的切换
        _switchTrigger: function() {
            if(this.isFullSubNav === '1') {
                this.subNavHandle.replaceClass('icon-collapse', 'icon-expand');
            } else if(this.isFullSubNav === '0') {
                this.subNavHandle.replaceClass('icon-expand', 'icon-collapse');
            }
        },

        //子导航的扩展收缩
        _expandCollapseSubNav: function() {
            var self = this;
            var curSubNav = self.currentSubNav;
            var closestUl = curSubNav && (curSubNav.prop('nodeName') === 'LI' ? //无奈之举
            curSubNav.one('ul') : curSubNav.closest('ul'));
            var isThirdNavSelected = closestUl && closestUl.hasClass('sub-nav-third');

            //是否mini模式的菜单切换

            function animCallBack() {
                var isF = (this.isFullSubNav === '1');
                this.isFullSubNav = isF ? '0' : '1';
                if(this.localStorage) {
                    this.localStorage.isFullSubNav = isF ? '0' : '1';
                }
            }

            //菜单扩展
            if(self.isFullSubNav === '0') {
                animCallBack.call(self); //菜单扩张时直接设置isFullSubNav
                self._expandSubNav();
                self._switchTrigger();

                if(isThirdNavSelected && closestUl.prev()) {
                    closestUl.prev().removeClass('on');
                }
            }

            //菜单收缩
            else if(self.isFullSubNav === '1') {
                self._collapseSubNav(function() {
                    animCallBack.call(self); //菜单收缩时在动画结束时设置isFullSubNav
                    self._switchTrigger();
                });

                if(isThirdNavSelected && closestUl.prev()) {
                    closestUl.prev().addClass('on');
                }
            }

        },

        //子菜单收缩
        _collapseSubNav: function(cb) {
            this.subNav.animate({
                'width': '16px',
                'padding-top': '42px'
            }, this.duration, 'easeOut', cb);

            /**
             *main width setting
             */

            this.main.animate({
                'margin-left': '116px'
            }, this.duration, 'easeOut');

            //
            this._collapseThirdNav();
        },

        //子菜单打开
        _expandSubNav: function(cb) {
            this.subNav.animate({
                'width': '140px',
                'padding-top': '0px'
            }, this.duration, 'easeOut', cb);

            /**
             *main width setting
             */

            this.main.animate({
                'margin-left': '240px'
            }, this.duration, 'easeOut'); //main动画太快会导致main的maring-left太多引起抖动，故减少些
            //
            this._expandThirdNav();
            this.subNavView.css('left', '-10000px');
        },

        //打开三级菜单
        _expandThirdNav: function(cb) {
            var self = this;

            if(!self.nowNav) return;

            if(self.nowNav.attr('data-sub') === self.currentNav.attr('data-sub') && !self.isHandleClick) {
                S.all('.sub-nav-third').css('height', 'auto');
            } else {
                //直接slideToggle在chrome下有问题，故换成animate
                S.all('.sub-nav-third').each(function(n, i) {
                    var h = n.css('height', 'auto').height();
                    n.css('height', 0);
                    n.animate({
                        'height': h
                    }, self.duration, 'easeOut', cb);
                });
            }
        },

        //关闭三级菜单
        _collapseThirdNav: function(cb) {
            //直接slideToggle在chrome下有问题，故换成animate
            S.all('.sub-nav-third').animate({
                'height': 0
            }, this.duration, 'easeOut', cb);
        },

        //主导航切换控制的侧栏菜单打开
        _expandNav: function(dataSub, cb) {
            this.subNav.show();
            this.subNav.animate({
                "width": this.isFullSubNav === '1' ? '140px' : '16px',
                "padding-top": this.isFullSubNav === '1' ? '0' : '42px'
            }, this.duration, 'easeOut', cb);

            this.subNavWrap.animate({
                "margin-left": '0'
            }, this.duration, 'easeOut', cb);


            /**
             *main width setting
             */

            this.main.animate({
                'margin-left': this.isFullSubNav === '1' ? '240px' : '116px'
            }, this.duration, 'easeOut');

            //菜单有三级菜单时的动画，禁用了
            if(this.isFullSubNav === '1') {
                this._expandThirdNav();
            } else {
                this._collapseThirdNav();
            }
        },

        //主导航切换控制的侧栏菜单收缩
        _collapseNav: function(dataSub, cb) {
            var self = this;

            this.subNav.animate({
                "width": '1px'
            }, this.duration, 'easeOut', function() {
                self.subNav.hide();
            });

            this.subNavWrap.animate({
                "margin-left": this.isFullSubNav === '1' ? '-140px' : '-16px'
            }, this.duration, 'easeOut', cb);

            /**
             *main width setting
             */

            this.main.animate({
                'margin-left': '100px'
            }, this.duration, 'easeOut');

        }
    }, {
        ATTRS: {
            //inmain id
            inmain: {
                value: '#inmain'
            },

            //导航离顶部的距离
            navTop: {
                value: null
            },
            /**
             * 默认的首页地址
             * @cfg {String}
             */
            index: {
                value: '#!/home'
            },
            /**
             * 导航动画持续时间，可配置
             * @cfg {Number}
             */
            duration: {
                value: 0.25
            },

            /**
             * 这里配置有的页面不是导航点击进来的，可以配置成相应的导航下面,
             * 置空则不停在任何导航上
             * 格式：
             *  '#!/adzone/adzone_detail/': '#!/adzone/adzone/',
                '#!/plan/handle/': '#!/plan/list/',
                '#!/plan/price_handle/': '#!/plan/list/',
                '#!/messages/list/': '',
                '#!/messages/detail/': '',
                '#!/components/': ''
             * @cfg {Object}
             */
            pathMap: {
                value: {}
            }
        },
        EVENTS: {
            //子导航收缩扩展的点击切换
            ".subnav-handle": {
                //时间类型
                'click': function(e) {
                    //子导航扩展收缩
                    this.isHandleClick = true;
                    this._expandCollapseSubNav();
                }
            },

            //子导航的点击
            '.sub-nav a': {
                'click': function(e) {
                    //a标签里包含i标签时，点击i也会代理到事件。。貌似BUG
                    //处理：如果是i则用closest往上取a标签
                    var t = S.all(e.target).closest('a');
                    var self = this;
                    var thisSubNav = t.closest('.sub-nav-ul');
                    var dataSub = thisSubNav.attr('data-sub');

                    self.isHandleClick = false;
                    self.nowNav = self.nav.all('a[data-sub=' + dataSub + ']');

                    self.navclick(self.nowNav);
                    // self.nowNav.fire('click');
                    self.currentSubNav = t.closest('.sub');
                    self._setSubNavOn(t);
                    self.isNavClick = true;
                    // S.all(window).scrollTop(0);
                    // self._fixedStatic();
                }
            },

            //三级导航点击标题收缩扩展子菜单
            '.sub-nav .sub-title': {
                click: function(e) {
                    var _this = S.all(e.currentTarget);
                    var _sub = _this.next('.sub-nav-third');
                    var self = this;

                    if(_sub.css('height') === '0px') {
                        var h = _sub.css('height', 'auto').height();
                        _sub.css('height', 0);
                        _sub.animate({
                            'height': h
                        }, self.duration, 'easeOut');

                    } else {
                        _sub.animate({
                            'height': 0
                        }, self.duration, 'easeOut');
                    }
                }
            },

            //子导航收缩时，鼠标经过显示全部菜单
            '.sub-nav .sub': {
                mouseenter: function(e) {
                    var self = this;
                    if(self.isFullSubNav !== '0') return; //菜单不为收缩时，不处理
                    var t = S.all(e.target).closest('.sub');
                    var o = t.offset();
                    self.currentLi = t;
                    self.subNavView.html(t.html());
                    self.subNavView.all('.sub-nav-third').css('height', 'auto');
                    self.subNavView.css(o);
                }
            },

            //主导航的点击
            '.nav a': {
                'click': function(e) {
                    this.navclick(S.all(e.target));
                }
            }
        },
        DOCEVENTS: {
            '.sub-nav-view a': {
                 //复制到body下的子导航的点击处理
                'click': function(e) {
                    var t = S.all(e.target).closest('a');
                    var self = this;
                    self._setSubNavOn(t);
                    self.currentSubNav = self.currentLi;
                    self.isNavClick = true;
                }
            },
            '.sub-nav-view': {
                //子导航收缩时，鼠标离开隐藏菜单
                'mouseleave': function(e) {
                    var self = this;
                    self.subNavView.css('left', '-10000px');
                    self.subNavView.all('.sub-nav-third').css('height', 0);
                    self.currentLi.html(self.subNavView.html());
                }
            }
        },
        WINEVENTS: {
            scroll: function(e) {
                var self = this;
                //滚动位置，滚动到126px的时候，sidebar变为fixed
                self._timer(function() {
                    self._fixedStatic();
                }, 10);
            },

            hashchange: function(e) {
                if(!this.isNavClick) {
                    // ie8下magix里获取query执行顺序有问题，暂时加上setTimeout解决
                    // TODO 解决magix里ie8获取query先后问题
                    // fixed: 用kissy的事件侦听hashchange即可，不用原生onhashchange
                    this._pathname2sidebar();
                }
                this.isNavClick = false; //区别开是导航点击的，还是页面上链接跳转的
            }
        },
        RENDERERS: {

        }
    }, 'sidenav'); //最后一个参数是组件名称
}, {
    requires: ['brix/core/brick']
});