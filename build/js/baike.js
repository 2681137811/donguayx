(function( $, window, document, undefined ) {


// icoBox 图标盒子
var icoBox = {

    render : function ( location, info ){
            
            this.dom = $(location);
            this.info = info;
            
        //【 1.主容器渲染 】
        
            var html = "\
                <div class='icoBox'>\
                    <div class='icoDtl'><div class='icoDtlBox'></div></div>\
                    <div class='icoDir'></div>\
                    <div class='icoScr'></div>\
                </div>\
            ";

            this.dom.addClass('icoHome').append( html );

            this.dtl = this.dom.find(".icoDtlBox").first();
            this.dir = this.dom.find(".icoDir").first();
            this.scr = this.dom.find(".icoScr").first();

        
        //【 2.数据处理 】
        
            //--2.1.如果存在需要替换的变量
            if ( !$.isEmptyObject( this.info.head.template ) ){
                for (var i in this.info.head.template ){
                    this.info.list = template( this.info.list, i, this.info.head.template[i] );
                }
            }
            //--2.2.如果存在标签属性，则生成标签类且按默认标签分类
            if( !$.isEmptyObject( this.info.head.tag ) ){

                //创建一个临时容器
                var bag = new Array();
                for ( var i in this.info.head.tag[0] ){
                    bag[i] = new Array();
                }

                //按默认标签分类
                for ( var i in this.info.list ){
                    bag[parseInt(this.info.list[i].tag[0])].push(this.info.list[i]);
                }

                //合并分类并转换类名
                this.info.list = [];
                for ( var x in bag ){
                    //进入分类容器
                    for (var y in bag[x]){
                        //把分类转换为类名
                        var newtag = "";
                        for (var z in bag[x][y].tag){
                            newtag += " " + bag[x][y].tag[z];
                        }
                        bag[x][y].tag = newtag;
                        this.info.list.push(bag[x][y]);
                    }
                }
            }


        //【 3.模版渲染 】
        
            //--3.1.创建内容细节 detail
            var html = "";
            this.info.skillbar = [];
                //--3.1.1标题
                html += "<h2 class='item-title'></h2>";
                //--3.1.2图片
                html += "<img class='item-image ico-large'><br>";
                //--3.1.3图片属性条
                if ( !$.isEmptyObject( this.info.head.skillbar ) ){
                    for(var i in this.info.head.skillbar){

                        this.info.skillbar.push( this.info.head.skillbar[i].reference );  //存储一个参考值
                        html += "\
                            <div id ='skillBar-" + i + "' class='skillBar'>\
                                <ul class='skillBox'>\
                                    <li class='skillName'>" + this.info.head.skillbar[i].name + "</li>\
                                    <li class='skillGraph'><span><i class='skillPoint' style='background-color:" + this.info.head.skillbar[i].color + ";'></i></span></li>\
                                    <li class='skillValue'></li>\
                                </ul>\
                            </div>\
                        ";
                    }
                }            
                //--3.1.4介绍
                html += "<div class='item-content'></div>"; 

            this.dtl.append( html );

            //--3.2.创建筛选框 screening
            var html = "";

            //--3.3.创建图标目录 directory
            var html = "";
            for(var i in this.info.list){
                html += 
                    "<li icoid='" + i + "' class='item" + this.info.list[i].tag + "' title='" + this.info.list[i].name + "'>\
                        <a>\
                            <img data-original='" + this.info.list[i].image + "' alt='" + this.info.list[i].name +"'>\
                            <h6>" + this.info.list[i].name + "</h6>\
                        </a>\
                    </li>";
            }
            this.dir.append( html );

            //--3.4.图片懒加载
            this.dir.find('img').lazyload({
                effect : "fadeIn",   //加载动画                
                placeholder: "http://t.donguayx.com/empty_95.png"    //默认图片
            });

            //--3.5.创建默认标题
            for(var i in this.info.head.tag[0]){
                this.dir.find(".0"+i).first().before("<h2>" + this.info.head.tag[0][i] + "</h2>");
            }

        //【 4.绑定参数 】

        this.bindClick();
    },
    
    bindClick : function(){

        //获取DOM
        this.dtl.title = this.dtl.find(".item-title");
        this.dtl.img = this.dtl.find(".item-image");
        this.dtl.skillbar = this.dtl.find(".skillBar");
        this.dtl.content = this.dtl.find(".item-content");

        //注册点击侦听
        icoBox.checkDetail(0);
        this.dir.find('.item').on('click',function(){
            icoBox.checkDetail($(this).attr("icoid"));
        });

        //绑定顶部固定
        this.dtl.hmFixedTop({
            "startAdjust"   : 20,      //顶部偏移触发量
            "endAdjust"     : 20,      //底部偏移触发量
            "topAdjust"     : 20,      //触发后顶部偏移
            "bottomAdjust"  : 20,      //触发后底部偏移
            "resize" : true            //窗口变化事件绑定
        });

    },

    checkDetail : function( index ){

        if(!index || isNaN(index) ) index = 0;

        //修改标题
        this.dtl.title.html( this.info.list[index].name );
        //修改图标
        this.dtl.img.attr( "src", this.info.list[index].image );
        //修改技能条
        for (var i in this.info.list[index].skillbar){
            if( typeof this.info.list[index].skillbar[i] !== "number" || this.info.list[index].skillbar[i] === null ){
                //如果不是一个数字，百分比为0 
                this.dtl.skillbar.eq(i).find(".skillPoint").css("width","0");
                this.dtl.skillbar.eq(i).find(".skillValue").html("-");
            } else {                    
                //显示数字
                this.dtl.skillbar.eq(i).find(".skillValue").html( this.info.list[index].skillbar[i] );
                
                if( this.info.list[index].skillbar[i] <= this.info.skillbar[i] && this.info.list[index].skillbar[i] > 0 ){
                     //如果是一个数字且小于参考值，则计算其百分比
                    this.dtl.skillbar.eq(i).find(".skillPoint").css("width",this.info.list[index].skillbar[i] /  this.info.skillbar[i] * 100 + "%" );
                }else if( this.info.list[index].skillbar[i] > this.info.skillbar[i] ){
                     //如果是一个数字且大于参考值，则百分比为100
                    this.dtl.skillbar.eq(i).find(".skillPoint").css("width","100%");
                }else{
                     //如果是一个数字且小于0，则百分比为0
                    this.dtl.skillbar.eq(i).find(".skillPoint").css("width","0" );
                }
            }
            
        }
        //修改介绍
        this.dtl.content.html( this.info.list[index].content );
    }




}




/* 
 *   模版替换，支持深度替换所有{key}的文本为传入的模版val
 *   template( 模版对象, 模版key, 模版val );
 */

function template( obj, key, val ){
    var reg = new RegExp( "{" + key + "}", "g");//生成正则表达式
    for (var i in obj){
        if( typeof obj[i] == "object" ){
            //如果遇到数组则深层遍历
            obj[i] = template( obj[i], key, val);
        }else{
            //替换代码,正则表达式进行全局匹配
            if( typeof obj[i] === "string" ) obj[i] = obj[i].replace( reg, val);

        }
    }
    return obj;
}


    //赋值
    window.icoBox = icoBox;

})(jQuery, window, document);





/*
 *  冬瓜项目用户登录系统
 *
 *
 */

(function( $, window, document, undefined ) {

    var document = window.document,
        location = window.location,
        donguayx = function(){
        
        };

    
/*
*   --------------- Sign ---------------
*        冬瓜用户登录程序，Ajax版本
*        donguayx.sign
*        donguayx.sign.bind
*        donguayx.sign.close
*        donguayx.sign.init
*        donguayx.sign.viewchange
*        donguayx.sign.verify
*        donguayx.sign.verifycode
*        donguayx.sign.request
*        donguayx.sign.callback
* 
**/

    donguayx.sign = function(){

        //如果没有初始化，则初始化
        if( !donguayx.sign.init.done ){
            donguayx.sign.init( $('.dg-sign:first') );
        }

        //页面初始化
        donguayx.sign.viewchange();
        donguayx.sign.verifycode();
        //加载页面
        donguayx.sign.dom.$main.fadeIn('200');
        //禁止主容器的滚动条
        document.body.style.overflow = 'hidden';
    }
    
    //外部控件绑定触发器
    donguayx.sign.bind = function ( obj ){
        $(obj).bind("click",donguayx.sign);
    }

    //关闭界面
    donguayx.sign.close = function(){
        donguayx.sign.dom.$main.fadeOut('200',function(){
            document.body.style.overflow = 'visible';
        });

    }

    //初始化
    donguayx.sign.init = function( obj ){
        
        var dom = {$main : obj};
        // 切换按钮
        dom.$changeBtn = $('#tag-login,#tag-signup', dom.$main );    
        // 表单实体
        dom.$signGroup = $('#dg-login,#dg-signup', dom.$main );
        // 验证码
        dom.$verify = $("input[name=verify]", dom.$signGroup );
        dom.$verifyPic = $(".verify-pic img", dom.$signGroup );


        // 绑定 - 关闭界面按钮
        $(".dg-sign-close", dom.$main ).click(donguayx.sign.close);
        
        // 绑定 - 切换按钮
        for( var i=0; i < dom.$changeBtn.length; i++ ){
            dom.$changeBtn.eq(i).click( {eq:i}, function(event){
                donguayx.sign.viewchange(event.data.eq);
            });
        }

        // 绑定 - 提交按钮
        $('.sign-submit', dom.$main ).click(function(){
            var type = this.id.split('-')[0];
            donguayx.sign.verify( type );
        });
        
        // 切换验证码
        dom.$verifyPic.click(donguayx.sign.verifycode);

        // 提交初始化参数
        donguayx.sign.dom = dom;
        donguayx.sign.init.done = true;
    }

    //窗口切换
    donguayx.sign.viewchange = function( index ){

        var $changeBtn = donguayx.sign.dom.$changeBtn,
            $signGroup = donguayx.sign.dom.$signGroup;

        if( !index )
            index = 0;

        //如果当前是焦点，则不做动作
        if( $changeBtn.eq(index).hasClass("focus") ) return; 

        //对应按钮焦点变换
        $changeBtn.removeClass('focus').eq(index).addClass('focus');

        //对应实体显示隐藏
        $signGroup.hide().eq(index).fadeIn('200');
    }

    //表单验证
    donguayx.sign.verify = function( type ){
        
        var 
        data = {type:type},
        warning = "warning",
        // 获取数据
        signform = document.forms[type];

        data['username'] = signform.username.value;
        data['password'] = signform.password.value;        
        data['verify'] = signform.verify.value;
        if ( type == 'signup' ){
            data['password_2'] = signform.password_2.value;
        }
        
        //基本检查
        if( type != "login" && type != "signup"){
            hm.mb("未知错误",warning);
            return;
        }

        if( data['username'] == "" ){
            hm.mb("请填写您的用户名",warning);
            return;               
        }else if( data['username'].length < 4 || data['username'].length > 20 ){
            hm.mb("用户名格式错误",warning);
            return;
        }else if( data['password'] == "" ){
            hm.mb("请填写您的密码",warning);
            return; 
        }else if( data['password'].length < 6 || data['password'].length > 20 ){
            hm.mb("密码格式错误",warning);
            return;
        }else if( data['verify'] == "" ){
            hm.mb("请填写验证码",warning);
            return;
        }else if( data['verify'] == "" || data['verify'].length < 4 ){
            hm.mb("验证码填写错误",warning);
            return;
        }

        //MD5加密
        if( type == 'login' ){
            data['password'] = $.md5(data['password']);
        }

        if( type == 'signup' && data['password'] != data['password_2'] ){
                hm.mb("两次输入的密码不一样","warning");
                return;
        }

        donguayx.sign.request(data); //发送数据
    }

    //更新验证码
    donguayx.sign.verifycode = function(){
        donguayx.sign.dom.$verifyPic.attr("src","/verify?r="+Math.random());
        donguayx.sign.dom.$verify.val("");
    }

    //发送请求
    donguayx.sign.request = function( data ){

        $.ajax({
            type: 'post',
            url: '/user',
            data: data,
            dataType: 'json',
            success: function( info ){
                if( info['status'] == 1 ){

                    //请求成功，执行回调函数
                    hm.mb(info['info']);
                    donguayx.sign.callback();                     
                }else if( info['status'] == 0 ){

                    //请求失败，返回错误代码并重置验证码
                    hm.mb( info['info'], "danger" );
                    donguayx.sign.verifycode();
                }
            },
            error: function(){
               hm.mb("操作失败，请检查网络。");
            }
        });

    }

    //回调函数
    donguayx.sign.callback = function(){

        donguayx.sign.dom.$signGroup[0].reset(); //清空表单内容
        donguayx.sign.dom.$signGroup[1].reset(); //清空表单内容
        //登陆成功后回调地址
        setTimeout(function(){            
            location.reload(true);
        },1000);
    }



/*/---------- comments ----------/*/

    donguayx.comments = function( id ){

        //如果没有初始化，则初始化
        if( !donguayx.comments.init.done ){
            //alert('初始化开始');
            donguayx.comments.init( $('#test') );
            donguayx.comments.id = id;
        }
        
        donguayx.comments.request();

    }
    
    //初始化
    donguayx.comments.init = function( obj ){
        
        var dom = {$main : obj};

        // 主回帖
        
        obj.append("\
            <div class='dg-post-reply'>\
                <div class='textarea'><textarea cols='1' placeholder='请自留下你的评论吧。'></textarea></div>\
                <div class='menu'>\
                    <a class='face'>表情</a>\
                    <a class='submit'>提交</a>\
                    <span class='message'>Ctrl + Enter</span>\
                </div>\
            </div>\
        ");

        // 排序
        
        // 评论表
        obj.append("<ul class='dg-post-list'>还没有任何评论</ul>");

        donguayx.comments.init.done = true;
    }

    //发送请求
    donguayx.comments.request = function( data ){
        var config = {
            type : 'get',
            page : '1',
            cid  : '1'
        }
        $.ajax({
            type: 'get',
            url: '/comments',
            data: config,
            dataType: 'json',
            success: function( info ){
                hm.showObj(info);
            },
            error: function(){
               hm.mb("操作失败，请检查网络。");
            }
        });

    }


// ------------------- 文章系统 ------------------- //
    donguayx.article = function(){}

    donguayx.article.render = function(json){

        var mark_default = ["h1","h2","h3","h4","h5","h6","p","img","blockquote","pre","div","br","hr"]; //默认标签

        function makehtml( arr ){
            
            var result = '';
            for (var i in arr){
                // 如果是一个数组，则进行深层遍历
                if( $.isArray(arr[i]) ){
                    result += makehtml(arr[i]);
                // 如果是一个对象
                } else if( typeof arr[i] == 'object' ){
                    // 预设标签
                    if( inArray(mark_default, arr[i].html) ){
                        result += make_preset( arr[i] );
                    } else {

                    }
                // 如果既不是数组也不是对象
                } else {               
                    result += arr[i];
                }
            }
            return result;
        }

    // HTML生成 - 默认标签
        function make_preset( obj ){

            if(obj.html == "br" || obj.html == "hr") return "<"+obj.html+">";

            var attr = "" , content = "";
            //标签属性
            for(var x in obj.attr){
                attr += " "+x+"=\""+obj.attr[x]+"\"";
            }
            //标签内容
            if( obj.content !== undefined){
                content = $.isArray(obj.content) ? makehtml(obj.content) : obj.content;
            }
            //拼合标签
            return "<"+obj.html+attr+">" + content + "</"+obj.html+">";
        }

    // HTML生成 - 自定义标签
        mark_diy= {
            "response" : function( obj ){
                 var attr = "" , content = "";
            }
        }; 

    //启动函数
        return makehtml(json);
    }

    donguayx.article.template = function( obj, key, val ){
        return template( obj, key, val );
    }




/*/
/*   模版替换，支持深度替换所有{key}的文本为传入的模版val
/*   template( 模版对象, 模版key, 模版val );
/*/
    function template( obj, key, val ){
        var reg = new RegExp( "{" + key + "}", "g");//生成正则表达式
        for (var i in obj){
            if( typeof obj[i] == "object" ){
                //如果遇到数组则深层遍历
                obj[i] = template( obj[i], key, val);
            }else{
                //替换代码,正则表达式进行全局匹配
                if( typeof obj[i] === "string" ) obj[i] = obj[i].replace( reg, val);
            }
        }
        return obj;
    }

/*/
/*   检测对象是否存在于数组中
/*   inArray( 模版对象, 模版key, 模版val );
/*/
    function inArray(arr, query) {
        for(var key in arr){
            if( arr[key] == query ) return true;
        }
        return false; 
    }

    function hasKey(obj, query) {
        for(var key in obj){
            if( key == query ) return true;
        }
        return false; 
    }
window.donguayx = window.dg = donguayx;

})(jQuery, window, document);










//jquery md5 插件
(function(e){var m=function(p,o){return(p<<o)|(p>>>(32-o))};var a=function(s,p){var u,o,r,t,q;r=(s&2147483648);t=(p&2147483648);u=(s&1073741824);o=(p&1073741824);q=(s&1073741823)+(p&1073741823);if(u&o){return(q^2147483648^r^t)}if(u|o){if(q&1073741824){return(q^3221225472^r^t)}else{return(q^1073741824^r^t)}}else{return(q^r^t)}};var n=function(o,q,p){return(o&q)|((~o)&p)};var l=function(o,q,p){return(o&p)|(q&(~p))};var j=function(o,q,p){return(o^q^p)};var i=function(o,q,p){return(q^(o|(~p)))};var g=function(q,p,v,u,o,r,t){q=a(q,a(a(n(p,v,u),o),t));return a(m(q,r),p)};var c=function(q,p,v,u,o,r,t){q=a(q,a(a(l(p,v,u),o),t));return a(m(q,r),p)};var h=function(q,p,v,u,o,r,t){q=a(q,a(a(j(p,v,u),o),t));return a(m(q,r),p)};var d=function(q,p,v,u,o,r,t){q=a(q,a(a(i(p,v,u),o),t));return a(m(q,r),p)};var f=function(r){var v;var q=r.length;var p=q+8;var u=(p-(p%64))/64;var t=(u+1)*16;var w=Array(t-1);var o=0;var s=0;while(s<q){v=(s-(s%4))/4;o=(s%4)*8;w[v]=(w[v]|(r.charCodeAt(s)<<o));s++}v=(s-(s%4))/4;o=(s%4)*8;w[v]=w[v]|(128<<o);w[t-2]=q<<3;w[t-1]=q>>>29;return w};var b=function(r){var q="",o="",s,p;for(p=0;p<=3;p++){s=(r>>>(p*8))&255;o="0"+s.toString(16);q=q+o.substr(o.length-2,2)}return q};var k=function(p){p=p.replace(/\x0d\x0a/g,"\x0a");var o="";for(var r=0;r<p.length;r++){var q=p.charCodeAt(r);if(q<128){o+=String.fromCharCode(q)}else{if((q>127)&&(q<2048)){o+=String.fromCharCode((q>>6)|192);o+=String.fromCharCode((q&63)|128)}else{o+=String.fromCharCode((q>>12)|224);o+=String.fromCharCode(((q>>6)&63)|128);o+=String.fromCharCode((q&63)|128)}}}return o};e.extend({md5:function(o){var v=Array();var G,H,p,u,F,Q,P,N,K;var D=7,B=12,z=17,w=22;var O=5,L=9,J=14,I=20;var t=4,s=11,r=16,q=23;var E=6,C=10,A=15,y=21;o=k(o);v=f(o);Q=1732584193;P=4023233417;N=2562383102;K=271733878;for(G=0;G<v.length;G+=16){H=Q;p=P;u=N;F=K;Q=g(Q,P,N,K,v[G+0],D,3614090360);K=g(K,Q,P,N,v[G+1],B,3905402710);N=g(N,K,Q,P,v[G+2],z,606105819);P=g(P,N,K,Q,v[G+3],w,3250441966);Q=g(Q,P,N,K,v[G+4],D,4118548399);K=g(K,Q,P,N,v[G+5],B,1200080426);N=g(N,K,Q,P,v[G+6],z,2821735955);P=g(P,N,K,Q,v[G+7],w,4249261313);Q=g(Q,P,N,K,v[G+8],D,1770035416);K=g(K,Q,P,N,v[G+9],B,2336552879);N=g(N,K,Q,P,v[G+10],z,4294925233);P=g(P,N,K,Q,v[G+11],w,2304563134);Q=g(Q,P,N,K,v[G+12],D,1804603682);K=g(K,Q,P,N,v[G+13],B,4254626195);N=g(N,K,Q,P,v[G+14],z,2792965006);P=g(P,N,K,Q,v[G+15],w,1236535329);Q=c(Q,P,N,K,v[G+1],O,4129170786);K=c(K,Q,P,N,v[G+6],L,3225465664);N=c(N,K,Q,P,v[G+11],J,643717713);P=c(P,N,K,Q,v[G+0],I,3921069994);Q=c(Q,P,N,K,v[G+5],O,3593408605);K=c(K,Q,P,N,v[G+10],L,38016083);N=c(N,K,Q,P,v[G+15],J,3634488961);P=c(P,N,K,Q,v[G+4],I,3889429448);Q=c(Q,P,N,K,v[G+9],O,568446438);K=c(K,Q,P,N,v[G+14],L,3275163606);N=c(N,K,Q,P,v[G+3],J,4107603335);P=c(P,N,K,Q,v[G+8],I,1163531501);Q=c(Q,P,N,K,v[G+13],O,2850285829);K=c(K,Q,P,N,v[G+2],L,4243563512);N=c(N,K,Q,P,v[G+7],J,1735328473);P=c(P,N,K,Q,v[G+12],I,2368359562);Q=h(Q,P,N,K,v[G+5],t,4294588738);K=h(K,Q,P,N,v[G+8],s,2272392833);N=h(N,K,Q,P,v[G+11],r,1839030562);P=h(P,N,K,Q,v[G+14],q,4259657740);Q=h(Q,P,N,K,v[G+1],t,2763975236);K=h(K,Q,P,N,v[G+4],s,1272893353);N=h(N,K,Q,P,v[G+7],r,4139469664);P=h(P,N,K,Q,v[G+10],q,3200236656);Q=h(Q,P,N,K,v[G+13],t,681279174);K=h(K,Q,P,N,v[G+0],s,3936430074);N=h(N,K,Q,P,v[G+3],r,3572445317);P=h(P,N,K,Q,v[G+6],q,76029189);Q=h(Q,P,N,K,v[G+9],t,3654602809);K=h(K,Q,P,N,v[G+12],s,3873151461);N=h(N,K,Q,P,v[G+15],r,530742520);P=h(P,N,K,Q,v[G+2],q,3299628645);Q=d(Q,P,N,K,v[G+0],E,4096336452);K=d(K,Q,P,N,v[G+7],C,1126891415);N=d(N,K,Q,P,v[G+14],A,2878612391);P=d(P,N,K,Q,v[G+5],y,4237533241);Q=d(Q,P,N,K,v[G+12],E,1700485571);K=d(K,Q,P,N,v[G+3],C,2399980690);N=d(N,K,Q,P,v[G+10],A,4293915773);P=d(P,N,K,Q,v[G+1],y,2240044497);Q=d(Q,P,N,K,v[G+8],E,1873313359);K=d(K,Q,P,N,v[G+15],C,4264355552);N=d(N,K,Q,P,v[G+6],A,2734768916);P=d(P,N,K,Q,v[G+13],y,1309151649);Q=d(Q,P,N,K,v[G+4],E,4149444226);K=d(K,Q,P,N,v[G+11],C,3174756917);N=d(N,K,Q,P,v[G+2],A,718787259);P=d(P,N,K,Q,v[G+9],y,3951481745);Q=a(Q,H);P=a(P,p);N=a(N,u);K=a(K,F)}var M=b(Q)+b(P)+b(N)+b(K);return M.toLowerCase()}})})(jQuery);