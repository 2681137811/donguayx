/* 
 *  Hami.js
 *  
 *  |-JQuery.HM控件
 *  |   1.$.hmBanner();轮转横幅
 *  |   2.$.hmFixedTop();顶部固定
 *  |
 *  |-hm控件
 *  |   1.hm.dialog(); 对话窗口
 *  |   
 *  |-测试插件
 *  
 *  
 */


/*-- 1.JQuery.HM控件 --*/
(function( $, window, document, undefined ) {
    var hmfunction = {


        /*----------  $.hmBanner();轮转横幅  ----------*/
        hmBanner : function( options ){

            //【1】初始化函数
            var bannerHome = this,                              //对象本身（定位容器）
                bannerBox = $(bannerHome).children('ul'),       //对象总容器
                banner = $(bannerBox).children('li'),           //所有轮转容器
                bannerFocus = 0,                                //轮转焦点位置
                bannerTimer = null,                             //一个空的时间周期
                bannerRuning = false,                           //动画时候正在播放
                settings = {
                    bannerRunType       : 2 ,           //动画类型 [0:无，1:显现，2:左右滑动，3：上下滑动， 4：3D旋转]
                    bannerRunBtn        : 0 ,           //切换按钮 【暂无】[0:空，1:样式1，2:样式2...]
                    bannerRunTime       : 6 ,           //动画间隔 [4:4秒，6:6秒，8:8秒 10:10秒]
                    bannerRunSpeed      : 2 ,           //动画速度 [1:0.6秒，2:0.8秒，3:1秒,4:1.2秒]
                    bannerRunTiming     : 1 ,           //动画曲线 [1:匀速前进，2：冲刺，3:刹车，4，变速]
                    bannerDirBtn        : 1 ,           //目录圆点 [0:空，1:样式1，2:样式2...]
                    bannerDirBtnType    : 1             //目录类型 [0:无，1:点击切换]
                };

            if( banner.length == 1 ) return;           //判断轮转图数量，如果只有一个则【取消轮转】

            //【2】覆盖配置项参数
            if( options ) $.extend( settings, options );

            //【3】兼容性判断动画执行方式
            if( true ){
                //如果支持CSS3动画，则生成CSS3动画类         
                /*动画前缀*/if($.PBT.browserType == 'Chrome' || $.PBT.browserType == 'Safari')var actionName = '-webkit-animation',actionEnd = 'webkitAnimationEnd';else var actionName = 'animation',actionEnd = 'animationend';       
                /*动画名称*/if(settings['bannerRunType'] == 1){var actionType = 'alpha'}else if(settings['bannerRunType'] == 2){var actionType = 'slide'}else if(settings['bannerRunType'] == 4){var actionType = 'Horizontal'};
                /*动画时间*/if(settings['bannerRunSpeed'] == 1){var actionSpeed = '0.6s';}else if(settings['bannerRunSpeed'] == 2){var actionSpeed = '0.8s'}else if(settings['bannerRunSpeed'] == 3){var actionSpeed = '1s';}else if(settings['bannerRunSpeed'] == 4){var actionSpeed = '1.2s';}else{var actionSpeed = '0.6s';}
                /*动画侦听，触发回调函数*/
                $(banner).on(actionEnd,function(){
                    $(this).css(actionName,"");
                    bannerRuning = false;//设置播放状态
                });
            } else {
                //不支持CSS3动画

            }

            //【4】轮转初始化，搭建环境
            $(banner[0]).addClass('hm-thisBanner'); //把第一个banner置于顶层，并进行加载图片

            //【4-1】生成目录按钮
            if(settings['bannerDirBtn'] != 0){
                /*创建目录容器*/$(bannerBox).append("<div class='hm-bannerDirHome'></div>");
                /*循环创建按钮*/for(var i = 0; i < banner.length ; i++)$(bannerBox).children('.hm-bannerDirHome').append("<i num='"+i+"' class='hm-bannerDirBtn-"+settings['bannerDirBtn']+"'></i>");
                /*所有的按钮*/var bannerDir = $(bannerBox).children('.hm-bannerDirHome').children('i');  
                /*第一个焦点*/$(bannerDir[0]).addClass('hm-thisBtn');
                /*点击播放事件*/if(settings['bannerDirBtnType'] === 1){               
                    bannerDir.each(function(index){
                        $(this).click(function(){
                            if(bannerFocus != index && bannerRuning == false){
                                if(bannerFocus < index)bannerRun(index,"Left");else bannerRun(index,"Right");   
                                bannerAutoStop();
                                bannerAutoRun();
                            }else{
                                return;//如果是自身则不轮转
                            }
                        }).addClass('hm-bannerDirBtnCan');
                    });
                }
            }

            //【4-2】生成切换按钮
            if(settings['bannerRunBtn'] != 0){
                /*创建按钮容器*/$(bannerBox).append("<div class='hm-bannerRunHomeLeft'><div class='hm-bannerRunBtnLeft-"+settings['bannerRunBtn']+"'></div></div><div class='hm-bannerRunHomeRight'><div class='hm-bannerRunBtnRight-"+settings['bannerRunBtn']+"'></div></div>");
            }

            //懒加载


            /*【--轮转动画--】*/
            function bannerRun(index,dir){
                
                /*播放状态*/if(bannerRuning===true)return;else bannerRuning = true;
                /*判断方向*/if(!dir)dir="Left";
                /*焦点统一*/bannerFocus = index;
                //banner焦点的变换
                banner.removeClass('hm-lastBanner');                                                    //1.重置所有li的显示顺序
                banner.filter('.hm-thisBanner').addClass('hm-lastBanner').removeClass('hm-thisBanner'); //2.转换上一个banner为lastbanner
                banner.eq(index).addClass('hm-thisBanner');                                             //3.新的焦点li标签
                //目录焦点的变换
                if(settings['bannerDirBtn'] != 0){
                    $(bannerDir).removeClass('hm-thisBtn');
                    $(bannerDir).eq(index).addClass('hm-thisBtn');
                }
                //播放动画
                if($.PBT.animation){
                    banner.filter('.hm-thisBanner').css(actionName,actionType+dir+"In "+actionSpeed);
                    banner.filter('.hm-lastBanner').css(actionName,actionType+dir+"Out "+actionSpeed);
                }else{
                    //IE10以下的播放方式
                }

            }

            /*【--自动定时器--】*/     
            //定时器
            bannerAutoRun();//测试-启动自动定时器
            function bannerAutoRun(){            
                bannerTimer = setInterval(function(){            
                    bannerFocus++;
                    if(bannerFocus >= banner.length){
                        bannerFocus = 0;//如果轮播广告轮播到最底，则从头开始播放
                };
                bannerRun(bannerFocus);},settings['bannerRunTime']*1000);
            }
            //重置定时器
            function bannerAutoStop(){           
                clearInterval(bannerTimer);
            }
        }, 



        /*----------  $.hmFixedTop();顶部固定  ----------*/
        hmFixedTop : function( options ){  
            //【1】初始化函数
            var 
            target = this,              //对象本身（定位容器）
            $window = $(window),
            settings = {                
                start  : null,          //固定触发值
                end    : null,                
                startAdjust    : 0,     //顶部底部触发前后偏移
                endAdjust      : 0,
                topAdjust      : 0,
                bottomAdjust   : 0,           
                resize      : false,    //窗口变化事件绑定                
                inherit     : true,     //相对父容器底部停止固定                
                conditions  : false,    //其他触发条件
                parent      : this.parent()     //相对父容器
            },
            old_CSS = {
                "position" : this.css("position"),
                "top" : this.css("top"),
                "bottom" : this.css("bottom"),
            },
            start = null,
            end = null,
            type = 0;

            //【2】配置项参数
            if( options ) $.extend( settings, options );

            //【3】绑定滚动侦听
            if( settings.resize ) $window.bind( "resize", resize );
            $window.bind( "scroll", scroll );

            resize();
            function resize() {

                //计算最终开始浮动位置,如果直接传入了开始值则取该值
                if ( settings.start != null ) {
                    start = settings.start;
                } else if( start !== ( settings.parent.offset()['top'] + settings.startAdjust) ) {
                    start = target.offset()['top'] + settings.startAdjust;
                }

                //计算最终结束浮动位置,如果直接传入了结束值则取该值
                if( settings.end != null ){
                    end = settings.end;
                } else if( end !== ( settings.parent.offset()['top'] + settings.parent.outerHeight() + settings.endAdjust) ) {
                    end = settings.parent.offset()['top'] + settings.parent.outerHeight() + settings.endAdjust;
                }

                scroll();
            }

            //滚动函数
            function scroll (){

                //附加条件检查
                if( settings.conditions ) return;

                //初始触发范围判断
                if( $window.scrollTop() > start ){
                    if( $window.scrollTop() < ( end - target.outerHeight() - settings.endAdjust ) ){
                        //在范围之内
                        if( type !==1 ) target.css({"position":"fixed","top":settings.topAdjust + "px","bottom":"auto"}), type = 1;
                    }else{
                        //不再范围之内
                        if( type !==2 && settings.inherit ) target.css({"position":"absolute","top":"auto","bottom":settings.bottomAdjust+"px"}), type = 2;
                    }
                }else{
                    //修改为原来
                    if( type !==0 ) target.css(old_CSS), type = 0;
                }     
            }

            //--测试--
            // $("body").append("<ul id='hm-windowTest'><li id='test-1'></li><li id='test-2'></li><li id='test-3'></li></ul>");
            // $window.bind( "scroll resize", function(){
            //     $("#test-1").html("子窗顶距顶 = " + start + "；"+ "父窗底距顶 = " + end + ";" );                
            //     $("#test-2").html("容器高度 = " + target.outerHeight() + "; 零界点 = " + (end - target.outerHeight()) + ";" );
            //     $("#test-3").html("滚动条相对位置 = " + $window.scrollTop() + ";" + "type = " + type);
            // });
            // for(var i=1;i<10;i++){
            //     $("body").append("<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>");
            // }
            // $("#test-3").bind("click",function(){
            //     alert(end - target.outerHeight() - settings.endAdjust );
            // })
            // 
        }

    /*hm-function over*/
    }

    jQuery.fn.extend(hmfunction);

})(jQuery, window, document);







(function( $, window, document, undefined ) {
/*-------------------------------------  4.Hami控件       -------------------------------------*/

    var Hami = function(){

    };

    /*----------  4.1.Hami.dialog();对话窗口  ----------*/
    
    //  4.1.1对话窗口主程序
    Hami.childWindow = Hami.cw = function( options ){
        
        //4.1.1.1子窗口配置项目            
            /*默认参数*/var settings = {
                type:"alert",           //弹窗类型：1.警告窗alert  2.对话窗dialog  3.互动窗subwindow
                size:"normal",          //窗体尺寸：normal:正常  big：大尺寸  small：小尺寸
                title: null,            //窗口标题，字符串格式，如果为null则不显示
                conternt: null,         //窗口内容，字符串格式，如果为null则不显示
                animation: null,        //动画类型： null 无动画  1.渐隐  2.上下滑动  3.放大  4.闪现
                cancel: false,          //是否显示取消按钮
                closeBtn: false,        //是否显示关闭按钮
                closeBack: false,       //点击窗口外的背景是否关闭窗口
                back: true,             //是否显示背景遮罩
                drag: false,            //窗体是否可以拖动
                only: true,             //是否唯一窗体，默认打开一个窗体会自动关闭其他显示中的窗体
                center: true            //是否居中窗体
            }
            /*【--配置参数--】*/
            if( options ) $.extend( settings, options );

        //4.1.1.2子窗口初始化

            if(!Hami.childWindow.dom){                  
                if( !document.getElementById('hm-cw') ){                        
                    $("body").append("\
                        <div class='hm-cw' id='hm-cw'>\
                            <div class='hm-cw-home'>\
                                <div class='hm-cw-box'>\
                                    <div class='hm-cw-head'>\
                                        <div class='hm-cw-title'>提示</div>\
                                        <div class='hm-cw-close' onclick='hm.cw.winClose();'>×</div>\
                                    </div>\
                                    <div class='hm-cw-body'>\
                                        <div class='hm-cw-content'></div>\
                                    </div>\
                                    <div class='hm-cw-foot'>\
                                        <a class='hm-cw-cancel' style='display:none;'>取消</a>\
                                        <a class='hm-cw-agree hm-cw-foot-phoneBtn' onclick='hm.cw.winClose();'>确定</a>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    ");
                }
                
                Hami.childWindow.dom = document.getElementById('hm-cw');

            }else{
                /*【JQ】->重置旧窗口*/
                /*类型*/Hami.childWindow.dom.className = "hm-cw";//重置窗口类名
                /*内容*/$(Hami.childWindow.dom).find('.hm-cw-title,.hm-cw-content').html("");
                /*关闭按钮*/$(Hami.childWindow.dom).find('.hm-cw-close').css("display","none");
            }

        //4.1.1.3子窗口赋值
            /*【JQ】->类型*/if( settings.type !== "alert" )$(Hami.cw.dom).addClass("hm-cw-" + settings.type);
            /*【JQ】->标题*/if( settings.title )$(Hami.childWindow.dom).find('.hm-cw-title').html(settings.title.toString());
            /*【JQ】->内容*/if( settings.conternt )$(Hami.childWindow.dom).find('.hm-cw-content').html(settings.conternt.toString());
            /*【JQ】->关闭按钮*/if( settings.closeBtn )$(Hami.childWindow.dom).find('.hm-cw-close').css("display","block");

        //4.1.1.4子窗口显示
            if(settings.back)Hami.childWindow.back("show");//展示黑色遮罩
            /*【JQ】*/if($(Hami.childWindow.dom).css("display")=="none")$(Hami.childWindow.dom).fadeIn(300);
            //IE9-兼容函数
            /*【JQ】->窗口居中*///if(!Hami.PBT.transform && settings.center===true)$(hm.cw.dom).find('.hm-cw-box').css({"top":"45%","margin-top":"-"+$(hm.cw.dom).find('.hm-cw-box').height()/2+"px"});
            
    }/* ->对话窗口主程序*/


    // 4.1.2弹出警告框
        Hami.childWindow.alert = Hami.alert = function( content, title ){
            var settings = {
                type:"alert",
                title:"提示",
                conternt:null,
                closeBack: true,
                back: true
            }
            if( title )settings.title = title;
            if( content )settings.conternt = content;
            Hami.cw(settings);
        }/* ->弹出警告框*/


    // 4.1.3弹出警告框
        Hami.childWindow.dialog = Hami.dialog = function( content, title ){
            var settings = {
                type:"dialog",
                title:"提示",             
                conternt:null,
                closeBtn:true,
                back: true
            }
            if( title )settings.title = title;
            if( content )settings.conternt = content;
            Hami.cw(settings);
        }/* ->弹出警告框*/

    // 4.1.4弹出互动窗
        Hami.childWindow.subwindow = Hami.subwindow = function( content, title ){
            var settings = {
                type:"subwindow",
                title:"提示",
                conternt:null,
                closeBtn:true,
                back: true
            }
            if( title )settings.title = title;
            if( ontent )settings.conternt = content;
            Hami.cw( settings );
        }/* ->弹出警告框*/


    // 4.1.5黑色背景遮罩
    Hami.childWindow.back = function( action, settings ){
        
        //配置项
    
        //背景遮罩初始化方法 
        if(!Hami.cw.back.dom){
            //如果HTML不存在则自动创建
            if(!document.getElementById('hm-cw-back'))
                $("body").append("\
                    <div id='hm-cw-back' style='display:none;'>\
                    </div>\
                ");
            Hami.cw.back.dom = document.getElementById('hm-cw-back');
            //绑定关闭窗口函数
            //Hami.cw.winClose();
        }
        if(action == "show"){
            //展示遮罩,如果遮罩已显示则跳过该步骤    
            /*【JQ】*/if($(Hami.cw.back.dom).css("display")=="none")$(Hami.cw.back.dom).fadeIn(300);
        }else if(action == "hide"){
            //隐藏遮罩,如果遮罩已隐藏则跳过该步骤
            /*【JQ】*/if($(Hami.cw.back.dom).css("display")!="none")$(Hami.cw.back.dom).fadeOut(200);
        }
    }/* ->黑色遮罩展示、隐藏*/

    // 4.1.5按钮关闭事件
    Hami.childWindow.winClose = function( event ){

            //关闭子窗口黑色遮罩，如果存在的话
            if( Hami.cw.back.dom )Hami.cw.back("hide");
            if( Hami.cw.dom )$(Hami.cw.dom).fadeOut(200);


    }/* ->关闭子窗口函数*/



    /*----------  4.1.Hami.msaBanner();消息横幅  ----------*/
    Hami.msgBanner = Hami.mb = function( text, type, options ){
        var settings = {
            'text'  :  "",
            'type'  :  "",
            'color' : "",
            'opacity' : "",
            'time' : ""
        };

        //实体化DOM
        if( !Hami.msgBanner.dom ){
            
            if( !document.getElementById('hm-mb') ){
                $("body").prepend("<div id='hm-mb' class=''></div>");
            }            
            Hami.msgBanner.dom = $('#hm-mb');
        }

        //如果已经有动画，则停止动画并初始化
        Hami.msgBanner.dom.stop(true);

        //改变内容
        if( text ) 
            Hami.msgBanner.dom.html(text);
        if( type ){
            Hami.msgBanner.dom.attr("class",type);
        } else {
            Hami.msgBanner.dom.attr("class","");
        }

        //显示
        Hami.msgBanner.dom.fadeIn('200').delay('1200').fadeOut('200');
    }

/*-------------------------------------  测试插件       -------------------------------------*/
    Hami.showObj = function( obj, type ){
            var description = "";
            for(var i in obj){
                var property=obj[i];
                description += i + " = " + property + "\n";
            }
            (type === "write") ? $("body").append(description) : alert(description);
    }

    Hami.writeObj = function(obj){
            Hami.showObj(obj,"write")
    } 

    Hami.screen = function(){

        if( document.getElementById("hm-windowTest") ) return false;

        $("body").append("\
        	<ul id='hm-windowTest'>\
        		<li id='hm-window'></li>\
        		<li id='hm-screen'></li>\
        	</ul>\
        ");

        var win = $('#hm-window'),
        	scr = $('#hm-screen');
       
        ShowSize();
        $(window).on("resize",ShowSize);
        function ShowSize(){
            win.html("窗口宽度 = " + document.documentElement.clientWidth +"px； 窗口高度 = "+ document.documentElement.clientHeight + "px；" );//
            scr.html("屏幕宽度 = " + screen.width + "px； 屏幕高度 = "+ screen.height + "px；" );//
        }

    }

    Hami.test = {


        browser         :   getBrowser(),
        browserType     :   getBrowser("browserType"),
        browserPrefix   :   getBrowser("browserPrefix"),
        browserNum      :   getBrowser("browserNum"),
        /*圆角*/  borderRadius    :   'borderRadius' in document.documentElement.style,
        /*过渡*/  transition      :   'transition' in document.documentElement.style || '-webkit-transition' in document.documentElement.style,
        /*动画*/  animation       :   'animation' in document.documentElement.style || '-webkit-animation' in document.documentElement.style || '-o-animation' in document.documentElement.style || '-moz-animation' in document.documentElement.style,
        /*变换*/  transform       :   'transform' in document.documentElement.style || '-webkit-transform' in document.documentElement.style || '-ms-transform' in document.documentElement.style


    };




    /*  3.2浏览器兼容性代码  */
    function getBrowser(type){
        var browser = navigator.userAgent.toLowerCase(),browserType,browserPrefix,browserNum; //获取浏览器版本信息
        /*IE*/if(/msie/.test(browser) && !/opera/.test(browser)){       
            browserType = "IE";
            browserPrefix = "";
            browserNum = browser.match(/msie [\d.]/gi)[0].replace("msie ","");          
        /*谷歌*/}else if(/chrome/.test(browser)){     
            browserType = "Chrome";
            browserPrefix = "webkit";
            browserNum = browser.match(/chrome\/[\d.]+/)[0].replace("chrome/","");
        /*欧朋*/}else if(/opera/.test(browser)){      
            browserType = "Opera";
            browserPrefix = "o";
            browserNum = browser.match(/msie [\d.]/gi)[0].replace("opera/","");
        /*火狐*/}else if(/gecko/.test(browser) && !/webkit/.test(browser)){
            browserType = "Firefox";
            browserPrefix = "moz";
            browserNum = browser.match(/firefox\/[\d.]+/gi)[0].replace("firefox/","");
        /*苹果*/}else if(/version.*safari/.test(browser)){
            browserType = "Safari";
            browserPrefix = "webkit";
            browserNum = browser.match(/safari\/[\d.]+/gi)[0].replace("safari/","");
        }
        if(type==="browserType"){
            return browserType;
        }else if(type==="browserPrefix"){
            return browserPrefix;
        }else if(type==="browserNum"){
            return browserNum;
        }else{
            return "浏览器 类型:" + browserType + " " + "版本号:" + browserNum;
        }
    }


    
/*-------------------------------------  Hami控件         -------------------------------------*/
    window.Hami = window.hm = Hami;//在window中创建hm镜像

})(jQuery, window, document );


