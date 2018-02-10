/**
 * create by JustinLin 2018.2.2 9:52
 */ 
export default class YySdkMgr {
    private static _yyCtor : YySdkMgr;
    public static getInstance () : YySdkMgr {
        if (! this._yyCtor) {
            this._yyCtor = new YySdkMgr();
        } return this._yyCtor;
    }

    /**
     * 初始化呀呀云语音sdk
     * @param uid 玩家uid
     * @param nickname 玩家名称
     * @param roomId 房间号
     */
    InitYaYaSdk (uid, nickname, roomId) : void {
        if (cc.sys.isNative) {
            console.log("初始化呀呀语音sdk");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var o = jsb.reflection.callStaticMethod("com/xmwm/mahjong/AppActivity", 
                "GameStart", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", 
                uid+"", nickname, roomId);
            } else if (cc.sys.os == cc.sys.OS_IOS) {

            }
        } 
    }

    /**
     * 登出呀呀语音sdk
     */
    LeaveRoom () : void {
        if (cc.sys.isNative) {
            console.log("退出房间登出呀呀语音sdk");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var o = jsb.reflection.callStaticMethod("com/xmwm/mahjong/AppActivity", 
                "EndStart", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {

            }
        } 
    }
}
