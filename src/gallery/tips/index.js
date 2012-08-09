KISSY.add('brix/gallery/tips/index', function (S, Brick, Node, Template) {
    var $ = Node.all, D = S.DOM, E = S.Event;
    var count = 0;

    function Tips() {
        Tips.superclass.constructor.apply(this, arguments);
    }

    Tips.ATTRS = {
        dataAttrName:{
            value:'data-tips'
        },
        closeable:{
            value:true
        },
        length:{

        },
        'tmpl-tip':{
            value:'<div id="{{id}}" class="bx-tips-show" style="display: none;position: absolute;top:-9999px;left:-9999px;"><p class="bx-tips-msg">{{tips}}</p><i class="bx-tips-tri bx-tips-top"></i><span class="bx-tips-close">关闭</span></div>'
        },
        tips:{
            value:{}
        },
        timers:{
            value:{}
        },
        prex:{
            value:'bx-tip-'
        },
        trisize:{
            value:{
                width:16,
                height:9,
                distance:14,
                distance2:12
            }
        }, el:{
            value:'body'
        }

    };

    Tips.DOCATTACH = {

        '.bx-tips':{
            mouseenter:function (e) {
                var el = e.currentTarget;
                this.showTips(el);
            },
            mouseleave:function (e) {
                var el = e.currentTarget;
                //this.hideTips(el);
            }

        },
        '.bx-tips-close':{
            click:function (e) {
                var el = e.currentTarget;
                var self = this;
                var _tip = D.parent(el, '.bx-tips-show');
                self.closeTips(_tip);
            }
        }

    };

    Tips.METHOD = {
        showTips:function (el) {
            var self = this;
            var _id = self._getTipId(el);
            if (!_id || !self.get("tips")[_id]) {
                _id = self._createTipId();
                var __tip = Template(self.get("tmpl-tip"))
                    .render({'id':_id, 'tips':D.attr(el, self.get("dataAttrName"))});
                self.get("tips")[_id] = _id;
                D.attr(el, "data-tipid", _id);
                $(__tip).appendTo('body');
            }
            self._posTip(el, D.get("#" + _id));

        },
        hideTips:function (el) {
            var self = this;
            var _id = self._getTipId(el);
            var tip = D.get("#" + _id);
            var _timer = setTimeout(function () {
                D.hide(tip);
                D.css(tip, {left: '-9999px', top:'-9999px'});
            }, 3000);
            self.get("timers")[_id] = _timer;
        },
        closeTips:function (tip) {
            this._clearTimer(tip.id);
            D.hide(tip);
            D.css(tip, {left: '-9999px', top:'-9999px'});
        },
        _clearTimer:function (tipid) {
            var _timer = this.get("timers")[tipid];
            if (_timer) {
                clearTimeout(_timer);
                delete this.get("timers")[tipid];
            }
        },
        _createTipId:function () {
            return this.get('prex') + ++count;
        },

        _posTip:function (el, tip) {
            var self = this;
            var elOffset = D.offset(el);
            var elX1 = elOffset.left;
            var elY2 = elOffset.top;
            var _el = {
                x1:elX1,
                y1:elY2,
                x2:elX1 + D.innerWidth(el),
                y2:elY2 + D.innerHeight(el)
            };

            var _viewW = D.viewportWidth();
            var _viewH = D.viewportHeight();
            var _left = D.scrollLeft(window);
            var _top = D.scrollTop(window);
            var _view = {
                x1:_left,
                y1:_top,
                x2:_left + _viewW,
                y2:_top + _viewH
            }

            self._clearTimer(self._getTipId(el));
            D.show(tip);
            var _tip = {
                tip:tip,
                w:D.outerWidth(tip),
                h:D.outerHeight(tip)
            };
            //var _offset = self._testBR(_el, _tip, _view) || self._testTL(_el, _tip, _view) || self._testBL(_el, _tip, _view) || self._testTR(_el, _tip, _view);
            var _offset = self._testLT(_el, _tip, _view) || self._testTL(_el, _tip, _view) || self._testBL(_el, _tip, _view) || self._testTR(_el, _tip, _view);
            var _tri = D.get('.bx-tips-tri', tip);
            D.removeClass(tip, 'bx-tips-br');
            D.removeClass(tip, 'bx-tips-tl');
            D.removeClass(tip, 'bx-tips-bl');
            D.removeClass(tip, 'bx-tips-tr');
            D.addClass(tip, _offset.cls);
            D.css(tip, {position:'absolute', left:_offset.left + 'px', top:_offset.top + 'px'});


        },
        _testBR:function (el, tip, view) {
            var trisize = this.get("trisize");
            var adjust_left = trisize.width + trisize.distance * 2;
            var adjust_top = trisize.height;
            var x1 = el.x2 - adjust_left;
            var y1 = el.y2 + adjust_top;
            var x2 = x1 + tip.w - adjust_left;
            var y2 = y1 + tip.h + adjust_top;

            if (x2 > view.x2 || y2 > view.y2) {
                return false;
            } else {
                return {
                    left:x1,
                    top:y1,
                    cls:'bx-tips-br'
                };
            }
        },
        _testTL:function (el, tip, view) {
            var trisize = this.get("trisize");
            var adjust_left = trisize.width + trisize.distance * 2;
            var adjust_top = trisize.height;
            var x1 = el.x1 - tip.w + adjust_left;
            var y1 = el.y1 - tip.h - adjust_top;
            if (x1 < view.x1 || y1 < view.y1) {
                return false;
            } else {
                return {
                    left:x1,
                    top:y1,
                    cls:'bx-tips-tl'
                };
            }
        },
        _testBL:function (el, tip, view) {
            var trisize = this.get("trisize");
            var adjust_left = trisize.width + trisize.distance * 2;
            var adjust_top = trisize.height;
            var x1 = el.x1 - tip.w + adjust_left;
            var y1 = el.y2 + adjust_top;
            var x2 = el.x2 + adjust_left;
            var y2 = y1 + tip.h + adjust_top;
            if (x1 < view.x1 || y2 > view.y2) {
                return false;
            } else {
                return {
                    left:x1,
                    top:y1,
                    cls:'bx-tips-bl'
                };
            }
        },
        _testTR:function (el, tip, view) {
            var trisize = this.get("trisize");
            var adjust_left = trisize.width + trisize.distance * 2;
            var adjust_top = trisize.height;
            var x1 = el.x2 - adjust_left;
            var y1 = el.y1 - tip.h - adjust_top;
            var x2 = el.x2 + tip.w - adjust_left;
            var y2 = y1;
            if (x2 > view.x2 || y1 < view.y1) {
                return false;
            } else {
                return {
                    left:x1,
                    top:y1,
                    cls:'bx-tips-tr'
                };
            }
        },
        _testLT:function (el, tip, view) {
            console.log(el);
            console.log(tip);
            var trisize = this.get("trisize");
            var adjust_left = trisize.height;
            var adjust_top = trisize.width+trisize.distance2 * 2;
            var x1 = el.x1 - tip.w-adjust_left;
            var y1 = el.y1 - tip.h + adjust_top;
            console.log(x1);
            console.log(y1);
            if (x1 < view.x1 || y1 < view.y1) {
                return false;
            } else {
                return {
                    left:x1,
                    top:y1,
                    cls:'bx-tips-lt'
                };
            }
        },
        _getTipId:function (el) {
            return D.attr(el, "data-tipid");
        }
    };
    S.extend(Tips, Brick, {
        initialize:function () {
            var self = this;
            window.onresize = function() {
                var tips = self.get("tips");
                S.each(tips, function(item){
                    self.closeTips(D.get("#"+item));
                });
            };
            if(S.UA.ie && S.UA.ie == 6) {
                E.delegate('html', 'mouseenter mouseleave', '.bx-tips-close', function(e) {
                    if(e.type === 'mouseenter') {
                        D.addClass(e.currentTarget, 'hover');
                    } else {
                        D.removeClass(e.currentTarget, 'hover');
                    }
                });
            }
        },
        destructor:function () {

        }
    });

    S.augment(Tips, Tips.METHOD);
    return Tips;


}, {
    requires:["brix/core/brick", "node", "template"]
});