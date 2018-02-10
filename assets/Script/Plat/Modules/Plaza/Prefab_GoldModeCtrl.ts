/*
author: Justin
日期:2018-01-17 15:36:01
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BetCfg from "../../CfgMgrs/BetCfg";
import BetMgr from "../../GameMgrs/BetMgr";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
import GameIdCfg from "../../CfgMgrs/GameIdCfg";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_GoldModeCtrl;
//模型，数据处理
class Model extends BaseModel{
	gameId : number = 1;
	ccf : string = "jbc";
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		jbcArr : null,
		// node_rookie : null,
		// node_civilians : null,
		// node_localTyrants : null,
		// node_rookienone : null,
		// node_officer : null,
		// node_susinessman : null,
	};
	node=null;
	model=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.model = model;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.jbcArr = ctrl.Node_JBCNode.children;
		let bet =  BetCfg.getInstance();
		let jbc = bet.cfgs[this.model.ccf][this.model.gameId];
		let arr = this.ui.jbcArr;
		for (let i in arr) {
			arr[i].active = false;
		}
		for (let i in jbc) {
			let _jbc = jbc[i];
			let id = parseInt(i) - 1;
			arr[id].active = true;
			arr[id].getChildByName("label_EndPoints").getComponent(cc.Label).string = _jbc.base.dizhu;
			arr[id].getChildByName("label_Name").getComponent(cc.Label).string = _jbc.base.name;
		}
    }
}
//c, 控制
@ccclass
export default class Prefab_GoldModeCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "金币场类型主节点",
		type : cc.Node
	})
	Node_JBCNode : cc.Node = null;

	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;
	
	@property({
		tooltip : "菜鸟场",
		type : cc.Node
	})
	RookieBtn : cc.Node = null;
	
	@property({
		tooltip : "平民场",
		type : cc.Node
	})
	CiviliansBtn : cc.Node = null;
	
	@property({
		tooltip : "土豪场",
		type : cc.Node
	})
	LocalTyrantsBtn : cc.Node = null;
	
	@property({
		tooltip : "菜鸟场无赖子",
		type : cc.Node
	})
	RookieNoneBtn : cc.Node = null;
	
	@property({
		tooltip : "官甲场",
		type : cc.Node
	})
	OfficerBtn : cc.Node = null;
	
	@property({
		tooltip : "富商场",
		type : cc.Node
	})
	BusinessmanBtn : cc.Node = null;
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
		this.connect(G_UiType.image, this.CloseBtn, this.CloseBtn_cb, "关闭");
		this.connect(G_UiType.image, this.RookieBtn, this.RookieBtn_cb, "菜鸟场");
		this.connect(G_UiType.image, this.CiviliansBtn, this.CiviliansBtn_cb, "平民场");
		this.connect(G_UiType.image, this.LocalTyrantsBtn, this.LocalTyrantsBtn_cb, "土豪场");
		this.connect(G_UiType.image, this.RookieNoneBtn, this.RookieNoneBtn_cb, "菜鸟无赖子");
		this.connect(G_UiType.image, this.OfficerBtn, this.OfficerBtn_cb, "官甲场");
		this.connect(G_UiType.image, this.BusinessmanBtn, this.BusinessmanBtn_cb, "富商场");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private CloseBtn_cb () : void {
		this.finish();
	}
	//菜鸟
	private RookieBtn_cb () : void {
		BetMgr.getInstance().setBetType(1);
		this.JoinGoldRoom();
	}
	//平民
	private CiviliansBtn_cb () : void {
		BetMgr.getInstance().setBetType(2);
		this.JoinGoldRoom();
	}
	//土豪
	private LocalTyrantsBtn_cb () : void {
		BetMgr.getInstance().setBetType(3);

		this.JoinGoldRoom();
	}
	//菜鸟无赖子
	private RookieNoneBtn_cb () : void {
		BetMgr.getInstance().setBetType(4);
		this.JoinGoldRoom();
	}
	//官甲
	private OfficerBtn_cb () : void {
		BetMgr.getInstance().setBetType(5);
		this.JoinGoldRoom();
	}
	//富商
	private BusinessmanBtn_cb () : void {
		BetMgr.getInstance().setBetType(6);
		this.JoinGoldRoom();
	}

	private JoinGoldRoom () : void {
        BetMgr.getInstance().setGameId(this.model.gameId); 
		//在本地先判断下是否有足够金币加入金币场
		var ret=VerifyMgr.getInstance().checkCoin();
		if(!ret)
		{
			return;
		}
        //在这边验证加入 
        //金币场，直接从配置中读取座位数
        RoomMgr.getInstance().reqRoomVerify(); 
	}
    //end
    
    //设置游戏id
    setGameID (gameid:number){
        this.model.gameId = gameid;
    }
}