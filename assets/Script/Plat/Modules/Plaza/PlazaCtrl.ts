//大厅控制管理
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import PlatMgr from "../../GameMgrs/PlatMgr";

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
	//初始化ui
	initUi()
	{
		this.addPrefabNode(ctrl.Prefab_PlazaBottom);
		this.addPrefabNode(ctrl.Prefab_PlazaLeft);
		this.addPrefabNode(ctrl.Prefab_PlazaTop);
		this.addPrefabNode(ctrl.Prefab_PlazaRight);
		// this.ui['btn_notice']=ctrl.btn_notice;
		// this.ui['btn_setting']=ctrl.btn_setting;
		// this.ui['btn_share']=ctrl.btn_share;
		// this.ui['btn_sign']=ctrl.btn_sign;
		// this.ui['btn_first_punch']=ctrl.btn_first_punch;
		// this.ui['btn_task']=ctrl.btn_task;
		// this.ui['btn_competition']=ctrl.btn_competition;
		// this.ui['btn_shop']=ctrl.btn_shop;
		// this.ui['btn_mail']=ctrl.btn_mail;
		// this.ui['btn_backpack']=ctrl.btn_backpack;
		// this.ui['btn_friend']=ctrl.btn_friend;
		// this.ui['btn_box']=ctrl.btn_box;
	}
}
//c, 控制
@ccclass
export default class LoginCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property(cc.Prefab)
	Prefab_PlazaTop:cc.Prefab = null
	
	@property(cc.Prefab)
	Prefab_PlazaLeft:cc.Prefab = null;
	
	@property(cc.Prefab)
	Prefab_PlazaBottom:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_PlazaRight:cc.Prefab = null;

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
        }
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
		console.log('register button');
		
		// this.connect(G_UiType.image,this.ui.btn_sign,this.btn_sign_cb,"签到");
		// this.connect(G_UiType.image,this.ui.btn_first_punch,this.btn_first_punch_cb,"首冲");
		// this.connect(G_UiType.image,this.ui.btn_task,this.btn_task_cb,"任务");
		// this.connect(G_UiType.image,this.ui.btn_competition,this.btn_competition_cb,"竞赛");
		// this.connect(G_UiType.image,this.ui.btn_shop,this.btn_shop_cb,"商城");
		// this.connect(G_UiType.image,this.ui.btn_mail,this.btn_mail_cb,"邮件");
		// this.connect(G_UiType.image,this.ui.btn_backpack,this.btn_backpack_cb,"背包");
		// this.connect(G_UiType.image,this.ui.btn_friend,this.btn_friend_cb,"牌友");
		// this.connect(G_UiType.image,this.ui.btn_box,this.btn_box_cb,"包厢");
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
    
	// private btn_notice_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_setting_cb (node,event){
	// 	console.log('1')
	//RoomMgr.getInstance().reqRoomVerify();
	// }
	// private btn_share_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_sign_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_first_punch_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_task_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_competition_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_shop_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_mail_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_backpack_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_friend_cb (node,event){
	// 	console.log('1')
	// }
	// private btn_box_cb (node,event){
	// 	console.log('1')
	// }
	//end
}
	
	

	