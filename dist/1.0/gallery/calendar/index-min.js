KISSY.add("brix/gallery/calendar/index",function(e,t,n,i,a){function r(){r.superclass.constructor.apply(this,arguments);var t=this,n=t.get("popup"),i=e.one(t.get("trigger"));if(n&&i){var a=t.get("triggerType");e.each(a,function(e){i.on(e,t.toggle,t)})}}return r.Date=a,r.ATTRS={date:{value:new Date},selected:{value:null},startDay:{value:0},pages:{value:1},closable:{value:!1},rangeSelect:{value:!1},minDate:{value:!1},maxDate:{value:!1},multiSelect:{value:!1},multi:{value:null,setter:function(e){for(var t=0;e.length>t;t++)e[t]instanceof Date&&(e[t]=a.format(e[t],"isoDate"));return e}},navigator:{value:!0},popup:{value:!0},showTime:{value:!1},trigger:{value:!1},triggerType:{value:["click"]},disabled:{value:!1},range:{value:!1},rangeLinkage:{value:!0},align:{value:{node:!1,points:["bl","tl"],offset:[0,0]}},notLimited:{value:!1},tmpl:{getter:function(e){if(!e){var t=this;e='<div class="calendar-pages"></div><div bx-tmpl="calendar" bx-datakey="notLimited,multiSelect,showTime,op_html" class="calendar-operator">{{{op_html}}}</div>',t.get("el")||(e='<div class="calendar">'+e+"</div>"),this.__set("tmpl",e)}return e}},autoRender:{value:!1},prev:{value:!0},next:{value:!0},confirmBtn:{value:!0}},r.FIRES={select:"select",monthChange:"monthChange",timeSelect:"timeSelect",rangeSelect:"rangeSelect",multiSelect:"multiSelect",show:"show",hide:"hide"},r.RENDERERS={op:{html:function(e){var t=e,n=t.get("notLimited"),i=t.get("showTime"),a=t.get("multiSelect"),r="";return(i||a)&&t.get("confirmBtn")&&(r+='<a class="btn btn-size25 btn-calendar-confirm">\u786e\u5b9a</a>'),n&&(r+='<a class="btn btn-size25 btn-calendar-notlimited">\u4e0d\u9650</a>'),r}}},r.DOCEVENTS={"":{click:function(t){var n=this,i=n.get("el"),a=e.one(t.target),r=e.one(n.get("trigger"));i.equals(a)||i.contains(a)||!r||r.contains(a)||a[0]==r[0]||n.hide()}}},r.EVENTS={".btn-calendar-confirm":{click:function(){var t=this,n=t.get("selected"),i=t.get("showTime"),a=t.get("multiSelect");if(a){var o=t.getMulti();t.fire(r.FIRES.multiSelect,{multi:o})}else if(i){var s=new Date;n&&(s=n);var l=t.pageBricks[0].timeBrick.get("time");s.setHours(l.getHours()),s.setMinutes(l.getMinutes()),s.setSeconds(l.getSeconds()),e.log(s),t.fire(r.FIRES.timeSelect,{date:s})}t.hide()}},".btn-calendar-notlimited":{click:function(){var e=this,t=e.get("notLimited");t&&(e.fire(r.FIRES.select,{date:null}),e.hide())}}},r.METHODS={show:function(){var t=this;if(t.get("rendered")||t.render(),t.overlay){var n=e.clone(t.get("align"));n.node||(n.node=t.get("trigger")),t.overlay.set("align",n),t.overlay.show(),t.fire(r.FIRES.show)}},hide:function(){var e=this;e.overlay&&(e.overlay.hide(),e.fire(r.FIRES.hide))},toggle:function(e){var t=this;e&&e.preventDefault();var t=this;t.overlay?"hidden"==t.overlay.get("el").css("visibility")?t.show():t.hide():t.show()}},e.extend(r,t,{initialize:function(){var t=this,a=t.get("popup"),o=t.get("closable"),s=t.get("pages"),l=t.get("rangeLinkage"),c=t.get("el"),u=t.get("date"),d=u.getMonth(),p=u.getFullYear(),f=t.get("trigger");if(a){var h=e.clone(t.get("align"));h.node||(h.node=f),t.overlay=new n({srcNode:t.get("el"),align:h}),t.overlay.render()}else c.css({position:"static",visibility:"visible"});var g=c.one(".calendar-pages");t.pageBricks=[],c.addClass(".calendar-"+s);for(var v,m,b=0;s>b;b++)l?(v=0==b,m=b==s-1):(v=!0,m=!0),function(e){var n=new i({index:e,prev:t.get("prev")?v:!1,next:t.get("next")?m:!1,year:p,month:d,father:t,isRemoveHTML:t.get("isRemoveHTML"),isRemoveEl:t.get("isRemoveEl"),container:g});t.pageBricks.push(n),n.on("itemClick",function(e){var n=t.get("rangeSelect");n?t._handleRange(e.date):e.date&&(t.set("selected",e.date),t.fire(r.FIRES.select,{date:e.date}),a&&o&&!t.get("showTime")&&t.hide())}),n.on("itemMouseDown",function(e){var n=t.get("multiSelect");n&&t._handleMultiSelectStart(e.date)}),n.on("itemMouseUp",function(e){var n=t.get("multiSelect");n&&(t._handleMultiSelectEnd(e.date),t.fire("multiOneSelect"))}),n.on("monthChange",function(e){t._bindDateValueChange(e.date,e.index)})}(b),11==d?(p++,d=0):d++;t._bindDataChange("range"),t._bindDataChange("multi"),t._bindDataChange("disabled"),t._bindDataChange("minDate"),t._bindDataChange("maxDate"),t._bindDataChange("selected"),t._bindDataChange("startDay"),t.on("afterDateChange",function(){t._bindDateValueChange(t.get("date"))})},destructor:function(){var t=this;if(trigger=e.one(t.get("trigger")),t.get("popup")&&trigger){var n=t.get("triggerType");e.each(n,function(e){trigger.detach(e,t.toggle,t)})}t.pageBricks&&(e.each(t.pageBricks,function(e){e.destroy()}),t.pageBricks=null),t.overlay&&t.overlay.destroy()},_bindDataChange:function(e,t){var n=this,t=e.replace(/\b(\w)|\s(\w)/g,function(e){return e.toUpperCase()});n.on("after"+t+"Change",function(){for(var t=n.get(e),i=0;n.pageBricks.length>i;i++)n.pageBricks[i].setChunkData(e,t)})},_bindDateValueChange:function(e,t){t=t||0;var n=this,i=n.get("rangeLinkage"),a=e.getFullYear(),o=e.getMonth();if(i){for(var s=0;n.pageBricks.length>s;s++){var l=o-t+s,c=a;0>l?(c--,l+=12):l>11&&(c++,l-=12),n.pageBricks[s].set("year",c),n.pageBricks[s].set("month",l)}var u=a,d=o-t;0>d&&(u--,d+=12),n.fire(r.FIRES.monthChange,{date:new Date(u,d,1)})}else n.pageBricks[t].set("year",a),n.pageBricks[t].set("month",o),n.fire(r.FIRES.monthChange,{date:new Date(a,o,1)})},_handleRange:function(t){var n,i=this,a=e.clone(i.get("range"))||{};if(!a.start&&!a.end||a.start&&a.end)a.start=t,a.end=null,i.set("range",a);else{a.end=t,a.start.getTime()>a.end.getTime()&&(n=a.start,a.start=a.end,a.end=n),i.set("range",a),i.fire(r.FIRES.rangeSelect,a);var o=i.get("popup"),s=i.get("closable");o&&s&&i.hide()}},_handleMultiSelectStart:function(e){this.multiStartDate=e},_handleMultiSelectEnd:function(t){if(this.multiStartDate){var n,i=this,r=e.clone(i.get("multi"))||[],o=i.multiStartDate,s=(i.get("minDate"),i.get("maxDate"),i.get("disabled"));for(o>t?(n=o,o=t):n=t;n>=o;)if(!a.isDisabled(s,o)){var l=a.format(o,"isoDate");e.inArray(l,r)?r.splice(e.indexOf(l,r),1):r.push(l),o.setDate(o.getDate()+1)}delete i.multiStartDate,i.set("multi",r)}},getMulti:function(){var t=this,n=e.clone(t.get("multi"));n.sort(function(e,t){return e>t?1:-1});for(var i=0;n.length>i;i++)n[i]=a.parse(n[i]);return n}}),e.augment(r,r.METHODS),r},{requires:["brix/core/brick","overlay","./page","./date"]}),KISSY.add("brix/gallery/calendar/date",function(){function e(e,t){var n=null;if(t=t||"-",e instanceof Date)return e;if(n=new Date(e),n instanceof Date&&"Invalid Date"!=n&&!isNaN(n))return n;var i=(""+e).split(t);return 3==i.length&&(n=new Date(i[0],parseInt(i[1],10)-1,i[2]),n instanceof Date&&"Invalid Date"!=n&&!isNaN(n))?n:null}var t=function(){var t=/w{1}|d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,n=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,i=/[^-+\dA-Z]/g,a=function(e,t){for(e+="",t=t||2;t>e.length;)e="0"+e;return e},r={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUTCDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",localShortDate:"yy\u5e74mm\u6708dd\u65e5",localShortDateTime:"yy\u5e74mm\u6708dd\u65e5 hh:MM:ss TT",localLongDate:"yyyy\u5e74mm\u6708dd\u65e5",localLongDateTime:"yyyy\u5e74mm\u6708dd\u65e5 hh:MM:ss TT",localFullDate:"yyyy\u5e74mm\u6708dd\u65e5 w",localFullDateTime:"yyyy\u5e74mm\u6708dd\u65e5 w hh:MM:ss TT"},o={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","\u661f\u671f\u65e5","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};return function(s,l,c){if(1!=arguments.length||"[object String]"!=Object.prototype.toString.call(s)||/\d/.test(s)||(l=s,s=void 0),s=s?e(s):new Date,isNaN(s))throw SyntaxError("invalid date");l=(r[l]||l||r["default"])+"","UTC:"==l.slice(0,4)&&(l=l.slice(4),c=!0);var u=c?"getUTC":"get",d=s[u+"Date"](),p=s[u+"Day"](),f=s[u+"Month"](),h=s[u+"FullYear"](),g=s[u+"Hours"](),v=s[u+"Minutes"](),m=s[u+"Seconds"](),b=s[u+"Milliseconds"](),y=c?0:s.getTimezoneOffset(),x={d:d,dd:a(d,void 0),ddd:o.dayNames[p],dddd:o.dayNames[p+7],w:o.dayNames[p+14],m:f+1,mm:a(f+1,void 0),mmm:o.monthNames[f],mmmm:o.monthNames[f+12],yy:(h+"").slice(2),yyyy:h,h:g%12||12,hh:a(g%12||12,void 0),H:g,HH:a(g,void 0),M:v,MM:a(v,void 0),s:m,ss:a(m,void 0),l:a(b,3),L:a(b>99?Math.round(b/10):b,void 0),t:12>g?"a":"p",tt:12>g?"am":"pm",T:12>g?"A":"P",TT:12>g?"AM":"PM",Z:c?"UTC":((s+"").match(n)||[""]).pop().replace(i,""),o:(y>0?"-":"+")+a(100*Math.floor(Math.abs(y)/60)+Math.abs(y)%60,4),S:["th","st","nd","rd"][d%10>3?0:(10!=d%100-d%10)*d%10]};return l.replace(t,function(e){return e in x?x[e]:e.slice(1,e.length-1)})}}();return{format:function(e,n,i){return t(e,n,i)},parse:function(t,n){return e(t,n)},isMinMax:function(e,n,i){return i=t(i,"isoDate"),e&&(e=Brix_Date.format(e,"isoDate"),e>i)?!1:n&&(n=Brix_Date.format(n,"isoDate"),i>n)?!1:!0},isDisabled:function(e,n){if(n=t(n,"isoDate"),e)for(var i=0;e.length>i;i++)if(t(e[i],"isoDate")==n)return!0;return!1},isInMulit:function(e,n){if(n=t(n,"isoDate"),e)for(var i=0;e.length>i;i++)if(t(e[i],"isoDate")==n)return!0;return!1},isInRang:function(e,n){if(n=t(n,"isoDate"),e)if(e.start&&e.end){if(n>=t(e.start,"isoDate")&&t(e.end,"isoDate")>=n)return!0}else if(e.start&&n==t(e.start,"isoDate"))return!0;return!1},isYear:function(e){return/^\d+$/i.test(e)?(e=Number(e),!(100>e||e>1e4)):!1}}}),KISSY.add("brix/gallery/calendar/page",function(e,t,n,i){function a(e){for(var t=[],n=0;7>n;n++)t[n]=s[(n+e)%7];return t}function r(e,t){return 32-new Date(e,t,32).getDate()}function o(){o.superclass.constructor.apply(this,arguments)}var s=["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"];return o.ATTRS={father:{value:!1},index:{value:0},year:{value:2012},month:{value:7},prev:{value:!0},next:{value:!0},autoRender:{value:!0},tmpl:{valueFn:function(){return'<div  class="calendar-page"><div class="calendar-page-hd"><div bx-mpl="page" bx-datakey="prev">{{#prev}}<a href="javascript:void(0);" class="calendar-prev-year"><i class="iconfont">&#403</i><i class="iconfont icon-yp">&#403</i></a><a href="javascript:void(0);" class="calendar-prev-month"><i class="iconfont">&#403</i></a>{{/prev}}</div><a bx-tmpl="yearmonth" bx-datakey="year,month" href="javascript:void(0);" class="calendar-year-month">{{year}}\u5e74{{month}}\u6708</a><div bx-tmpl="next" bx-datakey="next">{{#next}}<a href="javascript:void(0);" class="calendar-next-month "><i class="iconfont">&#402</i></a><a href="javascript:void(0);" class="calendar-next-year "><i class="iconfont icon-yn">&#402</i><i class="iconfont">&#402</i></a>{{/next}}</div><div class="calendar-year-month-pupop" ><p bx-tmpl="select" bx-datakey="month,select_html">{{{select_html}}}</p><p bx-tmpl="year" bx-datakey="year">\u5e74:<input type="text" value="{{year}}" onfocus="this.select()"></p><p><a class="btn btn-size25 btn-pupop-confirm">\u786e\u5b9a</a><a class="btn-pupop-cancel" href="#">\u53d6\u6d88</a></p></div></div><div bx-tmpl="pagewbd" bx-datakey="startDay,days_html" class="calendar-page-wbd">{{{days_html}}}</div><div bx-tmpl="pagedbd" bx-datakey="startDay,year,month,selected,range,multi,disabled,minDate,maxDate,da_html" class="calendar-page-dbd">{{{da_html}}}</div><div class="calendar-page-fd"></div></div>'}},data:{valueFn:function(){var e=this,t=(e.get("father"),e.get("year")),n=e.get("month"),i=e.get("prev"),a=e.get("next");return{prev:i,next:a,month:n+1,year:t}}}},o.RENDERERS={da:{html:function(e){var t=e,n=t.get("father"),a=t.get("year"),o=t.get("month"),s=n.get("selected"),l=n.get("minDate"),c=n.get("maxDate"),u=n.get("disabled"),d=n.get("multi"),p=n.get("range"),f=(7-n.get("startDay")+new Date(a,o,1).getDay())%7,h=r(a,o),g=i.format(new Date,"isoDate"),v="";s&&(s=i.format(s,"isoDate")),l&&(l=i.format(l,"isoDate")),c&&(c=i.format(c,"isoDate"));for(var m=0;f>m;m++)v+='<a href="javascript:void(0);" class="calendar-hidden">0</a>';for(var m=1;h>=m;m++){var b='class="calendar-item',y=i.format(new Date(a,o,m),"isoDate");l>y||y>c||i.isDisabled(u,y)?b+=" calendar-disabled":i.isInRang(p,y)?b+=" calendar-range":s==y?b+=" calendar-selected":i.isInMulit(d,y)&&(b+=" calendar-multi"),g==y&&(b+=" calendar-today"),v+="<a "+b+'" href="javascript:void(0);">'+m+"</a>"}return v}},select:{html:function(){for(var e="\u6708:<select>",t=1;12>=t;t++)e+="<option"+(t==this.month?" selected":"")+' value="'+(t-1)+'">'+(10>t?"0"+t:t)+"</option>";return e+="</select>"}},days:{html:function(t){var n=t.get("father"),i=a(n.get("startDay")),r="";return e.each(i,function(e){r+="<span>"+e+"</span>"}),r}}},o.EVENTS={".calendar-prev-year":{click:function(){var e=this,t=e.get("year"),n=e.get("month"),i=e.get("index");t--,date=new Date(t,n,1),e.fire(o.FIRES.monthChange,{date:date,index:i})}},".calendar-prev-month":{click:function(){var e=this,t=e.get("year"),n=e.get("month"),i=e.get("index");n--,0>n&&(t--,n+=12),date=new Date(t,n,1),e.fire(o.FIRES.monthChange,{date:date,index:i})}},".calendar-next-year":{click:function(){var e=this,t=e.get("year"),n=e.get("month"),i=e.get("index");t++,date=new Date(t,n,1),e.fire(o.FIRES.monthChange,{date:date,index:i})}},".calendar-next-month":{click:function(){var e=this,t=e.get("year"),n=e.get("month"),i=e.get("index");n++,n>11&&(t++,n-=12),date=new Date(t,n,1),e.fire(o.FIRES.monthChange,{date:date,index:i})}},".calendar-year-month":{click:function(){var e=this,t=e.get("father").get("navigator");t&&(popupNode=e.get("el").one(".calendar-year-month-pupop").show())}},".btn-pupop-confirm":{click:function(e){e.preventDefault();var t=this,n=t.get("index");if(popupNode=t.get("el").one(".calendar-year-month-pupop"),year=popupNode.one("input").val(),month=popupNode.one("select").val(),i.isYear(year)){year=Number(year),month=Number(month);var a=new Date(year,month,1);popupNode.hide(),t.fire(o.FIRES.monthChange,{date:a,index:n})}}},".btn-pupop-cancel":{click:function(e){e.preventDefault();var t=this,n=t.get("el").one(".calendar-year-month-pupop");n.hide()}},".calendar-item":{click:function(t){t.preventDefault();var n=this,i=e.one(t.currentTarget);if(!i.hasClass("calendar-disabled")){var a=!1;if(!i.hasClass("calendar-selected")){var r=n.get("year"),s=n.get("month");if(a=new Date(r,s,Number(i.html())),n.timeBrick){var l=n.timeBrick.get("time");a.setHours(l.getHours()),a.setMinutes(l.getMinutes()),a.setSeconds(l.getSeconds())}}e.later(function(){n.fire(o.FIRES.itemClick,{date:a})},0)}},mousedown:function(t){t.preventDefault();var n=this,i=e.one(t.currentTarget);if(!i.hasClass("calendar-disabled")){var a=n.get("year"),r=n.get("month"),s=new Date(a,r,Number(i.html()));n.fire(o.FIRES.itemMouseDown,{date:s})}},mouseup:function(t){t.preventDefault();var n=this,i=e.one(t.currentTarget);if(!i.hasClass("calendar-disabled")){var a=n.get("year"),r=n.get("month"),s=new Date(a,r,Number(i.html()));n.fire(o.FIRES.itemMouseUp,{date:s})}}}},o.METHODS={},o.FIRES={itemClick:"itemClick",itemMouseDown:"itemMouseDown",itemMouseUp:"itemMouseUp",monthChange:"monthChange"},e.extend(o,t,{initialize:function(){var e=this,t=e.get("el"),i=e.get("father"),a=i.get("showTime");a&&(e.timeBrick=new n({isRemoveHTML:e.get("isRemoveHTML"),isRemoveEl:e.get("isRemoveEl"),container:t.one(".calendar-page-fd")})),e.on("afterYearChange",function(){e.setChunkData("year",e.get("year"))}),e.on("afterMonthChange",function(){e.setChunkData("month",e.get("month")+1)})},destructor:function(){var e=this;e.timeBrick&&e.timeBrick.destroy()}}),e.augment(o,o.METHODS),o},{requires:["brix/core/brick","./time","./date"]}),KISSY.add("brix/gallery/calendar/time",function(e,t){function n(){n.superclass.constructor.apply(this,arguments)}var i={h:["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],m:["00","10","20","30","40","50"],s:["00","10","20","30","40","50"]};return n.ATTRS={time:{value:new Date},status:{value:"s"},autoRender:{value:!0},tmpl:{value:'<div><div class="calendar-time">\u65f6\u95f4\uff1a<span class="h">{{h}}</span>:<span class="m">{{m}}</span>:<span class="s">{{s}}</span><div class="calendar-time-updown"><i class="iconfont u">&#456</i><i class="iconfont d">&#459</i></div></div><div class="calendar-time-popup"><div bx-tmpl="time" bx-datakey="list" class="calendar-time-popup-bd"><!--bx-tmpl="time" bx-datakey="list"-->{{#list}}<a class="item">{{.}}</a>{{/list}}<!--bx-tmpl="time"--></div><i class="iconfont icon-close">&#223</i></div></div>'},data:{valueFn:function(){var e=this,t=e.get("time");return{h:t.getHours(),m:t.getMinutes(),s:t.getSeconds()}}}},n.EVENTS={span:{click:function(t){var n=this,a=e.one(t.currentTarget);a.parent().all("span").removeClass("on"),a.addClass("on"),a.hasClass("h")?n.set("status","h"):a.hasClass("m")?n.set("status","m"):n.set("status","s");var r=n.get("status");n.setChunkData("list",i[r]),n.get("el").one(".calendar-time-popup").css({display:"block"})}},".icon-close":{click:function(){var e=this;e._hideTimePopup()}},".item":{click:function(t){var n=this,i=e.one(t.currentTarget),a=n.get("status");n._setTime(a,i.html()),n._hideTimePopup()}},".u":{click:function(){var e=this,t=e.get("status"),n=e._getTime(t);n++,e._setTime(t,n)}},".d":{click:function(){var e=this,t=e.get("status"),n=e._getTime(t);n--,e._setTime(t,n)}},"":{keyup:function(e){var t=this,n=t.get("status"),i=t._getTime(n);(38==e.keyCode||37==e.keyCode)&&(e.preventDefault(),i++,t._setTime(n,i)),(40==e.keyCode||39==e.keyCode)&&(e.preventDefault(),i--,t._setTime(n,i))}}},n.METHODS={},n.FIRES={timeSelect:"timeSelect"},e.extend(n,t,{initialize:function(){},_setTime:function(e,t){var n=this,i=n.get("time"),a=n.get("el");switch(t=Number(t),e){case"h":i.setHours(t);break;case"m":i.setMinutes(t);break;case"s":i.setSeconds(t)}a.one(".h").html(i.getHours()),a.one(".m").html(i.getMinutes()),a.one(".s").html(i.getSeconds())},_getTime:function(e){var t=this,n=t.get("time");switch(e){case"h":return n.getHours();case"m":return n.getMinutes();case"s":return n.getSeconds()}},_hideTimePopup:function(){var e=this,t=e.get("el");t.one(".calendar-time-popup").css({display:"none"})},destructor:function(){}}),e.augment(n,n.METHODS),n},{requires:["brix/core/brick"]});