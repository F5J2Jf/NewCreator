/*
author: JACKY
日期:2018-01-11 15:29:26
*/

import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import UiMgr from "../../../Plat/GameMgrs/UiMgr";
import ModuleMgr from "../../../Plat/GameMgrs/ModuleMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QzmjLogic from "../QzmjMgr/QzmjLogic";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import { QzmjDef } from "../QzMjMgr/QzmjDef";
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";
import QzmjResMgr from "../QzmjMgr/QzmjResMgr";

var aniCfg={
	op_hu:'hu',
	op_angang:'angang',
	op_bugang:'ani_bugang',
	op_gang:'gang',
	op_peng:'peng',
	op_chi:'chi',
	op_zimo:'zimo',
}
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjRoomCtrl;
//模型，数据处理
class Model extends BaseModel{ 
	mySeatId=null;
	myPrepared=null;
	myself=null; 
	jin=null;
	constructor()
	{
		super();

	}
	
	updateMyInfo(  )
	{
		// body 
		this.mySeatId=RoomMgr.getInstance().getMySeatId();
		this.myPrepared=RoomMgr.getInstance().preparemap[this.mySeatId] 
		this.myself=QzmjLogic.getInstance().players[this.mySeatId]
	}  
 
	updateMyPrepared(  )
	{
		// body
		this.myPrepared=RoomMgr.getInstance().preparemap[this.mySeatId] 
	} 
 
	clear(  )
	{ 
	}  
	recover(  )
	{
		// body
		this.clear();
		this.jin=QzmjLogic.getInstance().jin;
	} 
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		prepareFlags:null,
		btn_prepare:null,
		panel_round:null,
		lbl_roundcount:null,
		lbl_roundindex:null,
		lbl_roomid:null,
		lbl_cardcount:null,
		mjpoint:null,
		jin:null,
		lbl_shen:null,
		btn_exit:null,
		btn_help:null,
	};
	//private node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.ui.prepareFlags={}
		this.showComponents();
		this.initUi();
	}
	updatePrepareFlag(viewseatid,bPrepared)
	{
		this.ui.prepareFlags[viewseatid].active=bPrepared;
	}
	showComponents(){
		var rpparr=[ctrl.rpp_mycards,ctrl.rpp_handcard_1,ctrl.rpp_handcard_2,ctrl.rpp_handcard_3,ctrl.rpp_mjevent,
			ctrl.rpp_doorcard_0,ctrl.rpp_doorcard_1,ctrl.rpp_doorcard_2,
			ctrl.rpp_doorcard_3,ctrl.rpp_cardpool_0,ctrl.rpp_cardpool_1,ctrl.rpp_cardpool_2,
			ctrl.rpp_cardpool_3,ctrl.rpp_clock,ctrl.rpp_deposit,ctrl.rpp_dice]
		var prefabarr=[ctrl.Prefab_MaJiang_0,ctrl.Prefab_MaJiang_1,ctrl.Prefab_MaJiang_2,ctrl.Prefab_MaJiang_3,ctrl.Prefab_MjEvent,ctrl.Prefab_FourMaJiang_0,
			ctrl.Prefab_FourMaJiang_1,ctrl.Prefab_FourMaJiang_2,
			ctrl.Prefab_FourMaJiang_3,ctrl.Prefab_PoolMaJiang_0,ctrl.Prefab_PoolMaJiang_1,ctrl.Prefab_PoolMaJiang_2,ctrl.Prefab_PoolMaJiang_3,
			ctrl.Prefab_Clock,ctrl.Prefab_deposit,ctrl.Prefab_Dice]
		for(var i=0;i<rpparr.length;++i)
		{
			var rppnode=rpparr[i];
			var prefab=prefabarr[i]; 
			let prefabNode = cc.instantiate(prefab); 
			prefabNode.setPosition(rppnode.position);
			this.node.addChild(prefabNode);
		}
	
    	this.ui.prepareFlags[0]=ctrl.img_prepared_0;
		this.ui.prepareFlags[1]=ctrl.img_prepared_1;
		this.ui.prepareFlags[2]=ctrl.img_prepared_2;
		this.ui.prepareFlags[3]=ctrl.img_prepared_3;
	}
	//初始化ui
	initUi()
	{ 
		this.ui.btn_prepare=ctrl.btn_prepare; 
		this.ui.panel_round=ctrl.panel_round;
		this.ui.lbl_roundcount=ctrl.lbl_roundcount; 
		this.ui.lbl_roundindex=ctrl.lbl_roundindex;
		this.ui.lbl_roomid=ctrl.lbl_roomid;
		this.ui.lbl_cardcount=ctrl.lbl_cardcount;
		this.ui.mjpoint=ctrl.mjpoint;
		this.ui.jin=ctrl.jin;
		this.ui.lbl_shen=ctrl.lbl_shen;
		this.ui.btn_exit=ctrl.btn_exit;
		this.ui.btn_help=ctrl.btn_help; 
		for(var seatid =0;seatid<4;++seatid)
		{
			var viewseatid=RoomMgr.getInstance().getViewSeatId(seatid);
			var flag=this.ui.prepareFlags[viewseatid] 
			flag.active=RoomMgr.getInstance().preparemap[seatid];
 
		} 
		this.ui.btn_prepare.active=!this.model.myPrepared  
	} 
    
	updateRoundInfo(){ 
		this.ui.panel_round.active=true
		var roominfo=RoomMgr.getInstance().roominfo;
		this.ui.lbl_roundcount.string=roominfo.roundcount;
		this.ui.lbl_roundindex.string=roominfo.roundindex+1;
	}
	updateRoomId(){
		var roominfo=RoomMgr.getInstance().roominfo;
		this.ui.lbl_roomid.active=true 
		this.ui.lbl_roomid.string= `房间号:${roominfo.password}`;
	}
	updateLeftCardCount(  )
	{ 
		this.ui.lbl_cardcount.string=QzmjLogic.getInstance().getLeftCardCount();
	} 
 
	recover(  ){
		// body
		this.clear();
		this.updateJin();
	}
 
	//清除
	clear()
	{
		// body
		//this.ui.mjpoint.active=false
		this.ui.jin.active=false
		for (var seatid =0;seatid<4;seatid++)
		{
			this.ui.prepareFlags[seatid].active=false
		}
		this.ui.lbl_cardcount.node.active=false
		this.ui.lbl_shen.node.active=false 
	}  
 
	//显示金
	updateJin(){
		// // body 
		this.ui.jin.active=true 
		var face=this.ui.jin.getChildByName('face');    
		let texture = QzmjResMgr.getInstance().getCardTextureByValue(this.model.jin);
		let frame = new cc.SpriteFrame(texture);
		face.getComponent(cc.Sprite).spriteFrame = frame;    
	}

	//显示操作
	newOp(  ){
		// // body
		// var msg=this.model.curOp;
		// var op=fqmjconst.op_cfg[msg.event] 
		// var filename='effects/' .. FqmjRoomModel.aniCfg[op];
		// var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.opseatid)
		// var effect=this.loadCsb(filename) 
		// var effectnode=this.ui.effectnodes[viewseatid] 
		// effectnode:addChild(effect) 
		// var action=this.loadAction(filename)  
		// effect:runAction(action)
		// action:play("show",false);
		// var cb=function (  )
		// 	// body
		// 	effect:removeFromParent();
		// end
		// action:setFrameEventCallFunc(cb)  
	}
	showDianPao(  )
	{
		// // body
		// var filename='effects/pao';
		// var viewseatid=RoomMgr.getInstance().getViewSeatId(QzmjLogic.getInstance().curseat)
		// var effect=this.loadCsb(filename) 
		// var effectnode=this.ui.effectnodes[viewseatid] 
		// effectnode:addChild(effect) 
		// var action=this.loadAction(filename)  
		// effect:runAction(action)
		// action:play("show",false);
		// var cb=function (  )
		// 	// body
		// 	effect:removeFromParent();
		// end
		// action:setFrameEventCallFunc(cb) 
	}

	//显示流局
	drawGame(  )
	{
		// // body
		// var msg=this.model.curOp; 
		// var filename='effects/abort'; 
		// var effect=this.loadCsb(filename) 
		// var effectnode=this.ui.effectnodes[4] 
		// effectnode:addChild(effect) 
		// var action=this.loadAction(filename)  
		// effect:runAction(action)
		// action:play("show",false);
		// var cb=function (  )
		// 	// body
		// 	effect:removeFromParent();
		// end
		// action:setFrameEventCallFunc(cb) 
	}
    showCardCount(){
		this.ui.lbl_cardcount.node.active=true;
		this.ui.lbl_shen.node.active=true;
	}
}
//c, 控制
@ccclass
export default class QzmjRoomCtrl extends BaseCtrl {
	//这边去声明ui组件 
    @property(cc.Node)
	btn_prepare=null;
    @property(cc.Node)
	panel_round=null;
    @property(cc.Label)
	lbl_roundcount=null;
    @property(cc.Label)
	lbl_roundindex=null;
    @property(cc.Label)
	lbl_roomid=null;
    @property(cc.Label)
	lbl_cardcount=null;
    @property(cc.Node)
	mjpoint=null;
    @property(cc.Node)
	jin=null;
    @property(cc.Label)
	lbl_shen=null;
    @property(cc.Node)
	btn_exit=null;
    @property(cc.Node)
	btn_help=null;
    @property({
		tooltip : "麻将界面设置按钮",
		type : cc.Node
	})
	btn_setting : cc.Node = null;
    @property({
		tooltip : "麻将界面设置预制资源",
		type : cc.Prefab
	})
	Prefab_Setting : cc.Prefab = null;


	//这边下面是麻将重要组件 
    @property(cc.Prefab)
	Prefab_FourMaJiang_0=null;
    @property(cc.Prefab)
	Prefab_FourMaJiang_1=null;
    @property(cc.Prefab)
	Prefab_FourMaJiang_2=null;
    @property(cc.Prefab)
	Prefab_FourMaJiang_3=null;

	@property(cc.Prefab)
	Prefab_MaJiang_0=null;
	@property(cc.Prefab)
	Prefab_MaJiang_1=null;
	@property(cc.Prefab)
	Prefab_MaJiang_2=null;
	@property(cc.Prefab)
	Prefab_MaJiang_3=null;

	
	@property(cc.Prefab)
	Prefab_PoolMaJiang_0=null;
	@property(cc.Prefab)
	Prefab_PoolMaJiang_1=null;
	@property(cc.Prefab)
	Prefab_PoolMaJiang_2=null;
	@property(cc.Prefab)
	Prefab_PoolMaJiang_3=null;

	
	@property(cc.Prefab)
	Prefab_Clock=null;


	@property(cc.Prefab)
	Prefab_deposit=null;


	@property(cc.Prefab)
	Prefab_MjEvent=null;
	 
	@property(cc.Prefab)
	Prefab_Dice=null;
    //以下是占位图
	@property(cc.Node)
	rpp_dice=null;
	@property(cc.Node)
	rpp_mycards=null;
	@property(cc.Node)
	rpp_handcard_1=null;
	@property(cc.Node)
	rpp_handcard_2=null;
	@property(cc.Node)
	rpp_handcard_3=null;
	@property(cc.Node)
	rpp_mjevent=null;
	@property(cc.Node)
	rpp_doorcard_0=null;
	@property(cc.Node)
	rpp_doorcard_1=null;
	@property(cc.Node)
	rpp_doorcard_2=null;
	@property(cc.Node)
	rpp_doorcard_3=null;
	@property(cc.Node)
	rpp_cardpool_0=null;
	@property(cc.Node)
	rpp_cardpool_1=null;
	@property(cc.Node)
	rpp_cardpool_2=null;
	@property(cc.Node)
	rpp_cardpool_3=null;
	@property(cc.Node)
	rpp_clock=null;
	@property(cc.Node)
	rpp_deposit=null;
   
	//四个准备标志
	@property(cc.Node)
	img_prepared_0=null,
	@property(cc.Node)
	img_prepared_1=null,
	@property(cc.Node)
	img_prepared_2=null,
	@property(cc.Node)
	img_prepared_3=null,

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		this.initMvc(Model,View); 
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
			'onLeaveRoom':this.onLeaveRoom, 
			'onPrepare':this.onPrepare,     
			'onEvent':this.onEvent,  
			onSeatChange:this.onSeatChange,
			'http.reqRoomUsers':this.http_reqRoomUsers, 
			'http.reqExitRoom':this.http_reqExitRoom,
			onSyncData:this.onSyncData,
			onProcess:this.onProcess,
			onOp:this.onOp,     
			'http.reqSettle':this.http_reqSettle,
			'http.reqDisbandRoom':this.http_reqDisbandRoom,
			'onDisbandRoom':this.onDisbandRoom,
			'http.reqRoomInfo':this.http_reqRoomInfo, 
        } 		
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		// this.connect(uitype.layout,this.ui.panel_round,this.panel_round,'查看房卡玩法') 
		// this.connect(uitype.button,this.ui.btn_help,this.btn_help,'帮助')  
		// this.connect(uitype.button,this.ui.btn_exit,this.btn_exit,'退出')  
		// this.connect(uitype.button,this.ui.btn_setting,this.btn_setting,'设置')
		// this.connect(uitype.button,this.ui.btn_chat,this.btn_chat,'聊天')
		// this.connect(uitype.button,this.ui.btn_prepare,this.btn_prepare,'准备')
        this.connect(G_UiType.image, this.btn_prepare, this.btn_prepare_cb, '点击准备')
		this.connect(G_UiType.image, this.btn_setting, this.btn_setting_cb, '点击设置')
	 
	}
	start () { 
		RoomMgr.getInstance().enterRoom();
	}
	//网络事件回调begin 
 
	http_reqRoomInfo() 
	{
		if(RoomMgr.getInstance().roomtype==1){ 
			this.view.updateRoundInfo();
			this.view.updateRoomId()
		}
	}  
	
	onEvent(msg)
	{
	 
	}
	onSyncData(  ){
		// body 
		this.model.recover();
		this.view.recover();
		this.ui.lbl_cardcount.active=true
		this.ui.lbl_shen.active=true
		this.view.updateLeftCardCount();  
	}
	onSeatChange(msg){
		// body
		this.view.updateLeftCardCount(); 
	}
	http_reqDisbandRoom(){
		//解散房间
		//周边平台与子游戏间，子游戏与平台间的切换要统一管理
		this.start_module(G_MODULE.Plaza)
	}

	onDisbandRoom(){
		//解散房间
		var okcb=function(){
			this.start_module(G_MODULE.Plaza)
		} 
		FrameMgr.getInstance().showMsgBox('房主有事，房间解散',okcb.bind(this)) 
	}

	http_reqExitRoom(  ){
		// body
		//返回游戏选择界面,理论上还要释放资源
		this.start_module(G_MODULE.Plaza)
	}
	http_reqRoomUsers(){
		// body  
		// if (RoomMgr.getInstance().roomstate==RoomMgr.state_oncemore) {  
		// 	RoomMgr.getInstance().reqPrepare()
		// }
		this.model.updateMyInfo();//更新我的信息
		this.updateMyPrepared();//更新我的装备状态
		this.model.clear();
		this.view.clear(); 
		this.view.initUi();
	} 
	onOp(msg){
		// body   
		var op=QzmjDef.op_cfg[msg.event]
		if (op == QzmjDef.op_chupai){  
 
		} 
		else
		{ 
			this.view.newOp();
			//显示点炮
			if (op==QzmjDef.op_hu){ 
				var huinfo=QzmjLogic.getInstance().huinfo;
				if (huinfo.hutime == QzmjDef.hutime_dianpao){ 
					this.view.showDianPao();
				}
			}
		}
	} 
	updateMyPrepared(  ){
		// body
		this.model.updateMyPrepared();
		this.ui.btn_prepare.active= !this.model.myPrepared 
	}
	
	onPrepare(msg)
	{
		var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.seatid)
	    this.view.updatePrepareFlag(viewseatid,true); 
		if(msg.seatid==this.model.mySeatId){ 
			this.updateMyPrepared();
		}

	}
	http_reqSettle(  ){
		// body
		this.view.clearMyCard(); 
		if (null == QzmjLogic.getInstance().win_seatid ){
			this.view.drawGame(); 
			//this.start_sub_module(platmodule.liuju);//显示流局
		}
		else
		{ 
			//this.start_sub_module(platmodule.fqmjsettle);//显示结算
		}
	}
	onProcess(msg){
		this.view.updateLeftCardCount();
		if (msg.process==QzmjDef.process_kaijin ){ 
			this.model.jin=msg.jin;
			this.view.updateJin();
		}
		else if (msg.process==QzmjDef.process_fapai ){  
			this.view.showCardCount();
		 
		}
		else if( msg.process==QzmjDef.process_ready){ 
			this.process_ready(msg); 
		}
		else if (msg.process==QzmjDef.process_dingzhuang){
			this.process_dingzhuang();
		}
		else if (msg.process==QzmjDef.process_buhua ){ 
			this.process_buhua(msg);
		}
	}
	
	process_buhua(msg){ 
	}
	process_dingzhuang()
	{
		for (var seatid =0;seatid<4;++seatid){  
			this.ui.prepareFlags[seatid].active=false
		} 
	}    
	process_ready(){
		// body
		this.model.clear();
		this.view.clear();
	}
	onLeaveRoom(msg){
		var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.seatid)
		this.ui.prepareFlags[viewseatid].active=false
	}
	btn_chat_cb( ){

	} 
	
	btn_prepare_cb( ){ 
		RoomMgr.getInstance().reqPrepare()
		// if (RoomMgr.getInstance().roomstate==RoomMgr.state_stayinroom){
		// 	RoomMgr.getInstance().onceMore()
		// }  
		// else
		// {
		// 	RoomMgr.getInstance().reqPrepare()
		// }
	}  
	btn_help_cb(){
		console.log("房间帮助")
	}
	panel_round_cb(){
		console.log("查看房间玩法")
	}
	 
 
	op_chupai(msg){ 
		//收到出牌的指令了
		//不是自己 
		if (this.model.mySeatId != QzmjLogic.getInstance().curseat ){ 
			return;
		}
		this.model.disabledOp();
		this.model.cursel=0; 
		this.view.updateCards(false);
		
	}

	btn_exit_cb( ){
		if (RoomMgr.getInstance().bGameIsStated) {
			var okcb=function(  )
			{
				// body
				RoomMgr.getInstance().reqExitRoom()
			}
 
			FrameMgr.getInstance().showMsgBox('游戏已经开始了,此时退出游戏,你的牌局将交由机器管家代打,输了怪我咯!',okcb.bind(this)); 
			return;
		}
		else{ 
			var  roominfo = RoomMgr.getInstance().roominfo; 
			if (roominfo.owner==UserMgr.getInstance().uid){
				var okcb=function(  )
				{
					// body
					RoomMgr.getInstance().reqDisbandRoom() 
				}
				FrameMgr.getInstance().showMsgBox('开局前退出将解散房间,不消耗房卡!',okcb.bind(this));  
				return;
			}
		}
		RoomMgr.getInstance().reqExitRoom()
	} 

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_setting_cb () : void {
		// this.start_sub_module(G_MODULE.RoomSetting);
		let node = cc.instantiate(this.Prefab_Setting);
		cc.find("Canvas").addChild(node);
	}
	//end
}