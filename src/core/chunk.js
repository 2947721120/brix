KISSY.add("brix/core/chunk", function(S, Node, UA, Base, Dataset, Tmpler) {
    var $ = Node.all;
    /**
     * Brix Chunk,Brick和Pagelet类的基类,
     * 作为组件底层，完成渲染、数据更新、销毁操作，是模板解析器（Tmpler）和数据管理器（Dataset）的调度者。
     * @extends KISSY.Base
     * @class Brix.Chunk
     */

    function Chunk() {
        Chunk.superclass.constructor.apply(this, arguments);
        var self = this;
        var tmpl = self.get('tmpl');
        if(tmpl) {
            self._buildTmpler(tmpl, self.get('level'));
            var tmpler = self.get('tmpler');
            if(tmpler) {
                self._buildDataset(self.get('data'));
                if(tmpler.inDom) {
                    self.set('el', tmpl);
                }
            }
        }
    }

    /**
     * The default set of attributes which will be available for instances of this class, and
     * their configuration
     *
     * By default if the value is an object literal or an array it will be 'shallow' cloned, to
     * protect the default value.
     *
     *      for example:
     *      @example
     *      {
     *          x:{
     *              value: // default value
     *              valueFn: // default function to get value
     *              getter: // getter function
     *              setter: // setter function
     *          }
     *      }
     * see:
     * <a href="http://docs.kissyui.com/kissy/docs/#!/api/KISSY.Base">http://docs.kissyui.com/kissy/docs/#!/api/KISSY.Base</a>
     *
     * @property ATTRS
     * @member KISSY.Base
     * @static
     * @type {Object}
     */

    Chunk.ATTRS = {
        /**
         * 组件节点
         * @cfg {String}
         */
        el: {
            getter: function(s) {
                if(S.isString(s)) {
                    s = $(s);
                }
                return s;
            }
        },
        /**
         * 在销毁的时候是否移除HTML，默认true
         * @cfg {Object}
         */
        isRemoveHTML: {
            value: true
        },
        /**
         * 在销毁的时候是否移除本身，默认true
         * @cfg {Object}
         */
        isRemoveEl: {
            value: true
        },
        /**
         * 容器节点
         * @cfg {String}
         */
        container: {
            value: 'body',
            getter: function(s) {
                if(S.isString(s)) {
                    s = $(s);
                }
                return s;
            }
        },
        /**
         * 模板代码，如果是已经渲染的html元素，则提供渲染html容器节点选择器
         * @cfg {String}
         */
        tmpl: {
            value: false
        },
        /**
         * 解析后的模板对象
         * @type {Brix.Tmpler}
         */
        tmpler: {
            value: false
        },
        /**
         * 是否已经渲染
         * @type {Boolean}
         */
        rendered: {
            value: false
        },
        /**
         * 是否自动渲染
         * @cfg {Boolean}
         */
        autoRender: {
            value: true
        },
        /**
         * 模板数据
         * @cfg {Object}
         */
        data: {
            value: false
        },
        /**
         * 解析后的数据对象
         * @type {Brix.Dataset}
         */
        dataset: {
            value: false
        },
        /**
         * 子模板解析的层级
         * @cfg {Number}
         */
        level: {
            value: 3
        }
    };

    S.extend(Chunk, Base, {
        /**
         * 构建模板解析器
         * @param {String} tmpl 模板字符串
         * @param {Number} level 模板解析的层级
         * @private
         */
        _buildTmpler: function(tmpl, level) {
            var self = this;
            if(!self.get('isBuidTmpler')) {
                self.set('isBuidTmpler', true);
                var tmpler = new Tmpler(tmpl, level);
                self.set('tmpler', tmpler);
            }
        },
        /**
         * 构建数据管理器
         * @param {Object} data 数据集合
         * @private
         */
        _buildDataset: function(data) {
            var self = this;
            if(!self.get('isBuidDataset')) {
                self.set('isBuidDataset', true);
                data = data || {}; //原始数据
                data = S.clone(data); //数据深度克隆
                dataset = new Dataset({
                    data: data
                });
                self.set('dataset', dataset); //设置最新的数据集合
                dataset.on('afterDataChange', function(e) {
                    self._render(e.subAttrName, e.newVal);
                });
            }
        },
        /**
         * 销毁tmpler和dataset
         * @private
         */
        _destroy: function() {
            var self = this,
                tmpler = self.get('tmpler'),
                dataset = self.get('dataset');
            if(tmpler) {
                self.set('tmpler', null);
                delete tmpler.tmpls;
            }
            if(dataset) {
                self.set('dataset', null);
                dataset.detach();
            }
        },

        /**
         * 添加子模板
         * @param {String} name    模板名称
         * @param {String} datakey 模板对应的数据key
         * @param {String} tmpl    子模板
         */
        addTmpl: function(name, datakey, tmpl) {
            var self = this;
            self._buildTmpler('', false);
            self._buildDataset();
            var tmpler = self.get('tmpler');
            tmpler.addTmpl(name, datakey, tmpl);
        },

        /**
         * 设置数据，并刷新模板数据
         * @param {String} datakey 需要更新的数据对象key
         * @param {Object} data    数据对象
         * @param {Object} [opts]    控制对象，包括以下控制选项
         * @param {Boolean} [opts.silent] 是否触发change事件
         */
        setChunkData: function(datakey, data, opts) {
            var self = this,
                dataset = self.get('dataset');
            if(dataset) {
                data = S.clone(data);
                dataset.set('data.' + datakey, data, opts);
            }
        },
        /**
         * 将模板渲染到页面
         */
        render: function() {
            var self = this;
            if(!self.get("rendered")) {
                var dataset = self.get('dataset');
                if(dataset) {
                    self._render('data', dataset.get('data'));
                }
                self.set("rendered", true);
                self.fire('rendered');
            }
        },
        /**
         * 将模板渲染到页面
         * @param  {String} key  更新的数据对象key
         * @param  {Object} data 数据
         * @private
         */
        _render: function(key, data) {
            var self = this,
                tmpler = self.get('tmpler');
            if(tmpler) {
                if(key.split('.').length > 1) {
                    if(self.get("rendered")) {
                        //已经渲染，才能局部刷新
                        key = key.replace(/^data\./, '');
                        self._renderTmpl(tmpler.tmpls, key, data);
                    }
                } else {
                    if(!tmpler.inDom) {
                        var container = self.get('container');
                        var el = self.get('el');
                        var html = tmpler.to_html(data);
                        if((!el || el.length == 0)) {
                            var elID = 'brix_' + S.guid();
                            if(UA.ie <= 8) {
                                var node = new Node('<div />');
                                container.append(node);
                                node.html(html);
                                var childs = node[0].childNodes;
                                if(childs.length > 1) {
                                    node.attr('id', elID);
                                } else {
                                    elID = childs[0].id || elID;
                                    childs[0].id = elID;
                                    while(childs.length > 0) {
                                        container[0].appendChild(childs[0]);
                                    }
                                    node.remove();
                                }
                            } else {
                                var node = new Node(html);
                                if(node.length > 1) {
                                    node = $('<div id="' + elID + '"></div>').append(node);
                                } else {
                                    elID = node.attr('id') || elID;
                                    node.attr('id', elID);
                                }
                                container.append(node);
                            }
                            self.set('el', '#' + elID);
                        } else {
                            if(UA.ie <= 8) {
                                var node = new Node('<div />');
                                container.append(node);
                                node.html(html);
                                while(node[0].childNodes.length > 0) {
                                    container[0].appendChild(node[0].childNodes[0]);
                                }
                                node.remove();
                            } else {
                                container.append(html);
                            }
                        }
                    }
                }
            }
        },
        /**
         * 渲染模板
         * @param  {Array} tmpls  tmpls集合
         * @param  {String} key   更新的数据对象key
         * @param  {Object} data 数据
         * @private
         */
        _renderTmpl: function(tmpls, key, data) {
            var self = this,
                el = self.get('el');
            S.each(tmpls, function(o) {
                if((',' + o.datakey + ',').indexOf(',' + key + ',') >= 0) {
                    var nodes = el.all('[bx-tmpl=' + o.name + ']');
                    //如果el本身也是tmpl，则加上自己
                    if(el.attr('bx-tmpl') == o.name) {
                        nodes = el.add(nodes);
                    }
                    nodes.each(function(node) {
                        if(node.attr('bx-datakey') == o.datakey) {
                            var newData = {};
                            S.each(o.datakey.split(','), function(item) {
                                var tempdata = data,
                                    temparr = item.split('.'),
                                    length = temparr.length,
                                    i = 0;
                                while(i !== length) {
                                    tempdata = tempdata[temparr[i]];
                                    i++;
                                }
                                newData[temparr[length - 1]] = tempdata;
                                tempdata = null;
                            });
                            S.each(data, function(d, k) {
                                if(S.isFunction(d)) {
                                    newData[k] = d;
                                }
                            });
                            //局部刷新前触发
                            self.fire('beforeRefreshTmpl', {
                                node: node
                            });
                            node.html(o.tmpler.to_html(newData));
                            //局部刷新后触发
                            self.fire('afterRefreshTmpl', {
                                node: node
                            });
                            newData = null;
                        }
                    });
                    nodes = null;
                }
            });
        }
    });
    return Chunk;
}, {
    requires: ["node", 'ua', "base", "./dataset", "./tmpler"]
});