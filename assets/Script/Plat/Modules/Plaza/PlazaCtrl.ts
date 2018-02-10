//大厅控制管理
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import PlatMgr from "../../GameMgrs/PlatMgr";
import UserMgr from "../../GameMgrs/UserMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : LoginCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
    ui={
        prefab_Background : ctrl.Prefab_Background,
        prefab_Button_middle : ctrl.Prefab_Button_middle,
        prefab_Down_infoumation : ctrl.Prefab_Down_infoumation,
        prefab_Rank_list : ctrl.Prefab_Rank_list,
        prefab_The_announcement : ctrl.Prefab_The_announcement,
        prefab_Up_information : ctrl.Prefab_Up_information
    };
	//初始化ui
	initUi()
	{
        this.addPrefabNode(this.ui.prefab_Background);
        this.addPrefabNode(this.ui.prefab_Button_middle);
        this.addPrefabNode(this.ui.prefab_Down_infoumation);
        this.addPrefabNode(this.ui.prefab_Rank_list);
        this.addPrefabNode(this.ui.prefab_The_announcement);
        this.addPrefabNode(this.ui.prefab_Up_information);
	}
}
//c, 控制
@ccclass
export default class LoginCtrl extends BaseCtrl {
    //这边去声明ui组件
	@property(cc.Prefab)
	Prefab_Background:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_Button_middle:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_Down_infoumation:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_Rank_list:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_The_announcement:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_Up_information:cc.Prefab = null;

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
			'http.reqMyRoomState':this.http_reqMyRoomState,   
			'http.reqRoomEntry':this.http_reqRoomEntry,
			'http.reqRoomRecover':this.http_reqRoomRecover,
			'http.reqCreateFangKaRoom':this.http_reqCreateFangKaRoom,
			'http.reqFangKaEntry':this.http_reqFangKaEntry,
			'http.reqEnterMyFangKaRoom':this.http_reqEnterMyFangKaRoom,
        }
	}
	http_reqEnterMyFangKaRoom(msg)
	{
		this.start_module(G_MODULE.LoadingGame)
	}
	http_reqFangKaEntry(msg)
	{
		this.start_module(G_MODULE.LoadingGame)
	}
	http_reqCreateFangKaRoom(msg)
	{
		//请求进入房间的回调 
		this.start_module(G_MODULE.LoadingGame)
	}
	http_reqRoomRecover()
	{
		//恢复游戏 
		this.start_module(G_MODULE.LoadingGame)
	}
	http_reqRoomEntry()
	{
		//请求进入房间的回调 
		this.start_module(G_MODULE.LoadingGame)
	}
	http_reqMyRoomState(msg)
	{
		
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
	}
	initPlatFinish(){  
	}
	start () {
		//在这里去获取平台相关信息
		PlatMgr.getInstance().initPlat(this.initPlatFinish.bind(this));
	}
	//网络事件回调begin
 
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
}
	
	

	
