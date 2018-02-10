/*
author: JACKY
日期:2018-01-16 14:40:18
*/
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import UiMgr from "../../../Plat/GameMgrs/UiMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import BehaviorMgr from "../../../Plat/GameMgrs/BehaviorMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : PlayerInfoCtrl;
//模型，数据处理
class Model extends BaseModel{
    userInfo:{} = null
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lbl_name:null,
        lbl_coin:null,
        lbl_ip:null,
        lbl_address:null,
        lbl_gameTimes:null,
        lbl_winCount:null,
        lbl_content:null,
        node_changecard:null,
        node_head:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.node_changecard = ctrl.node_changecard;
        this.ui.lbl_name = ctrl.lbl_name;
        this.ui.lbl_coin = ctrl.lbl_coin;
        this.ui.lbl_ip = ctrl.lbl_ip;
        this.ui.lbl_address = ctrl.lbl_address;
        this.ui.lbl_gameTimes = ctrl.lbl_gameTimes;
        this.ui.lbl_winCount = ctrl.lbl_winCount;
        this.ui.lbl_content = ctrl.lbl_content;
        this.ui.node_head = ctrl.node_head;
        
        this.addGrayLayer();
    }
    
    updateInfo (){
        this.ui.lbl_name.string = this.model.userInfo.nickname;
        this.ui.lbl_coin.string = this.model.userInfo.coin;
        this.ui.lbl_ip.string = '';
        if(cc.sys.isNative){
            this.ui.lbl_address.string = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAddress", "()Ljava/lang/String;").substring(0,15);
        }else{
            this.ui.lbl_address.string = "h5定位功能开发中";
        }
        let allTimes = this.model.userInfo.wincount + this.model.userInfo.losecount;
        this.ui.lbl_gameTimes.string = allTimes;
        this.ui.lbl_winCount.string = this.model.userInfo.wincount;
        this.ui.lbl_content.string = 'empty here';

        this.updateHead();
    }

    updateHead (){
        UiMgr.getInstance().setUserHead(this.ui.node_head, this.model.userInfo.headid, this.model.userInfo.headurl)   
    }
}
//c, 控制
@ccclass
export default class PlayerInfoCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Label)
    lbl_name:cc.Label = null

    @property(cc.Label)
    lbl_coin:cc.Label = null

    @property(cc.Label)
    lbl_ip:cc.Label = null

    @property(cc.Label)
    lbl_address:cc.Label = null

    @property(cc.Label)
    lbl_gameTimes:cc.Label = null

    @property(cc.Label)
    lbl_winCount:cc.Label = null

    @property(cc.Label)
    lbl_content:cc.Label = null

    @property(cc.Node)
    node_head:cc.Node = null

    @property(cc.Node)
    node_close:cc.Node = null

    @property(cc.Node)
    node_changecard:cc.Node = null

    @property(cc.Prefab)
    panel_changecard:cc.Prefab = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.node_close, this.finish, '点击关闭')
        this.connect(G_UiType.image, this.ui.node_changecard, this.node_changecard_cb, '点击换牌')
	}
	start () {

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private node_changecard_cb () : void {
        if (RoomMgr.getInstance().getMySeatId() == this.model.userInfo.seatId) return;
        BehaviorMgr.getInstance().changeSeatId = this.model.userInfo.seatId;
        let node = cc.instantiate(this.panel_changecard); 
        cc.find("Canvas").addChild(node);
    }
    //end
    
    //显示玩家信息，传入的对象和玩家自己的操作对象的结构是一样的
    setInfo (userInfo:{}){
        if(!userInfo) return;
        this.model.userInfo = userInfo;
        this.view.updateInfo();
        if (RoomMgr.getInstance().getMySeatId() == this.model.userInfo.seatId) {
            this.ui.node_changecard.active = false;
        };     
    }
}