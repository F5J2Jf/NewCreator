/*
author: JACKY
日期:2018-01-22 17:10:38
*/
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import ModuleMgr from "../../../Plat/GameMgrs/ModuleMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QzmjLogic from "../QzmjMgr/QzmjLogic";
import GameDetailresultCtrl from "./Prefab_GameDetailresultCtrl";
let Green = cc.color(24,221,40),Red = cc.color(220,24,63);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjFinishCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_score:null,
		node_icon:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.node_score = ctrl.node_score;
		this.ui.node_icon = ctrl.node_icon;
		this.setScore();
	}
	setScore(){
		for(let i = 0;i< this.ui.node_score.children.length;i++){
			console.log(QzmjLogic.getInstance().scores)
			let lbl_score = this.ui.node_score.children[i];
			let j = i+parseInt(RoomMgr.getInstance().getMySeatId());
			if(j>=4)j-=4;
			if(QzmjLogic.getInstance().scores){
				lbl_score.getComponent('cc.Label').string = QzmjLogic.getInstance().scores[j];
				parseInt(QzmjLogic.getInstance().scores[j])>0?lbl_score.color = Red:lbl_score.color = Green;
			}
			else{
				lbl_score.active = false
			}
		}
		if(QzmjLogic.getInstance().win_seatid == null){
			this.ui.node_icon.children[1].active = this.ui.node_icon.children[0].active = false;
		}else if(QzmjLogic.getInstance().win_seatid != RoomMgr.getInstance().getMySeatId()){
			this.ui.node_icon.children[2].active = this.ui.node_icon.children[0].active = false;
		}else{
			this.ui.node_icon.children[2].active = this.ui.node_icon.children[1].active = false;
		}	
	}
}
//c, 控制
@ccclass
export default class QzmjFinishCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	btn_gameInfo:cc.Node = null
	@property(cc.Node)
	btn_share:cc.Node = null
	@property(cc.Node)
	btn_again:cc.Node = null
	@property(cc.Node)
	node_score:cc.Node = null
	@property(cc.Node)
	node_icon:cc.Node = null
	@property(cc.Node)
	btn_close:cc.Node = null
	@property(cc.Node)
	btn_exit:cc.Node = null
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
		this.n_events={
			//网络消息监听列表 
			'http.reqRoomUsers':this.http_reqRoomUsers,  
        } 	
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.btn_gameInfo, this.btn_gameInfo_cb,'详细结算信息');
		this.connect(G_UiType.image, this.btn_share, this.btn_share_cb,'微信分享' );
		this.connect(G_UiType.image, this.btn_again, this.btn_again_cb, '再来一局');
		this.connect(G_UiType.image, this.btn_close, this.btn_close_cb, '关闭');
		this.connect(G_UiType.image, this.btn_exit, this.btn_exit_cb, '退出');
	}
	start () {
	}
	//网络事件回调begin
	http_reqRoomUsers(){
		this.finish();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_gameInfo_cb(){
		console.log("btn_gameInfo_cb");
		this.start_sub_module(G_MODULE.gameDetailResult, (prefabComp:Prefab_gameDetailResultCtrl)=>{
			console.log("btn_gameInfo_cb11111");
            prefabComp.showDetailResult();
        }));
	}
	btn_share_cb(){
		
	}
	btn_again_cb(){
		RoomMgr.getInstance().onceMore();
	}
	btn_close_cb(){
		RoomMgr.getInstance().backToRoom();  
	}
	btn_exit_cb(){
		//退出房间
	}
	//end
}