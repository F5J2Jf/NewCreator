/*
author: JACKY
日期:2018-01-10 17:16:06
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import Prefab_shopCtrl from "../Shop/Prefab_shopCtrl";
import UserMgr from "../../GameMgrs/UserMgr";
import UiMgr from "../../GameMgrs/UiMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeTopCtrl;
//模型，数据处理
class Model extends BaseModel{ 
    myinfo=null;
    constructor()
	{
		super();
        //在这边去获取数据层的数据
        this.myinfo=UserMgr.getInstance().getMyInfo();
        console.log("我的数据是",this.myinfo)
    } 
    updateMyInfo()
    {
        this.myinfo=UserMgr.getInstance().getMyInfo();
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        sprite_head : null,                 //头像图片
        lab_lv : null,                      //等级
        lab_name : null,                    //名字
        lab_coin : null,               //左边金钱
        lab_gold : null,              //右边金钱
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.sprite_head = ctrl.sprite_head;
		this.ui.lab_lv = ctrl.lab_lv;
		this.ui.lab_name = ctrl.lab_name;
		this.ui.lab_coin = ctrl.lab_coin;
        this.ui.lab_gold = ctrl.lab_gold;
    }
    updateMyInfo()
    {       
        this.updateLv();
        this.updateName();
        this.updateCoin();
        this.updateGold();
        this.updateHead();
    }
    //更新头像图片
    public updateHead (){
        UiMgr.getInstance().setUserHead(this.ui.sprite_head.node, this.model.myinfo.headid, this.model.myinfo.headurl); 
    }
    //等级
    public updateLv(){
        this.ui.lab_lv.string = this.model.myinfo.lv
    }
    //名字
    public updateName(){
        this.ui.lab_name.string = this.model.myinfo.nickname
    }
    //左边金钱
    public updateCoin(){
        this.ui.lab_coin.string = this.model.myinfo.coin;
    }
    //右边金钱
    public updateGold(){
        this.ui.lab_gold.string = this.model.myinfo.gold;
    }
}
//c, 控制
@ccclass
export default class NodeTopCtrl extends BaseControl {
	//这边去声明ui组件
	@property(cc.Node)
	node_rightBtns:cc.Node = null
    
    @property(cc.Node)
    node_clickHead:cc.Node = null;
    
    @property(cc.Node)
    node_clickLeftMoney:cc.Node = null;
    
    @property(cc.Node)
    node_clickRightMoney:cc.Node = null;
    
    @property(cc.Sprite)
    sprite_head:cc.Sprite = null

    @property(cc.Label)
	lab_name:cc.Label = null;
	
	@property(cc.Label)
    lab_lv:cc.Label = null;

    @property(cc.Label)
	lab_coin:cc.Label = null;
	
	@property(cc.Label)
    lab_gold:cc.Label = null;
    
    
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'http.reqMyInfo' : this.http_reqMyInfo,
            'http.reqGetRelief':this.http_reqGetRelief,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
        //这什么鬼
        let chipName = 'chip1';
        let poolName = '_pool_'+chipName;
        this[poolName] = new cc.NodePool(poolName)
	}
	//绑定操作的回调
	connectUi()
	{
        let btns = this.node_rightBtns.children;
		this.connect(G_UiType.image,btns[0],this.btn_notice_cb,"公告");
		this.connect(G_UiType.image,btns[1],this.btn_setting_cb,"设置");
        this.connect(G_UiType.image,btns[2],this.btn_share_cb,"分享");
		this.connect(G_UiType.image,this.node_clickHead,this._onclick_head,"头像");
		this.connect(G_UiType.image,this.node_clickLeftMoney,this._onclick_leftMoney,"左边金钱");
		this.connect(G_UiType.image,this.node_clickRightMoney,this._onclick_rightMoney,"右边金钱");
	}
	start () { 
	}
    //网络事件回调begin

    //玩家信息更新
    private http_reqMyInfo (msg){
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
    private http_reqGetRelief(msg)
    {
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_notice_cb (node,event){ 
		//RoomMgr.getInstance().reqRoomVerify();
	}
	private btn_setting_cb (node,event){ 
        this.start_sub_module(G_MODULE.PlazaSetting); 
	}
	private btn_share_cb (node,event){ 
        this.start_sub_module(G_MODULE.Shared);
    }
    private _onclick_head (node,event){ 
        this.start_sub_module(G_MODULE.PlayerDetail);
    }
    private _onclick_leftMoney (node,event){ 
        this.start_sub_module(G_MODULE.Shop, (uiComp:Prefab_shopCtrl)=>{
            uiComp.buyCoin();
        });
    }
    private _onclick_rightMoney (node,event){
        console.log('_onclick_rightMoney')
        this.start_sub_module(G_MODULE.Shop, (uiComp:Prefab_shopCtrl)=>{
            uiComp.buyGold();
        });
	}
	//end
}