/**
 * create by JustinLin 2018.2.2 9:52
 */ 
export default class WxSdkMgr {
    private static _wxCtor : WxSdkMgr;
    public static getInstance () : WxSdkMgr {
        if (! this._wxCtor) {
            this._wxCtor = new WxSdkMgr();
        } return this._wxCtor;
    }

    private _loginCb : Function;
    private _shareCb : Function;

    /**
     * 初始化微信登录sdk
     * 登录成功的回调函数
     * @param appid 可选参数
     */
    InitWXSdk (cb : Function, appid ?: any) : any {
        if (cc.sys.isNative) {
            this._loginCb = cb;
            console.log("微信登录");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var o = jsb.reflection.callStaticMethod("com/xmwm/mahjong/AppActivity", 
                "startWX", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {

            }
        } else {
        }
    }

    /**
     * 微信分享
     * @param type : 0:分享到朋友圈   1：分享给好友
     * @param title : 分享的标题 如果image为false，则填写“”即可
     * @param content : 分享的内容 如果image为false，则填写“”即可
     * @param url : 分享的url 如果image为false，则填写“”即可
     * @param cb : 分享的回调函数
     */
    WxShare (type : number, title ?: string, content ?: string, url ?: string, image ?: boolean, cb ?: Function) : void {
        if (cc.sys.isNative) {
            this._shareCb = cb;
            console.log("微信分享");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                if (image) {
                    this.screenShoot((path)=>{
                        var o = jsb.reflection.callStaticMethod("com/xmwm/mahjong/AppActivity", 
                        "startShare", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", type, title, content, url, path);
                    });
                } else {
                    var o = jsb.reflection.callStaticMethod("com/xmwm/mahjong/AppActivity", 
                        "startShare", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", type, title, content, url, "");
                }
            } else if (cc.sys.os == cc.sys.OS_IOS) {

            }
        } else {
        }
    }

    /**
     * 截屏
     * @param  {[function]} func 回调函数
     * @return
     */
    screenShoot (func) : void {
        if (!cc.sys.isNative) return;
        let dirpath = jsb.fileUtils.getWritablePath() + 'ScreenShoot/';
        if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.createDirectory(dirpath);
        }
        let name = 'ScreenShoot-' + (new Date()).valueOf() + '.png';
        let filepath = dirpath + name;
        let size = cc.director.getVisibleSize();
        let rt = cc.RenderTexture.create(size.width, size.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        cc.director.getScene()._sgNode.addChild(rt);
        rt.setVisible(false);
        rt.begin();
        cc.director.getScene()._sgNode.visit();
        rt.end();
        rt.saveToFile('ScreenShoot/' + name, cc.ImageFormat.PNG, true, function() {
            cc.log('save succ');
            rt.removeFromParent();
            if (func) {
                func(filepath);
            }
        });
    };

    //分享成功回调
    shareSuccess () : void {
        if (this._shareCb) this._shareCb();
    }

    //openid, nickname. sex, language,city,province,country,headimgurl,privilege,unionid
    loginSuccess = function(userInfo){
        console.log('userinfo==================', userInfo);
        let labNode = new cc.Node();
        labNode.parent = cc.find("Canvas");
        let curLab = labNode.addComponent(cc.Label);
        curLab.fontSize = 80;
        curLab.lineHeight = 80;
        // userInfo = "\"" + userInfo + "\""; 
        let jsonObj = JSON.parse(userInfo);
        this._loginCb(jsonObj);
        console.log(jsonObj)
    }
 
}
window.G_JAVA_OUTPUT = WxSdkMgr.getInstance();