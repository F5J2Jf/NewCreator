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
        sprite_head : null,              //头像图片
        lab_name : null,               //名字
        lab_id : null,                  //id
        lab_diamonds: null,             //右边金钱
        node_clickBindAgent:null,       //绑定代理
        node_clickSafety:null,          //安全认证
        node_clickRealName:null         //实名认证
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.node_clickHead = ctrl.node_clickHead;
        this.ui.node_clickRightMoney = ctrl.node_clickRightMoney;
		this.ui.sprite_head = ctrl.sprite_head;
		this.ui.lab_name = ctrl.lab_name;
        this.ui.lab_id = ctrl.lab_id;
        this.ui.lab_diamonds = ctrl.lab_diamonds;
        this.ui.node_clickBindAgent = ctrl.node_clickBindAgent;
        this.ui.node_clickSafety = ctrl.node_clickSafety;
        this.ui.node_clickRealName = ctrl.node_clickRealName;
    }
    updateMyInfo()
    {       
        this.updateName();
        this.updateID();
        this.updateDiamonds();
        this.updateHead();
    }
    //更新头像图片
    public updateHead (){
        UiMgr.getInstance().setUserHead(this.ui.sprite_head.node, this.model.myinfo.headid, this.model.myinfo.headurl); 
    }
    //名字
    public updateName(){
        this.ui.lab_name.string = this.model.myinfo.nickname
        console.log("我的数据是",this.model.myinfo)
    }
    //id
    public updateID(){
        this.ui.lab_id.string = "ID:"+this.model.myinfo.id
    }
    //右边金钱
    public updateDiamonds(){
        this.ui.lab_diamonds.string = this.model.myinfo.gold;
    }
}
//c, 控制
@ccclass
export default class NodeTopCtrl extends BaseControl {
	//这边去声明ui组件
    @property(cc.Node)
    node_clickHead:cc.Node = null;
    
    @property(cc.Node)
    node_clickRightMoney:cc.Node = null;
    
    @property(cc.Sprite)
    sprite_head:cc.Sprite = null

    @property(cc.Label)
	lab_name:cc.Label = null;

    @property(cc.Label)
	lab_id:cc.Label = null;
	
	@property(cc.Label)
    lab_diamonds:cc.Label = null;

    @property(cc.Node)
    node_clickBindAgent:cc.Node = null;
    
    @property(cc.Node)
    node_clickSafety:cc.Node = null;

    @property(cc.Node)
    node_clickRealName:cc.Node = null;
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
        
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button,this.ui.node_clickHead,this._onclick_head,"头像");
		this.connect(G_UiType.button,this.ui.node_clickRightMoney,this._onclick_rightMoney,"右边金钱");
		this.connect(G_UiType.button,this.ui.node_clickBindAgent,this._onclick_bindAgent,"绑定代理");
		this.connect(G_UiType.button,this.ui.node_clickSafety,this._onclick_safety,"安全认证");
		this.connect(G_UiType.button,this.ui.node_clickRealName,this._onclick_realName,"实名认证");
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
    private _onclick_head (event){ 
        this.start_sub_module(G_MODULE.PlayerDetail);
    }
    private _onclick_rightMoney (event){
        console.log('_onclick_rightMoney')
        this.start_sub_module(G_MODULE.Shop, (uiComp:Prefab_shopCtrl)=>{
            uiComp.buyGold();
        });
	}
    private _onclick_bindAgent (event) {
    }
    private _onclick_safety (event) {
    }
    private _onclick_realName (event) {
    }
	//end
}
