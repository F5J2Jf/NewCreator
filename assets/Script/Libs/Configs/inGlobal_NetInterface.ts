//网络请求的相关接口信息

const NET_INTERFACE = {
    main_login : '1',                               //登录主命令
    wxLogin : "1",								    //微信登录
    //----------
    main_platform : '2',                            //platform main
    getGameList : "1",						        //玩家获取游戏列表
    getPlatformInfo : "2",				            //玩家获取大厅信息
    getNotice : "3",						        //玩家获取公告信息
    getOnlineNum : "4",						        //玩家获取在线人数信息
    getRoomsList : "5",						        //玩家获取某个游戏的房间列表
    inRoom : "6",						            //玩家请求进入房间

    doHttp (...args){
        // let args = arguments;
        let str;
        for(let i = 0; i < args.length; i ++){
            if(str){
                str += '_' + args[i];
            }else{
                str = args[i];
            }
        }
        return '/'+str;
    },

    doSocket (...args){
        // let args = arguments;
        let str;
        for(let i = 0; i < args.length; i ++){
            if(str){
                str += '_' + args[i];
            }else{
                str = args[i];
            }
        }
        return '/'+str;
    }
}

export default NET_INTERFACE;