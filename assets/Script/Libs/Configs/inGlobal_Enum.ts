//枚举
const Enum = {
        // PRODUCT_VER : 6,	                                    //产品版本
        // //传输信息的长度
        // LEN_MD5 : 33,									        //加密密码
        // LEN_ACCOUNTS : 32,									    //帐号长度
        // LEN_MACHINE_ID : 33,								    //序列长度
        // LEN_MOBILE_PHONE : 12,									//移动电话
    
        compName : cc.Enum({
            clickAgent : "Part_setClickEvent",                  //点击事件处理
            touchLimit : "Part_touchLimit",                     //吞噬点击事件
            scrollDeal : "Part_dealScroll",                     //滚动容器处理
            uiContainer : "Part_uiContainer",                   //窗口容器
            uiBinding : "Part_uiBinding",                       //场景ui布局
            //场景 ， 大厅
            hall_manager : "S_hall_manager",
        }),
        prefabName : cc.Enum({
            loadingAni : 'Plaza/layer_loadingAni',
            createRoom : 'Plaza/layer_createRoom',
			gameSet : 'MaJiang/layer_roomSetting',
            enterRoom : 'Plaza/layer_enterRoom',
            setting : 'Plaza/layer_plazaSetting',
            agencyBind : 'Plaza/layer_AgencyBind',
            chatNode : 'Common/Chat/layer_ChatNode'
        }),
        //注册监听事件时候使用的别名
        // listenerAlias : cc.Enum({
        //     battleTimeChange : "when_battleTimeChange",                  //局数发生了变化
        // }),
        sceneName : cc.Enum({
            Login : "Login",                           //登录页面
            loadScene : "Loading",                     //加载页面
            Hall : "Plaza",                            //大厅场景名称
            Thirteen : "Thirteen",                     //十三水房间
            MaJiang : "MaJiang",                       //麻将房间
            Bull : "Bull",                             //牛牛房间
        }),
        localUrl: cc.Enum({
            //prefab_uiPage: "prefab_uiPage/",
            prefab_uiObject: "Prefabs/",
            audio : ''
            //bullType: "Room_bull_type/",
        }),
        topZIndex : cc.Enum({
            top1 : 1,                                                    //跑马灯层
            top2 : 2,                                                    //文本提示层
            top3 : 3,                                                    //网络请求动画层
            top4 : 4,
            top5 : 5,
            top6 : 6
        }),
        //表名枚举
        dict_tablesName : {
            audioName : 'Enum_audioName'                                  //音乐json文件
        },
        //麻将枚举
        maJiang:{
            //1-9 万 11-19 同 21-29 条 31-34 东南西北 35-37 中发白 38-46 花 47 不清楚什么鬼，像8条 
            maJiang_1 : '',
            maJiang_2 : '',
            maJiang_3 : '',
            maJiang_4 : '',
            maJiang_5 : '',
            maJiang_6 : '',
            maJiang_7 : '',
            maJiang_8 : '',
            maJiang_9 : '',
        }
}

export default Enum;