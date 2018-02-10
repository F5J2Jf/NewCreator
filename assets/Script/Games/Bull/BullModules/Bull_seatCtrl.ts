/*
author: YOYO
日期:2018-02-02 10:05:31
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import UiMgr from "../../../Plat/GameMgrs/UiMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import BullLogic from "../BullMgr/BullLogic";
import BullPlayer from "../BullMgr/BullPlayer";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";

interface t_userInfo {
    coin:number,
    gold:number,
    headid:number,
    headurl:string,
    id:number,
    losecount:number,
    nickname:string,
    relief:number,
    sex:number,
    wincount:number
}

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_bull_SeatCtrl;
//模型，数据处理
class Model extends BaseModel{
    viewSeatId:number = null    //视图座位
    logicseatid = null          //逻辑座位，服务器那边的座位
    uid:number = null           //玩家uid
    playerCtrl:BullPlayer = null//玩家操作对象
    userinfo:t_userInfo =null   //玩家信息对象
	constructor()
	{
		super();
    }
    
    clear(){
        this.uid = null;
        this.logicseatid = null;
        this.userinfo = null;
    }

    updateLogicId(  )
	{
		// body
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.viewSeatId); 
		this.playerCtrl=BullLogic.getInstance().getPlayerInfo(this.logicseatid); 
		this.uid=RoomMgr.getInstance().users[this.logicseatid]; 
    } 
    
    updateUserInfo() 
	{ 
		this.userinfo=UserMgr.getInstance().getUserById(this.uid) 
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    // model:Model = null
	ui={
        //在这里声明ui
        node_img_head:null,
        lbl_name:null,
        lbl_money:null,
        node_img_master:null
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
        this.ui.node_img_head = ctrl.node_img_head;
        this.ui.lbl_name = ctrl.lbl_name;
        this.ui.lbl_money = ctrl.lbl_money;
        this.ui.node_img_master = ctrl.node_img_master;
        
    }

    //清除
	clear( )
	{
        this.resetHead();
        this.updateMoney();
        this._updateName();
	} 

    //更新玩家信息
    updateUserInfo (){
        this._updateHead();
        this.updateMoney();
        this._updateName();
    }
    //更新金钱
    updateMoney(){
        if(this.model.userinfo) this.ui.lbl_money.string = this.model.userinfo.coin;
        else this.ui.lbl_money.string = '';
    }
    //显示为房主
    setMaster(){
        let pos = cc.p(this.node.x + this.node.width/2, this.node.y + this.node.height/2);
        this.ui.node_img_master.position = pos;
    }

    //=====================
    
    //显示头像
    private _updateHead (){
        if(!this.ui.node_img_head._defaultHead){
            this.ui.node_img_head._defaultHead = this.ui.node_img_head.getComponent(cc.Sprite).spriteFrame;
        };
        UiMgr.getInstance().setUserHead(this.ui.node_img_head, this.model.userinfo.headid, this.model.userinfo.headurl);
    }
    //更新名字
    private _updateName(){
        if(this.model.userinfo) this.ui.lbl_name.string = this.model.userinfo.nickname;
        else this.ui.lbl_name.string = '';
    }
    private resetHead (){
        if(this.ui.node_img_head._defaultHead){
            this.ui.node_img_head.getComponent(cc.Sprite).spriteFrame = this.ui.node_img_head._defaultHead;
        }
    }
}
//c, 控制
@ccclass
export default class Prefab_bull_SeatCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
    //这边去声明ui组件
    @property({
        type:cc.Node,
        displayName:"headImg"
    })
    node_img_head:cc.Node = null
    @property({
        type:cc.Label,
        displayName:"nameLabel"
    })
    lbl_name:cc.Label = null
    @property({
        type:cc.Label,
        displayName:"moneyLabel"
    })
    lbl_money:cc.Label = null
    @property({
        type:cc.Node,
        displayName:"masterImg"
    })
    node_img_master:cc.Node = null

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        this.model.viewSeatId = this.node.parent.children.indexOf(this.node);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
			'onEnterRoom':this.onEnterRoom,
			'onLeaveRoom':this.onLeaveRoom,
			// onSyncData:this.onSyncData,
			// onSeatChange:this.onSeatChange,
			'http.reqRoomUsers':this.http_reqRoomUsers, 
			// onProcess:this.onProcess,
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
	}
	start () {
        
	}
    //网络事件回调begin
    onEnterRoom(msg){ 
		if (this.model.logicseatid !=msg.seatid){ 
			return;
		} 
		this.model.uid=msg.user;  
    }
    onLeaveRoom(msg){ 
		if (this.model.logicseatid==msg.seatid){
			this.model.clear(); 
			this.view.clear();
		}
    }
    http_reqRoomUsers(msg)
	{
		// body
	   this.model.updateLogicId();
	   this.view.clear(); 
    } 
    http_reqUsers(msg){
        console.log('接受到玩家信息', msg)
        // body 
        if(this.model.uid==null){ 
            return;
        }
        this.model.updateUserInfo(); 
        this.view.updateUserInfo(); 
        if(this.model.viewSeatId == 0){
            this.view.setMaster();
        }
    }
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end

    //初始化界面UI上对应的id
    initViewSeatId (viewSeatId:number){
        this.model.viewSeatId = viewSeatId;
    }
}