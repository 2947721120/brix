KISSY.add("brix/gallery/multimedia/index",function(e,t,i,a){var n=i.all,r=t.extend({initializer:function(){var t=this,i="multimedia_"+e.guid();t.setAttr(),t.set("id",i);var r=n('<div id="'+i+'"></div>');r.css({width:t.get("w0"),height:t.get("h0"),position:"absolute",right:t.get("right"),top:t.get("top"),"z-index":999999}),n("body").prepend(r),r=null;var o="fn_multimedia_"+e.guid();window[o]=function(e,i){t.sendToJS(e,i)},a.add("#"+i,{src:t.get("swf_url"),id:i+"_swf",version:10,params:{flashvars:{JavaScriptName:o,url:t.get("url")},wmode:"transparent",allowScriptAccess:"always"},attrs:{width:"100%",height:"100%"}})},setAttr:function(){var e=this;TB&&TB.Global&&"2.0"==TB.Global.version&&e.set("top",36)},sendToJS:function(e,t){var i=this;"switch"==e?i._switch(t):"open"==e&&window.open(t)},_switch:function(t){var i,a=this,n="start"==t?1:0;1==n?(i={width:a.get("w1"),height:a.get("h1")},n=0):(i={width:a.get("w0"),height:a.get("h0")},n=1),e.one("#"+a.get("id")).css(i)}});return r.ATTRS={w0:{value:100},h0:{value:100},w1:{value:300},h1:{value:250},right:{value:0},top:{value:28}},r},{requires:["base","node","flash"]});