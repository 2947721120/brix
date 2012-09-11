KISSY.add("brix/gallery/inplaceeditor/index", function(S, Brick) {
    function InplaceEditor() {
        InplaceEditor.superclass.constructor.apply(this, arguments);
    }
    InplaceEditor.ATTRS = {
        autoRender:{
            value:true
        },
        tmpl:{
            value:'<div class="inplaceeditor-popup"><input type="text" value=""></div>'
        }
    };
    InplaceEditor.EVENTS = {
        "input": {
            focusout: function(e) {
                this.hide();
            },
            keydown: function(e) {
                if (e.keyCode == 13) {
                    this.hide();
                }
            }
        }
    };

    InplaceEditor.METHODS = {
        /**
         * 显示就地编辑
         * @param  {Number} x 显示的X坐标
         * @param  {Number} y 显示的Y坐标
         * @param  {String} v 文本框的值
         */
        show: function(x, y, v,css) {
            var el = this.get('el'),inputNode = el.one('input');
            el.css({
                visibility: 'visible',
                left: x,
                top: y
            });
            this._v = v;
            if(css){
                inputNode.css(css);
            }
            inputNode[0].focus();
            inputNode.val(v);
        },
        /**
         *  隐藏就地编辑
         */
        hide: function() {
            var el = this.get('el');
            el.css({
                visibility: 'hidden',
                left: '-9999px',
                top: '-9999px'
            });
            var v = this.getValue();
            if (this._v != v) {//值不相等时候触发valueChange事件
                this.fire('valueChange', {
                    value: v
                });
            }
        },
        /**
         * 获取当前值
         */
        getValue: function() {
            var el = this.get('el');
            return el.one('input').val();
        }
    };

    S.extend(InplaceEditor, Brick, {
        _v: null//记录编辑原始值
        
    });

    S.augment(InplaceEditor,InplaceEditor.METHODS);
    
    return InplaceEditor;
}, {
    requires: ["brix/core/brick"]
});