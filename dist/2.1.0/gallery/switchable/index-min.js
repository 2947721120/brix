KISSY.add("brix/gallery/switchable/index",function(e,t,i){var a=t.extend({constructor:function(e){this.config=e,a.superclass.constructor.apply(this,arguments)},bindUI:function(){var e=this,t=e.config;if(t.switchType){var a=t.switchType;delete t.switchType,e.switchable=new i[a](e.get("el"),t)}else e.switchable=new i(e.get("el"),t);t=null,delete e.config},destructor:function(){var e=this;e.switchable&&e.switchable.destroy&&e.switchable.destroy()}});return a},{requires:["brix/core/brick","switchable"]});