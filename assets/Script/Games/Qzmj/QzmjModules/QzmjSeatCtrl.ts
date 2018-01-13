
/*
author: JACKY
日期:2018-01-11 18:49:15
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

 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjSeatCtrl;
//模型，数据处理
class Model extends BaseModel{
	seatid=null;
	uid=null; 
	logicseatid=null;
	userinfo=null;
	hucount=0;
	player=null;
	constructor()
	{
		super();

	}
  
	initSeat(id)
	{
		this.seatid=id;  
	}
    //找到屏幕拥有者的逻辑坐标  
	clear(  )
	{
		// body
		this.uid=null;
	}  

	updateLogicId(  )
	{
		// body
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid);
		this.player=QzmjLogic.getInstance().players[this.logicseatid]; 
		this.uid=RoomMgr.getInstance().users[this.logicseatid]; 
	} 
	updateUserInfo() 
	{
		console.log("uid=",this.uid)
		this.userinfo=UserMgr.getInstance().getUserById(this.uid) 
	}

}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		img_frame:null,//头像背景
		img_head:null,//头像
		lbl_nickname:null,//昵称 
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
		this.ui.img_frame=ctrl.img_frame;
		this.ui.img_head=ctrl.img_head;
		this.ui.lbl_nickname=ctrl.lbl_nickname; 

		// this.ui.lbl_nickname=this.seek(this.node,'lbl_nickname'); 
		// this.ui.img_head=this.seek(this.node,'img_head');
		// this.ui.zhuangflag=this.seek(this.node,'zhuangflag');
		// this.ui.masterflag=this.seek(this.node,'masterflag');
		// this.ui.img_headframe=this.seek(this.node,'img_headframe');
		// this.ui.node_hua=this.seek(this.node,'node_hua');
		// this.ui.node_hua=this.seek(this.node,'node_hua');
		// this.ui.lbl_huacount=this.seek(this.node,'lbl_huacount');
		// this.ui.lbl_huacount:setString(0)
		this.clear();
	}

 
	//清除
	clear( )
	{
		this.node.active=false;
		// this.ui.zhuangflag:setVisible(false)
		// this.ui.masterflag:setVisible(false)
		// var filename='res/cocosstudio/pics/head/0.png'; 
		// this.ui.img_head:loadTexture(filename,0);
		// this.ui.lbl_nickname:setText('')
		// this.ui.node_hua:setVisible(false);
	} 
 
	updateInfo()
	{
		// body 
		// this.node:setVisible(true)
		// var userinfo=this.model.userinfo
		// var headpng=UserMgr.getInstance().getHeadPng(userinfo.headid)
		// this.ui.img_head:loadTexture(headpng,0) 
		// this.ui.lbl_nickname:setText(userinfo.nickname)
	} 
	showHua()
	{
		// body
		//this.ui.node_hua.setVisible(true)
	} 
	updateHua()
	{
		// body
		//this.ui.lbl_huacount.setString(this.model.player.getHuaCount())
	} 
}
//c, 控制
@ccclass
export default class QzmjSeatCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property
    seatId:Number = 0;
    @property(cc.Node)
    img_frame = null;
    @property(cc.Node)
    img_head = null; 
    @property(cc.Label)
    lbl_nickname = null; 
    @property(cc.Label)
    lbl_huacount = null; 
    @property(cc.Node)
    zhuangflag = null; 
    @property(cc.Node)
    masterflag = null; 
    @property(cc.Node)
    masterflag = null; 
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		this.initMvc(Model,View); 
		this.model.initSeat(this.seatId);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
			'onEnterRoom':this.onEnterRoom,
			'onLeaveRoom':this.onLeaveRoom,
			onSyncData:this.onSyncData,
			onSeatChange:this.onSeatChange,
			'http.reqRoomUsers':this.http_reqRoomUsers, 
			onProcess:this.onProcess,
			'http.reqUsers':this.http_reqUsers, 
        } 
	}
	//定义全局事件
	defineGlobalEvents()
	{    
	}
	//绑定操作的回调
	connectUi()
	{
		// this.connect(G_UiType.image,this.ui.img_headframe,this.showUserDetail,'显示用户详情') 
     
	}
	start () {
	}
	//网络事件回调begin
 
	onSyncData(msg)
	{
		// body
		if (QzmjLogic.getInstance().zhuangseat==this.model.logicseatid) { 
			this.ui.zhuangflag.setVisible(true)
			this.view.showHua();
			this.view.updateHua()
		}
	} 
	onProcess(msg)
	{ 
		if (msg.process==QzmjDef.process_dingzhuang)
		{
			this.process_dingzhuang(msg); 
		} 
		else if(msg.process==QzmjDef.process_buhua){
			this.process_buhua(msg); 
		}
	} 
	onSeatChange(  )
	{
		// body 
		if (this.model.logicseatid != QzmjLogic.getInstance().curseat){ 
			return;
		} 
		this.view.updateHua()
	} 
	process_buhua(  )
	{
		// body
		this.view.updateHua();
	}
	http_reqRoomUsers(msg)
	{
		// body
	   this.model.updateLogicId();
	   this.view.clear(); 
	} 
	process_dingzhuang(msg)
	{
		// body
		this.view.showHua();
		if (msg.zhuangseat!=this.model.logicseatid){ 
			return;
		}
		this.ui.zhuangflag.setVisible(true)
	} 
 
	onLeaveRoom(msg){ 
		if (this.model.logicseatid==msg.seatid){
			this.model.clear(); 
			this.view.clear();
		}
	}
	onEnterRoom(msg){ 
		if (this.model.logicseatid !=msg.seatid){ 
			return;
		} 
		this.model.uid=msg.user;  
	}

	onEnterRoom(msg){
		if (this.model.logicseatid !=msg.seatid){ 
			return;
		}
		this.model.uid=msg.user;  
	}

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
 

 
	http_reqUsers(  ){
	// body
		if(this.model.uid==null){ 
			return;
		}
		this.model.updateUserInfo(); 
		this.view.updateInfo(); 
	}
 
	showUserDetail(  )
	{
		// body
		if (this.model.uid!=null){ 
			// var ctrl=this.start_sub_module(platmodule.userdetail)
			// ctrl.setUid(this.model.uid)
		}
	} 
}