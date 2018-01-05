// 网页适配处理

const {ccclass, property} = cc._decorator;

@ccclass
export default class WEB{
    _isGameStart : Boolean
    _type_toolbar : string
    _isVertical : Boolean
    _firstDesignSize : any
    _designWidth : number
    _designHeight : number
    _lastHeight : number
    init (){
        this._isGameStart = false;
        this._isVertical = false;
        if(document){
            // this._initMobileWeb();
        }
    }

    initWeb (){
        if(cc.sys.isBrowser){
            //是在浏览器上
            //this._setSceneDir();
            //cc.view.enableAutoFullScreen(true);

        }
    }

    adaptSceneEX (){
        cc.view.enableAutoFullScreen(true);
        var designSize = cc.view.getDesignResolutionSize();
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.FIXED_WIDTH);
    }
    //更新场景的适配
    initSceneSize (){
        if(cc.sys.isMobile){
            var designSize = cc.view.getDesignResolutionSize();
            cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.FIXED_WIDTH);
        }
        //if(cc.sys.isBrowser && cc.sys.isMobile){
        //    var designSize = cc.view.getDesignResolutionSize();
        //    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.FIXED_WIDTH);
        //}
    }

    //去除抗锯齿处理
    _canvasReset (){
        if (cc['_renderType'] === cc.game['RENDER_TYPE_CANVAS']) {
            // cc.renderer.enableDirtyRegion(false);
            cc.view.enableRetina(true);
        }

    }

    //设置游戏横屏
    _setSceneDir (){
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
    }

    gameStart () {
        this._isGameStart = true;
    }

    _initMobileWeb () {
        this._addHideListener();
        if(cc.sys.isMobile) this._addResizeListener();
    }

    _addResizeListener () {
        // cc.view.resizeWithBrowserSize(true);
        // cc.view.adjustViewPort(true);
        // cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        window.addEventListener("resize", function(){
            if(this._isGameStart){
                var isLandscape = document.body.clientWidth > document.body.clientHeight;
                if(isLandscape){
                    this._isVertical = false;
                    if(this._lastHeight != window.innerHeight){
                        if(this._lastHeight && (this._lastHeight > window.innerHeight)){
                            //show toolbar
                            this._doSafariHandler();
                            return;
                        }
                        this._lastHeight = window.innerHeight;
                    }
                }
                this._isVertical = !isLandscape;
                // this._type_toolbar = G_TYPE.webMobile_design.toolbar_hide;
                this.adaptSceneSize();
            }
        }.bind(this));
    }

    _addHideListener () {
        var showStateName, showChange;
        if (typeof document.hidden !== "undefined") {
            showChange = "visibilitychange";
            showStateName = "visibilityState";
        } else if (typeof document['mozHidden'] !== "undefined") {
            showChange = "mozvisibilitychange";
            showStateName = "mozVisibilityState";
        } else if (typeof document['msHidden'] !== "undefined") {
            showChange = "msvisibilitychange";
            showStateName = "msVisibilityState";
        } else if (typeof document['webkitHidden'] !== "undefined") {
            showChange = "webkitvisibilitychange";
            showStateName = "webkitVisibilityState";
        }
        var self = this;
        document.addEventListener(showChange, function() {
            if(self._isGameStart){
                //var isShow = Boolean(document[showStateName]=="visible");
                if(Boolean(document[showStateName]=="visible")){
                    //回到游戏
                    // GG._resumeWebGame();
                }else{
                    //暂停游戏
                    // GG._pauseWebGame();
                }
            }
        }, false);
    }

    _doSafariHandler () {
        var userAgent = navigator.userAgent;
        if(userAgent.indexOf('Safari') > -1){
            // this._type_toolbar = G_TYPE.webMobile_design.toolbar_show;
            var offH = this._firstDesignSize.height * 0.13;
            this._changeDesign(this._firstDesignSize.width, this._firstDesignSize.height+offH);
            this.adaptSceneSize();
        }
    }

    _scrollGame (offH) {
        setTimeout(function(){
            window.scrollTo(0,offH*0.22);
        }, 100)
    }

    _changeDesign (width, height) {
        this._designWidth = width;
        this._designHeight = height;
    }

    _initData () {
        if(this._firstDesignSize) return;
        var designSize = cc.view.getDesignResolutionSize();
        if(designSize.width > designSize.height){
            this._firstDesignSize = {width:designSize.width, height:designSize.height};
        }else {
            this._firstDesignSize = {width:designSize.height, height:designSize.width};
        }
        if(window.innerHeight)this._lastHeight = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
        else this._lastHeight = designSize.height < designSize.width ? designSize.height : designSize.width;

        this._changeDesign(this._firstDesignSize.width, this._firstDesignSize.height);
        // this._type_toolbar = G_TYPE.webMobile_design.toolbar_hide;
    }
    adaptSceneSize () {
        this._initData();
        if(cc.sys.isMobile) {
            if(!cc.sys.isNative){
                if(this._isVertical){
                    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
                    cc.view.setDesignResolutionSize(this._firstDesignSize.width, this._firstDesignSize.height, cc.ResolutionPolicy.SHOW_ALL);
                }else{
                    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
                    switch (this._type_toolbar){
                        // case G_TYPE.webMobile_design.toolbar_hide:
                        case '1':
                            cc.view.setDesignResolutionSize(this._firstDesignSize.width, this._firstDesignSize.height, cc.ResolutionPolicy.EXACT_FIT);
                            break
                        // case G_TYPE.webMobile_design.toolbar_show:
                        case '2':
                            setTimeout(function () {
                                cc.view.setDesignResolutionSize(this._designWidth, this._designHeight, cc.ResolutionPolicy.FIXED_HEIGHT);
                                this._scrollGame(this._designHeight - this._firstDesignSize.height);
                            }.bind(this), 200)
                            break
                        default:
                            cc.view.setDesignResolutionSize(this._firstDesignSize.width, this._firstDesignSize.height, cc.ResolutionPolicy.EXACT_FIT);
                            break
                    }
                }
            }else{
                cc.view.setDesignResolutionSize(this._firstDesignSize.width, this._firstDesignSize.height, cc.ResolutionPolicy.EXACT_FIT);
            }
        }else {
            if(window.innerHeight < this._firstDesignSize.height){
                if(window.innerWidth <= this._firstDesignSize.width){
                    cc.view.setDesignResolutionSize(this._firstDesignSize.width, this._firstDesignSize.height, cc.ResolutionPolicy.FIXED_WIDTH);
                }else cc.view.setDesignResolutionSize(this._firstDesignSize.width, this._firstDesignSize.height, cc.ResolutionPolicy.SHOW_ALL);
            }else cc.view.setDesignResolutionSize(this._firstDesignSize.width, this._firstDesignSize.height, cc.ResolutionPolicy.SHOW_ALL);
        }
    }

    getLocalHost () {
        return window.location.host
    }

    //========================网页微信登录分享

    wx_init (){
        //let url = "https://open.weixin.qq.com/connect/qrconnect?appid=wxbe1d821b4f25052d&redirect_uri=http%3a%2f%2f192.168.88.106%3a7456%2f&response_type=code&scope=SCOPE&state=9987#wechat_redirect";
        //let url = "https://open.weixin.qq.com/connect/qrconnect?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
        let url = "https://open.weixin.qq.com/connect/qrconnect?";
        //redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
        //唯一标识
        let url_appid = "appid="+"wxbe1d821b4f25052d"+"&";
        //自己的网站地址
        let url_redirect = "redirect_uri="+"http%3a%2f%2f192.168.88.106%3a7456%2f";
        let url_responseType = "response_type=code"
        //应用授权域
        let url_scope = "scope=snsapi_login";
        //标识
        let url_state = "state="+'999';
        let url_end = "#wechat_redirect";

        let url_total = url + url_appid + url_redirect + url_responseType + url_scope + url_state + url_end;

    }
    
    //单例处理
    private static _instance : WEB;
    public static getInstance (){
        if(!this._instance){
            this._instance = new WEB();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}